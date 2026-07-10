import { describe, expect, it } from "vitest";
import { createTestDatabaseContext } from "../../helpers/test-database";

describe("database repositories", () => {
  it("persists sessions, clicks, and follow-ups in an isolated database", async () => {
    const testDatabase = createTestDatabaseContext();
    process.env.DATABASE_PATH = testDatabase.databasePath;

    try {
      const repositories = await import("../../../src/database/repositories");

      repositories.saveSessionHistory("user-1", [
        { role: "user", content: "Hallo" },
        { role: "assistant", content: "Willkommen" }
      ]);

      repositories.upsertFollowUp({
        user_id: "user-1",
        produto_id: "prod-1",
        produto_nome: "Produkt 1",
        produto_link: "https://example.com/prod-1",
        scheduled_at: 1700000000
      });

      repositories.registerClick("user-1", "prod-1");

      expect(repositories.getSessionHistory("user-1")).toHaveLength(2);
      expect(repositories.getPendingFollowUps(1700000000)).toHaveLength(1);
      expect(repositories.getDashboardMetrics()).toEqual({
        totalSessions: 1,
        totalClicks: 1,
        pendingFollowUps: 1,
        sentFollowUps: 0
      });

      repositories.clearUserSession("user-1");

      expect(repositories.getSessionHistory("user-1")).toEqual([]);
      expect(repositories.getPendingFollowUps(1700000000)).toEqual([]);
    } finally {
      testDatabase.cleanup();
    }
  });
});
