require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { chat, clearSession } = require("./conversation");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

console.log("🤖 GrowthBot DE está rodando...");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = String(chatId);
  const text = msg.text;

  if (!text) return;

  if (text === "/start") {
    clearSession(userId);
    await bot.sendMessage(chatId,
      "👋 Willkommen beim *GrowthBot DE*! 🚀\n\n" +
      "Ich bin dein persönlicher KI-Berater für digitale Weiterbildung.\n\n" +
      "✅ Über *500.000 Menschen* haben bereits mit unseren Empfehlungen ihr Leben verändert.\n\n" +
      "In nur *einem Klick* findest du den perfekten Kurs für dein Ziel — komplett kostenlos!\n\n" +
      "👇 *Was möchtest du gerade in deinem Leben verbessern?*",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "💰 Finanzen & Investieren", callback_data: "nicho_financas" },
              { text: "🤖 Technologie & KI", callback_data: "nicho_tech" }
            ],
            [
              { text: "💪 Gesundheit & Fitness", callback_data: "nicho_saude" },
              { text: "🚀 Karriere & Business", callback_data: "nicho_carreira" }
            ],
            [
              { text: "📱 Marketing & Social Media", callback_data: "nicho_marketing" },
              { text: "🧠 Persönlichkeit & Mindset", callback_data: "nicho_mindset" }
            ]
          ]
        }
      }
    );
    return;
  }

  if (text === "/restart") {
    clearSession(userId);
    await bot.sendMessage(chatId, "🔄 Gespräch neu gestartet! Was möchtest du verbessern?");
    return;
  }

  try {
    await bot.sendChatAction(chatId, "typing");
    const reply = await chat(userId, text);
    await bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error("Erro:", error.message);
    await bot.sendMessage(chatId, "⚠️ Ein Fehler ist aufgetreten. Bitte versuche es erneut mit /restart");
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const userId = String(chatId);
  const data = query.data;

  await bot.answerCallbackQuery(query.id);

  const nichoMap = {
    nicho_financas: "Ich möchte meine Finanzen verbessern und mehr Geld verdienen.",
    nicho_tech: "Ich interessiere mich für Technologie und künstliche Intelligenz.",
    nicho_saude: "Ich möchte meine Gesundheit verbessern und fitter werden.",
    nicho_carreira: "Ich möchte meine Karriere voranbringen und ein erfolgreiches Business aufbauen.",
    nicho_marketing: "Ich möchte Marketing und Social Media lernen.",
    nicho_mindset: "Ich möchte meine Persönlichkeit entwickeln und mein Mindset verbessern."
  };

  const mensagem = nichoMap[data];
  if (!mensagem) return;

  try {
    await bot.sendChatAction(chatId, "typing");
    const reply = await chat(userId, mensagem);
    await bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error("Erro callback:", error.message);
    await bot.sendMessage(chatId, "⚠️ Ein Fehler ist aufgetreten. Bitte versuche es erneut mit /restart");
  }
});

bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

const http = require("http");
const db = require("./database");

const server = http.createServer((req, res) => {
  // Redirect tracker — /redirect?id=produto&user=userId&url=linkAfiliado
  if (req.url.startsWith("/redirect")) {
    const params = new URL(req.url, "http://localhost").searchParams;
    const produtoId = params.get("id") || "unknown";
    const userId = params.get("user") || "unknown";
    const url = params.get("url");

    // Registra o clique
    db.prepare(`
      INSERT INTO clicks (user_id, produto_id) VALUES (?, ?)
    `).run(userId, produtoId);

    if (url) {
      res.writeHead(302, { Location: url });
      res.end();
    } else {
      res.writeHead(400);
      res.end("URL não informada");
    }
    return;
  }

  // Keep-alive padrão
  res.writeHead(200);
  res.end("GrowthBot DE está vivo!");
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Servidor HTTP ativo para keep-alive");
});