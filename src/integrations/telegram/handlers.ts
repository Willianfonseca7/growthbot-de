import TelegramBot from "node-telegram-bot-api";
import { chat, clearSession } from "../../modules/conversation/orchestrator";
import { classifyIntent } from "../../modules/intent/intent-classifier";

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

const topicSelectionMessage =
  "Wählen Sie bitte direkt ein Thema aus, damit ich Ihnen schneller etwas Passendes empfehlen kann.";

const shortInputMessage =
  "Bitte wählen Sie kurz ein Thema oder schreiben Sie 3 bis 5 Wörter, zum Beispiel: KI für Einsteiger, ETFs lernen oder Social Media Marketing.";

const topicSelectionOptions: TelegramBot.SendMessageOptions = {
  parse_mode: "Markdown",
  reply_markup: welcomeKeyboard
};

const directShortcutMap: Record<string, string> = {
  ki: "Ich interessiere mich für Technologie und künstliche Intelligenz.",
  ai: "Ich interessiere mich für Technologie und künstliche Intelligenz.",
  finanzen: "Ich möchte meine Finanzen verbessern und mehr Geld verdienen.",
  geld: "Ich möchte meine Finanzen verbessern und mehr Geld verdienen.",
  health: "Ich möchte meine Gesundheit verbessern und fitter werden.",
  gesundheit: "Ich möchte meine Gesundheit verbessern und fitter werden.",
  fitness: "Ich möchte meine Gesundheit verbessern und fitter werden.",
  marketing: "Ich möchte Marketing und Social Media lernen.",
  karriere: "Ich möchte meine Karriere voranbringen und ein erfolgreiches Business aufbauen.",
  business: "Ich möchte meine Karriere voranbringen und ein erfolgreiches Business aufbauen.",
  mindset: "Ich möchte meine Persönlichkeit entwickeln und mein Mindset verbessern."
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

function normalizeTelegramReply(reply: string): string {
  return reply
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1: $2")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isShortAmbiguousInput(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  if (normalized.length === 0) {
    return false;
  }

  if (directShortcutMap[normalized]) {
    return false;
  }

  return normalized.length <= 2;
}

function resolveUserIntentSeed(text: string): string | null {
  const normalized = text.trim().toLowerCase();

  if (directShortcutMap[normalized]) {
    return directShortcutMap[normalized];
  }

  const intent = classifyIntent(text);
  if (intent.label === "geral") {
    return null;
  }

  return text;
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
    await transport.sendMessage(chatId, "🔄 Gespräch neu gestartet.", topicSelectionOptions);
    return;
  }

  if (isShortAmbiguousInput(text)) {
    await transport.sendMessage(chatId, shortInputMessage, topicSelectionOptions);
    return;
  }

  const seededIntentMessage = resolveUserIntentSeed(text);
  if (!seededIntentMessage) {
    await transport.sendMessage(chatId, topicSelectionMessage, topicSelectionOptions);
    return;
  }

  try {
    await transport.sendChatAction(chatId, "typing");
    const reply = await chat(userId, seededIntentMessage);
    await transport.sendMessage(chatId, normalizeTelegramReply(reply));
  } catch (error) {
    logTelegramHandlerError(
      "Telegram message handler",
      update ?? ({ update_id: -1, message } as TelegramBot.Update),
      error
    );
    await transport.sendMessage(
      chatId,
      "⚠️ Ein Fehler ist aufgetreten. Bitte wählen Sie ein Thema erneut oder nutzen Sie /restart.",
      topicSelectionOptions
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
    await transport.sendMessage(chatId, normalizeTelegramReply(reply));
  } catch (error) {
    logTelegramHandlerError(
      "Telegram callback handler",
      update ?? ({ update_id: -1, callback_query: callbackQuery } as TelegramBot.Update),
      error
    );
    await transport.sendMessage(
      chatId,
      "⚠️ Ein Fehler ist aufgetreten. Bitte wählen Sie ein Thema erneut oder nutzen Sie /restart.",
      topicSelectionOptions
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
