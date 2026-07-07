import { db } from "./client";
import type {
  ChatHistoryEntry,
  ClickRecord,
  DashboardMetrics,
  FollowUpRecord,
  RecentSession
} from "../types/domain";

export function getSessionHistory(userId: string): ChatHistoryEntry[] {
  const row = db.prepare("SELECT history FROM sessions WHERE user_id = ?").get(userId) as
    | { history: string }
    | undefined;

  return row ? (JSON.parse(row.history) as ChatHistoryEntry[]) : [];
}

export function saveSessionHistory(userId: string, history: ChatHistoryEntry[]): void {
  db.prepare(`
    INSERT INTO sessions (user_id, history, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(user_id) DO UPDATE SET
      history = excluded.history,
      updated_at = excluded.updated_at
  `).run(userId, JSON.stringify(history));
}

export function clearUserSession(userId: string): void {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM followups WHERE user_id = ?").run(userId);
}

export function upsertFollowUp(record: Omit<FollowUpRecord, "sent">): void {
  db.prepare(`
    INSERT INTO followups (user_id, produto_id, produto_nome, produto_link, scheduled_at, sent)
    VALUES (?, ?, ?, ?, ?, 0)
    ON CONFLICT(user_id) DO UPDATE SET
      produto_id = excluded.produto_id,
      produto_nome = excluded.produto_nome,
      produto_link = excluded.produto_link,
      scheduled_at = excluded.scheduled_at,
      sent = 0
  `).run(
    record.user_id,
    record.produto_id,
    record.produto_nome,
    record.produto_link,
    record.scheduled_at
  );
}

export function getPendingFollowUps(nowUnix: number): FollowUpRecord[] {
  return db.prepare(`
    SELECT * FROM followups
    WHERE sent = 0 AND scheduled_at <= ?
  `).all(nowUnix) as FollowUpRecord[];
}

export function markFollowUpSent(userId: string): void {
  db.prepare("UPDATE followups SET sent = 1 WHERE user_id = ?").run(userId);
}

export function registerClick(userId: string, productId: string): void {
  db.prepare("INSERT INTO clicks (user_id, produto_id) VALUES (?, ?)").run(userId, productId);
}

export function getDashboardMetrics(): DashboardMetrics {
  const totalSessions = db.prepare("SELECT COUNT(*) AS count FROM sessions").get() as { count: number };
  const totalClicks = db.prepare("SELECT COUNT(*) AS count FROM clicks").get() as { count: number };
  const pendingFollowUps = db.prepare("SELECT COUNT(*) AS count FROM followups WHERE sent = 0").get() as { count: number };
  const sentFollowUps = db.prepare("SELECT COUNT(*) AS count FROM followups WHERE sent = 1").get() as { count: number };

  return {
    totalSessions: totalSessions.count,
    totalClicks: totalClicks.count,
    pendingFollowUps: pendingFollowUps.count,
    sentFollowUps: sentFollowUps.count
  };
}

export function getRecentSessions(limit = 5): RecentSession[] {
  const rows = db.prepare(`
    SELECT user_id, history, updated_at
    FROM sessions
    ORDER BY updated_at DESC
    LIMIT ?
  `).all(limit) as Array<{ user_id: string; history: string; updated_at: number }>;

  return rows.map((row) => {
    const history = JSON.parse(row.history) as ChatHistoryEntry[];
    const lastMessage = history.at(-1)?.content ?? "No messages yet";

    return {
      userId: row.user_id,
      lastMessage,
      updatedAt: row.updated_at
    };
  });
}

export function getRecentFollowUps(limit = 5): FollowUpRecord[] {
  return db.prepare(`
    SELECT *
    FROM followups
    ORDER BY scheduled_at DESC
    LIMIT ?
  `).all(limit) as FollowUpRecord[];
}

export function getRecentClicks(limit = 5): ClickRecord[] {
  return db.prepare(`
    SELECT user_id, produto_id, clicked_at
    FROM clicks
    ORDER BY clicked_at DESC
    LIMIT ?
  `).all(limit).map((row) => ({
    userId: (row as { user_id: string }).user_id,
    productId: (row as { produto_id: string }).produto_id,
    clickedAt: (row as { clicked_at: number }).clicked_at
  }));
}
