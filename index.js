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
    await bot.sendMessage(chatId, "👋 Willkommen beim GrowthBot DE! Ich helfe dir, die besten digitalen Kurse und Tools für deine Ziele zu finden.\n\nSchreib mir einfach, was du verbessern möchtest!");
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

bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

// Mantém o serviço acordado no Render
const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("GrowthBot DE está vivo!");
});
server.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Servidor HTTP ativo para keep-alive");
});