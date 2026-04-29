const OpenAI = require("openai");
const catalog = require("./catalog");
const db = require("./database");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getCatalogText() {
  const todos = [
    ...catalog.camada1,
    ...catalog.camada2,
    ...catalog.camada3
  ];
  return todos.map(p =>
    `- ${p.nome} (${p.nicho.join(", ")}): ${p.descricao} | Comissão: €${p.comissao} | Link: ${p.link}`
  ).join("\n");
}

const SYSTEM_PROMPT = `Du bist ein freundlicher digitaler Berater namens GrowthBot.
Du hilfst Menschen, die besten Online-Kurse und digitalen Tools für ihre Ziele zu finden.

WICHTIG: Wenn der Nutzer seine Interesse bereits genannt hat (z.B. Finanzen, Gesundheit, KI, etc.),
gehe SOFORT zur Empfehlung über. Stelle KEINE weiteren Qualifizierungsfragen mehr.

Dein Ablauf:
1. Analysiere was der Nutzer möchte
2. Empfehle SOFORT NUR EIN passendes Produkt aus der Liste
3. Erkläre in 2-3 Sätzen warum dieses Produkt perfekt für ihn ist
4. Schicke den Link und fordere zum Kauf auf

WICHTIG:
- Empfehle immer nur 1 Produkt pro Gespräch
- Sei freundlich aber direkt und kurz
- Antworte immer auf Deutsch (oder Englisch wenn der Nutzer Englisch schreibt)
- Gehe DIREKT zur Empfehlung wenn das Interesse klar ist
- Bevor du den Link sendest, füge IMMER eine Zeile soziale Beweis ein, z.B.:
  "⭐ Über 2.000 zufriedene Kunden haben diesen Kurs bereits absolviert."
  oder "🏆 Einer der meistverkauften Kurse im DACH-Raum."
  oder "💬 'Dieser Kurs hat mein Leben verändert!' – echter Kundenfeedback"

Verfügbare Produkte:
${getCatalogText()}`;

// Detecta se a resposta contém uma recomendação de produto
function detectarProdutoRecomendado(reply) {
  const todos = [
    ...catalog.camada1,
    ...catalog.camada2,
    ...catalog.camada3
  ];
  for (const produto of todos) {
    if (reply.includes(produto.link) || reply.includes(produto.nome)) {
      return produto;
    }
  }
  return null;
}

async function chat(userId, userMessage) {
  // Busca sessão do banco
  let row = db.prepare("SELECT history FROM sessions WHERE user_id = ?").get(userId);
  let history = row ? JSON.parse(row.history) : [];

  history.push({ role: "user", content: userMessage });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...history
    ],
    max_tokens: 1000
  });

  const reply = response.choices[0].message.content;
  history.push({ role: "assistant", content: reply });

  // Salva sessão atualizada no banco
  db.prepare(`
    INSERT INTO sessions (user_id, history, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(user_id) DO UPDATE SET
      history = excluded.history,
      updated_at = excluded.updated_at
  `).run(userId, JSON.stringify(history));

  // Se o bot recomendou um produto, agenda follow-up 24h
  const produto = detectarProdutoRecomendado(reply);
  if (produto) {
    const scheduledAt = Math.floor(Date.now() / 1000) + 86400; // +24h
    db.prepare(`
      INSERT INTO followups (user_id, produto_id, produto_nome, produto_link, scheduled_at, sent)
      VALUES (?, ?, ?, ?, ?, 0)
      ON CONFLICT(user_id) DO UPDATE SET
        produto_id = excluded.produto_id,
        produto_nome = excluded.produto_nome,
        produto_link = excluded.produto_link,
        scheduled_at = excluded.scheduled_at,
        sent = 0
    `).run(userId, produto.nome, produto.nome, produto.link, scheduledAt);
  }

  return reply;
}

function clearSession(userId) {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM followups WHERE user_id = ?").run(userId);
}

module.exports = { chat, clearSession };