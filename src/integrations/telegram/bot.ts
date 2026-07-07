import TelegramBot from "node-telegram-bot-api";
import { env } from "../../config/env";
import { chat, clearSession } from "../../modules/conversation/orchestrator";

const nicheMessageMap: Record<string, string> = {
  nicho_financas: "Ich möchte meine Finanzen verbessern und mehr Geld verdienen.",
  nicho_tech: "Ich interessiere mich für Technologie und künstliche Intelligenz.",
  nicho_saude: "Ich möchte meine Gesundheit verbessern und fitter werden.",
  nicho_carreira: "Ich möchte meine Karriere voranbringen und ein erfolgreiches Business aufbauen.",
  nicho_marketing: "Ich möchte Marketing und Social Media lernen.",
  nicho_mindset: "Ich möchte meine Persönlichkeit entwickeln und mein Mindset verbessern."
};

export function createTelegramBot(): TelegramBot {
  const bot = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userId = String(chatId);
    const text = msg.text;

    if (!text) {
      return;
    }

    if (text === "/start") {
      clearSession(userId);
      await bot.sendMessage(
        chatId,
        "👋 Willkommen beim *GrowthBot DE*!\n\nIch bin dein persönlicher KI-Berater für digitale Weiterbildung.\n\n👇 *Was möchtest du gerade in deinem Leben verbessern?*",
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
      await bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Telegram message handler failed: ${message}`);
      await bot.sendMessage(chatId, "⚠️ Ein Fehler ist aufgetreten. Bitte versuche es erneut mit /restart");
    }
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId || !data) {
      return;
    }

    await bot.answerCallbackQuery(query.id);

    const mappedMessage = nicheMessageMap[data];
    if (!mappedMessage) {
      return;
    }

    try {
      await bot.sendChatAction(chatId, "typing");
      const reply = await chat(String(chatId), mappedMessage);
      await bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Telegram callback handler failed: ${message}`);
      await bot.sendMessage(chatId, "⚠️ Ein Fehler ist aufgetreten. Bitte versuche es erneut mit /restart");
    }
  });

  bot.on("polling_error", (error) => {
    console.error(`Polling error: ${error.message}`);
  });

  return bot;
}
