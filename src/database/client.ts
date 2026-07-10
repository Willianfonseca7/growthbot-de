import Database from "better-sqlite3";
import path from "node:path";

const databasePath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "growthbot.db");

export const db = new Database(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    user_id TEXT PRIMARY KEY,
    history TEXT NOT NULL DEFAULT '[]',
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    produto_id TEXT,
    clicked_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

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

db.exec(`
  CREATE TABLE IF NOT EXISTS telegram_webhook_updates (
    update_id INTEGER PRIMARY KEY,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);
