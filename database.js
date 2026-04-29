const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "growthbot.db"));

// Tabela de sessões (substitui o Map em memória)
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    user_id TEXT PRIMARY KEY,
    history TEXT NOT NULL DEFAULT '[]',
    nicho TEXT,
    produto_recomendado TEXT,
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

// Tabela de cliques nos links de afiliado
db.exec(`
  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    produto_id TEXT,
    clicked_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

// Tabela de follow-up
db.exec(`
  CREATE TABLE IF NOT EXISTS followups (
    user_id TEXT PRIMARY KEY,
    produto_id TEXT,
    produto_nome TEXT,
    produto_link TEXT,
    scheduled_at INTEGER NOT NULL,
    sent INTEGER NOT NULL DEFAULT 0
  )
`);

module.exports = db;