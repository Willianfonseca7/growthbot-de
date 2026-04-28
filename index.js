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
      "👋 Willkommen beim *GrowthBot DE*!\n\nIch helfe dir in 3 Schritten den besten digitalen Kurs für dein Ziel zu finden.\n\n*Was möchtest du gerade in deinem Leben verbessern?*",
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

// Mantém o serviço acordado no Render
const http = require("http");
const server = http.createServer((_req, res) => {
  res.writeHead(200);
  res.end("GrowthBot DE está vivo!");
});
server.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Servidor HTTP ativo para keep-alive");
});