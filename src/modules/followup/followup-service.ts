import TelegramBot from "node-telegram-bot-api";
import { env } from "../../config/env";
import { getPendingFollowUps, markFollowUpSent } from "../../database/repositories";

export async function runFollowUpJob(bot: TelegramBot): Promise<void> {
  const nowUnix = Math.floor(Date.now() / 1000);
  const pendingFollowUps = getPendingFollowUps(nowUnix);

  for (const lead of pendingFollowUps) {
    const baseUrl = env.RENDER_EXTERNAL_URL ?? "http://localhost:3000";
    const trackedLink = `${baseUrl}/api/redirect?id=${encodeURIComponent(lead.produto_id)}&user=${encodeURIComponent(lead.user_id)}&url=${encodeURIComponent(lead.produto_link)}`;

    const message =
      `⏰ *Hallo nochmal!*\n\n` +
      `Du hattest gestern Interesse an *${lead.produto_nome}* gezeigt.\n\n` +
      `🎁 Wenn du dich heute entscheidest, kannst du direkt mit einem starken Vorsprung starten.\n\n` +
      `👉 Hier geht's direkt zum Produkt:\n${trackedLink}`;

    try {
      await bot.sendMessage(lead.user_id, message, { parse_mode: "Markdown" });
      markFollowUpSent(lead.user_id);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : String(error);
      console.error(`Failed to send follow-up to ${lead.user_id}: ${messageText}`);
    }
  }
}
