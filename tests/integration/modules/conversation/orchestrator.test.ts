import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDatabaseContext } from "../../../helpers/test-database";

const { generateStructuredRecommendationMock } = vi.hoisted(() => ({
  generateStructuredRecommendationMock: vi.fn()
}));

vi.mock("../../../../src/llm/providers/openai-provider", () => ({
  generateStructuredRecommendation: generateStructuredRecommendationMock
}));

describe("conversation orchestrator", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-10T12:00:00Z"));
    generateStructuredRecommendationMock.mockReset();
  });

  afterEach(() => {
    delete process.env.DATABASE_PATH;
  });

  it("builds a recommendation flow and persists follow-up state", async () => {
    const testDatabase = createTestDatabaseContext();
    process.env.DATABASE_PATH = testDatabase.databasePath;

    generateStructuredRecommendationMock.mockResolvedValue({
      productName: "KI-Komplett-System",
      message: "Hier ist die beste Option für dich: https://www.digistore24.com/redir/590882/wfonsecadigital/"
    });

    try {
      const { chat } = await import("../../../../src/modules/conversation/orchestrator");
      const repositories = await import("../../../../src/database/repositories");

      const reply = await chat("user-77", "Ich suche etwas über KI und Automatisierung");

      expect(reply).toContain("Hier ist die beste Option");

      const session = repositories.getSessionHistory("user-77");
      expect(session).toHaveLength(2);
      expect(session[0]?.content).toBe("Ich suche etwas über KI und Automatisierung");
      expect(session[1]?.content).toContain("Hier ist die beste Option");

      const followUps = repositories.getPendingFollowUps(Math.floor(Date.now() / 1000) + 86400);
      expect(followUps).toHaveLength(1);
      expect(followUps[0]?.produto_nome).toBe("KI-Komplett-System");
      expect(generateStructuredRecommendationMock).toHaveBeenCalledOnce();
    } finally {
      testDatabase.cleanup();
    }
  });
});
