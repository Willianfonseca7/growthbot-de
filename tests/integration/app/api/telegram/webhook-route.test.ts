import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDatabaseContext } from "../../../../helpers/test-database";

const { generateStructuredRecommendationMock } = vi.hoisted(() => ({
  generateStructuredRecommendationMock: vi.fn()
}));

vi.mock("../../../../../src/llm/providers/openai-provider", () => ({
  generateStructuredRecommendation: generateStructuredRecommendationMock
}));

describe("telegram webhook route", () => {
  beforeEach(() => {
    generateStructuredRecommendationMock.mockReset();
    process.env.OPENAI_API_KEY = "test-openai-key";
    process.env.TELEGRAM_TOKEN = "test-telegram-token";
    process.env.APP_BASE_URL = "https://growthbot-de.example";
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.TELEGRAM_TOKEN;
    delete process.env.APP_BASE_URL;
    vi.unstubAllGlobals();
  });

  it("processes a message update once and ignores duplicate deliveries", async () => {
    const testDatabase = createTestDatabaseContext();
    process.env.DATABASE_PATH = testDatabase.databasePath;

    generateStructuredRecommendationMock.mockResolvedValue({
      productName: "KI-Komplett-System",
      message: "Hier ist die beste Option für dich: https://example.com/offer"
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, result: true })
    });
    vi.stubGlobal("fetch", fetchMock);

    try {
      const { POST } = await import("../../../../../src/app/api/telegram/webhook/route");
      const repositories = await import("../../../../../src/database/repositories");

      const request = new Request("http://localhost:3000/api/telegram/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          update_id: 9001,
          message: {
            message_id: 11,
            text: "Ich suche etwas über KI und Automatisierung",
            chat: { id: 777 }
          }
        })
      });

      const firstResponse = await POST(request);
      const firstBody = await firstResponse.json();

      expect(firstResponse.status).toBe(200);
      expect(firstBody).toEqual({
        ok: true,
        status: "processed"
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[0]?.[0]).toContain("/sendChatAction");
      expect(fetchMock.mock.calls[1]?.[0]).toContain("/sendMessage");

      const duplicateRequest = new Request("http://localhost:3000/api/telegram/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          update_id: 9001,
          message: {
            message_id: 11,
            text: "Ich suche etwas über KI und Automatisierung",
            chat: { id: 777 }
          }
        })
      });

      const duplicateResponse = await POST(duplicateRequest);
      const duplicateBody = await duplicateResponse.json();

      expect(duplicateResponse.status).toBe(200);
      expect(duplicateBody).toEqual({
        ok: true,
        status: "duplicate"
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(repositories.getSessionHistory("777")).toHaveLength(2);
    } finally {
      testDatabase.cleanup();
    }
  });

  it("rejects invalid webhook payloads", async () => {
    const testDatabase = createTestDatabaseContext();
    process.env.DATABASE_PATH = testDatabase.databasePath;

    try {
      const { POST } = await import("../../../../../src/app/api/telegram/webhook/route");

      const response = await POST(
        new Request("http://localhost:3000/api/telegram/webhook", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            message: {
              text: "missing update id"
            }
          })
        })
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        ok: false,
        error: "Invalid Telegram webhook payload"
      });
    } finally {
      testDatabase.cleanup();
    }
  });
});
