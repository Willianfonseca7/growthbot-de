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

Dein Ablauf:
1. Begrüße den Nutzer herzlich auf Deutsch
2. Stelle 3 kurze Qualifizierungsfragen:
   - Was möchtest du in deinem Leben gerade verbessern?
   - Hast du schon mal in Online-Kurse investiert?
   - Was ist dein Ziel in 6 Monaten?
3. Analysiere die Antworten und empfehle NUR EIN Produkt aus der Liste
4. Erkläre kurz warum dieses Produkt perfekt für ihn/sie ist
5. Schicke den Link und fordere zum Kauf auf

WICHTIG:
- Empfehle immer nur 1 Produkt pro Gespräch
- Sei freundlich aber direkt
- Antworte immer auf Deutsch (oder Englisch wenn der Nutzer Englisch schreibt)

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