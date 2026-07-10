import dotenv from "dotenv";

dotenv.config();

const command = process.argv[2];
const token = process.env.TELEGRAM_TOKEN;
const appBaseUrl = process.env.APP_BASE_URL;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!token) {
  fail("TELEGRAM_TOKEN is required.");
}

async function telegramCall(method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: payload ? JSON.stringify(payload) : undefined
  });

  if (!response.ok) {
    fail(`Telegram API ${method} failed with status ${response.status}.`);
  }

  const body = await response.json();
  if (!body.ok) {
    fail(body.description ?? `Telegram API ${method} returned an error.`);
  }

  return body.result;
}

async function main() {
  if (command === "set") {
    if (!appBaseUrl) {
      fail("APP_BASE_URL is required to register the webhook.");
    }

    const normalizedBaseUrl = appBaseUrl.replace(/\/$/, "");
    const url = `${normalizedBaseUrl}/api/telegram/webhook`;

    const result = await telegramCall("setWebhook", {
      url,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: false
    });

    console.log(JSON.stringify({ ok: true, action: "set", url, result }, null, 2));
    return;
  }

  if (command === "info") {
    const result = await telegramCall("getWebhookInfo");
    console.log(JSON.stringify({ ok: true, action: "info", result }, null, 2));
    return;
  }

  if (command === "delete") {
    const result = await telegramCall("deleteWebhook", {
      drop_pending_updates: false
    });

    console.log(JSON.stringify({ ok: true, action: "delete", result }, null, 2));
    return;
  }

  fail("Usage: node scripts/telegram-webhook.mjs <set|info|delete>");
}

void main();
