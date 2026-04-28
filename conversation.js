const OpenAI = require("openai");
const catalog = require("./catalog");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const sessions = new Map();

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

Verfügbare Produkte:
${getCatalogText()}`;

async function chat(userId, userMessage) {
  if (!sessions.has(userId)) {
    sessions.set(userId, []);
  }

  const history = sessions.get(userId);
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

  return reply;
}

function clearSession(userId) {
  sessions.delete(userId);
}

module.exports = { chat, clearSession };