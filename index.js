require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { chat, clearSession } = require("./conversation");
const db = require("./database");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

console.log("🤖 GrowthBot DE está rodando...");

// ─── FOLLOW-UP JOB — roda a cada hora ───────────────────────────────────────
function runFollowUpJob() {
  const agora = Math.floor(Date.now() / 1000);

  const pendentes = db.prepare(`
    SELECT * FROM followups
    WHERE sent = 0 AND scheduled_at <= ?
  `).all(agora);

  for (const lead of pendentes) {
    const mensagem =
      `⏰ *Hallo nochmal!*\n\n` +
      `Du hattest gestern Interesse an *${lead.produto_nome}* gezeigt.\n\n` +
      `🎁 *Exklusiver Bonus nur für dich:* Wenn du dich heute noch anmeldest, ` +
      `bekommst du Zugang zu einem kostenlosen Bonus-Modul, das nur für schnelle Entscheider verfügbar ist.\n\n` +
      `⚡ *Dieses Angebot gilt nur für die nächsten 24 Stunden.*\n\n` +
      `👉 Hier geht's direkt zum Kurs:\n${lead.produto_link}`;

    bot.sendMessage(lead.user_id, mensagem, { parse_mode: "Markdown" })
      .then(() => {
        db.prepare("UPDATE followups SET sent = 1 WHERE user_id = ?").run(lead.user_id);
        console.log(`✅ Follow-up enviado para ${lead.user_id}`);
      })
      .catch((err) => {
        console.error(`❌ Erro ao enviar follow-up para ${lead.user_id}:`, err.message);
      });
  }
}

// Roda imediatamente ao iniciar e depois a cada hora
runFollowUpJob();
setInterval(runFollowUpJob, 60 * 60 * 1000);

// ─── BOT HANDLERS ────────────────────────────────────────────────────────────
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

// ─── SERVIDOR HTTP — keep-alive + redirect tracker ───────────────────────────
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/redirect")) {
    const params = new URL(req.url, "http://localhost").searchParams;
    const produtoId = params.get("id") || "unknown";
    const userId = params.get("user") || "unknown";
    const url = params.get("url");

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

  res.writeHead(200);
  res.end("GrowthBot DE está vivo!");
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Servidor HTTP ativo para keep-alive");
});