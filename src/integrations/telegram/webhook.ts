import TelegramBot from "node-telegram-bot-api";
import { z } from "zod";
import { env } from "../../config/env";
import {
  claimTelegramWebhookUpdate,
  completeTelegramWebhookUpdate,
  releaseTelegramWebhookUpdate
} from "../../database/repositories";
import {
  handleTelegramUpdate,
  summarizeTelegramUpdate,
  type TelegramTransport
} from "./handlers";

const telegramMessageSchema = z
  .object({
    message_id: z.number().int(),
    text: z.string().optional(),
    chat: z.object({
      id: z.union([z.number(), z.string()])
    })
  })
  .passthrough();

const telegramCallbackQuerySchema = z
  .object({
    id: z.string().min(1),
    data: z.string().optional(),
    message: telegramMessageSchema.optional()
  })
  .passthrough();

const telegramUpdateSchema = z
  .object({
    update_id: z.number().int(),
    message: telegramMessageSchema.optional(),
    callback_query: telegramCallbackQuerySchema.optional()
  })
  .passthrough();

export type TelegramWebhookUpdate = TelegramBot.Update & z.infer<typeof telegramUpdateSchema>;

export function validateTelegramWebhookPayload(payload: unknown): TelegramWebhookUpdate | null {
  const parsed = telegramUpdateSchema.safeParse(payload);
  return parsed.success ? (parsed.data as TelegramWebhookUpdate) : null;
}

class TelegramApiTransport implements TelegramTransport {
  constructor(private readonly token: string) {}

  async sendMessage(
    chatId: TelegramBot.ChatId,
    text: string,
    options?: TelegramBot.SendMessageOptions
  ): Promise<unknown> {
    return this.call("sendMessage", {
      chat_id: chatId,
      text,
      ...options
    });
  }

  async sendChatAction(
    chatId: TelegramBot.ChatId,
    action: TelegramBot.ChatAction
  ): Promise<unknown> {
    return this.call("sendChatAction", {
      chat_id: chatId,
      action
    });
  }

  async answerCallbackQuery(
    callbackQueryId: string,
    options?: TelegramBot.AnswerCallbackQueryOptions
  ): Promise<unknown> {
    return this.call("answerCallbackQuery", {
      callback_query_id: callbackQueryId,
      ...options
    });
  }

  private async call(method: string, payload: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(`https://api.telegram.org/bot${this.token}/${method}`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Telegram API ${method} failed with status ${response.status}`);
    }

    const body = (await response.json()) as { ok?: boolean; description?: string; result?: unknown };
    if (!body.ok) {
      throw new Error(body.description ?? `Telegram API ${method} returned an error`);
    }

    return body.result;
  }
}

export async function processTelegramWebhookPayload(payload: unknown): Promise<{
  status: "processed" | "ignored" | "duplicate";
}> {
  const update = validateTelegramWebhookPayload(payload);
  if (!update) {
    throw new Error("Invalid Telegram webhook payload");
  }

  const claimed = claimTelegramWebhookUpdate(update.update_id);
  if (!claimed) {
    return { status: "duplicate" };
  }

  const summary = summarizeTelegramUpdate(update);
  console.info("Telegram webhook update received", summary);

  try {
    const transport = new TelegramApiTransport(env.TELEGRAM_TOKEN);
    const status = await handleTelegramUpdate(transport, update);
    completeTelegramWebhookUpdate(update.update_id);
    return { status };
  } catch (error) {
    releaseTelegramWebhookUpdate(update.update_id);

    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Telegram webhook processing failed", {
      updateId: summary.updateId,
      kind: summary.kind,
      chatId: summary.chatId,
      textLength: summary.textLength,
      error: message
    });

    throw error;
  }
}
