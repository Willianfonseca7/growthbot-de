import TelegramBot from "node-telegram-bot-api";
import { chat, clearSession } from "../../modules/conversation/orchestrator";

const nicheMessageMap: Record<string, string> = {
  nicho_financas: "Ich möchte meine Finanzen verbessern und mehr Geld verdienen.",
  nicho_tech: "Ich interessiere mich für Technologie und künstliche Intelligenz.",
  nicho_saude: "Ich möchte meine Gesundheit verbessern und fitter werden.",
  nicho_carreira: "Ich möchte meine Karriere voranbringen und ein erfolgreiches Business aufbauen.",
  nicho_marketing: "Ich möchte Marketing und Social Media lernen.",
  nicho_mindset: "Ich möchte meine Persönlichkeit entwickeln und mein Mindset verbessern."
};

const welcomeMessage =
  "👋 Willkommen beim *GrowthBot DE*!\n\n" +
  "Ich bin dein persönlicher KI-Berater für digitale Weiterbildung.\n\n" +
  "👇 *Was möchtest du gerade in deinem Leben verbessern?*";

const welcomeKeyboard: TelegramBot.SendMessageOptions["reply_markup"] = {
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
};

export type TelegramTransport = {
  sendMessage(
    chatId: TelegramBot.ChatId,
    text: string,
    options?: TelegramBot.SendMessageOptions
  ): Promise<unknown>;
  sendChatAction(chatId: TelegramBot.ChatId, action: TelegramBot.ChatAction): Promise<unknown>;
  answerCallbackQuery(
    callbackQueryId: string,
    options?: TelegramBot.AnswerCallbackQueryOptions
  ): Promise<unknown>;
};

type UpdateSummary = {
  updateId?: number;
  kind: "message" | "callback_query" | "unsupported";
  chatId?: string;
  textLength?: number;
};

export function summarizeTelegramUpdate(update: TelegramBot.Update): UpdateSummary {
  if (update.message) {
    return {
      updateId: update.update_id,
      kind: "message",
      chatId: String(update.message.chat.id),
      textLength: update.message.text?.length ?? 0
    };
  }

  if (update.callback_query) {
    return {
      updateId: update.update_id,
      kind: "callback_query",
      chatId: update.callback_query.message?.chat
        ? String(update.callback_query.message.chat.id)
        : undefined
    };
  }

  return {
    updateId: update.update_id,
    kind: "unsupported"
  };
}

function logTelegramHandlerError(
  context: string,
  update: TelegramBot.Update,
  error: unknown
): void {
  const summary = summarizeTelegramUpdate(update);
  const message = error instanceof Error ? error.message : "Unknown error";

  console.error(`${context} failed`, {
    updateId: summary.updateId,
    kind: summary.kind,
    chatId: summary.chatId,
    textLength: summary.textLength,
    error: message
  });
}

export async function handleTelegramMessage(
  transport: TelegramTransport,
  message: TelegramBot.Message,
  update?: TelegramBot.Update
): Promise<void> {
  const chatId = message.chat.id;
  const userId = String(chatId);
  const text = message.text;

  if (!text) {
    return;
  }

  if (text === "/start") {
    clearSession(userId);
    await transport.sendMessage(chatId, welcomeMessage, {
      parse_mode: "Markdown",
      reply_markup: welcomeKeyboard
    });
    return;
  }

  if (text === "/restart") {
    clearSession(userId);
    await transport.sendMessage(chatId, "🔄 Gespräch neu gestartet! Was möchtest du verbessern?");
    return;
  }

  try {
    await transport.sendChatAction(chatId, "typing");
    const reply = await chat(userId, text);
    await transport.sendMessage(chatId, reply, { parse_mode: "Markdown" });
  } catch (error) {
    logTelegramHandlerError(
      "Telegram message handler",
      update ?? ({ update_id: -1, message } as TelegramBot.Update),
      error
    );
    await transport.sendMessage(
      chatId,
      "⚠️ Ein Fehler ist aufgetreten. Bitte versuche es erneut mit /restart"
    );
  }
}

export async function handleTelegramCallbackQuery(
  transport: TelegramTransport,
  callbackQuery: TelegramBot.CallbackQuery,
  update?: TelegramBot.Update
): Promise<void> {
  const chatId = callbackQuery.message?.chat.id;
  const data = callbackQuery.data;

  if (!chatId || !data) {
    return;
  }

  await transport.answerCallbackQuery(callbackQuery.id);

  const mappedMessage = nicheMessageMap[data];
  if (!mappedMessage) {
    return;
  }

  try {
    await transport.sendChatAction(chatId, "typing");
    const reply = await chat(String(chatId), mappedMessage);
    await transport.sendMessage(chatId, reply, { parse_mode: "Markdown" });
  } catch (error) {
    logTelegramHandlerError(
      "Telegram callback handler",
      update ?? ({ update_id: -1, callback_query: callbackQuery } as TelegramBot.Update),
      error
    );
    await transport.sendMessage(
      chatId,
      "⚠️ Ein Fehler ist aufgetreten. Bitte versuche es erneut mit /restart"
    );
  }
}

export async function handleTelegramUpdate(
  transport: TelegramTransport,
  update: TelegramBot.Update
): Promise<"processed" | "ignored"> {
  if (update.message) {
    await handleTelegramMessage(transport, update.message, update);
    return "processed";
  }

  if (update.callback_query) {
    await handleTelegramCallbackQuery(transport, update.callback_query, update);
    return "processed";
  }

  return "ignored";
}
