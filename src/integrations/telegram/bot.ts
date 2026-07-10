import TelegramBot from "node-telegram-bot-api";
import { env } from "../../config/env";
import {
  handleTelegramCallbackQuery,
  handleTelegramMessage,
  type TelegramTransport
} from "./handlers";

export function createTelegramBot(): TelegramBot {
  const bot = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true });
  const transport: TelegramTransport = {
    sendMessage: (chatId, text, options) => bot.sendMessage(chatId, text, options),
    sendChatAction: (chatId, action) => bot.sendChatAction(chatId, action),
    answerCallbackQuery: (callbackQueryId, options) =>
      bot.answerCallbackQuery(callbackQueryId, options)
  };

  bot.on("message", async (msg) => {
    await handleTelegramMessage(transport, msg);
  });

  bot.on("callback_query", async (query) => {
    await handleTelegramCallbackQuery(transport, query);
  });

  bot.on("polling_error", (error) => {
    console.error(`Polling error: ${error.message}`);
  });

  return bot;
}
