import { beforeEach, describe, expect, it, vi } from "vitest";

const { chatMock, clearSessionMock, classifyIntentMock } = vi.hoisted(() => ({
  chatMock: vi.fn(),
  clearSessionMock: vi.fn(),
  classifyIntentMock: vi.fn()
}));

vi.mock("../../../../src/modules/conversation/orchestrator", () => ({
  chat: chatMock,
  clearSession: clearSessionMock
}));

vi.mock("../../../../src/modules/intent/intent-classifier", () => ({
  classifyIntent: classifyIntentMock
}));

describe("telegram handlers", () => {
  beforeEach(() => {
    chatMock.mockReset();
    clearSessionMock.mockReset();
    classifyIntentMock.mockReset();
  });

  it("resets the session and sends the welcome message on /start", async () => {
    const { handleTelegramUpdate } = await import("../../../../src/integrations/telegram/handlers");
    const transport = {
      sendMessage: vi.fn().mockResolvedValue(undefined),
      sendChatAction: vi.fn().mockResolvedValue(undefined),
      answerCallbackQuery: vi.fn().mockResolvedValue(undefined)
    };

    const result = await handleTelegramUpdate(transport, {
      update_id: 101,
      message: {
        message_id: 1,
        text: "/start",
        chat: { id: 42 }
      }
    } as never);

    expect(result).toBe("processed");
    expect(clearSessionMock).toHaveBeenCalledWith("42");
    expect(transport.sendMessage).toHaveBeenCalledOnce();
    expect(transport.sendChatAction).not.toHaveBeenCalled();
  });

  it("guides the user with topic buttons for ambiguous short messages", async () => {
    const { handleTelegramUpdate } = await import("../../../../src/integrations/telegram/handlers");
    const transport = {
      sendMessage: vi.fn().mockResolvedValue(undefined),
      sendChatAction: vi.fn().mockResolvedValue(undefined),
      answerCallbackQuery: vi.fn().mockResolvedValue(undefined)
    };

    const result = await handleTelegramUpdate(transport, {
      update_id: 102,
      message: {
        message_id: 2,
        text: "Li",
        chat: { id: 42 }
      }
    } as never);

    expect(result).toBe("processed");
    expect(chatMock).not.toHaveBeenCalled();
    expect(transport.sendMessage).toHaveBeenCalledOnce();
    expect(transport.sendChatAction).not.toHaveBeenCalled();
  });

  it("routes direct short intents like KI into the recommendation flow", async () => {
    const { handleTelegramUpdate } = await import("../../../../src/integrations/telegram/handlers");
    const transport = {
      sendMessage: vi.fn().mockResolvedValue(undefined),
      sendChatAction: vi.fn().mockResolvedValue(undefined),
      answerCallbackQuery: vi.fn().mockResolvedValue(undefined)
    };

    chatMock.mockResolvedValue("**KI-Komplett-System**\nhttps://example.com/product");

    const result = await handleTelegramUpdate(transport, {
      update_id: 103,
      message: {
        message_id: 3,
        text: "KI",
        chat: { id: 42 }
      }
    } as never);

    expect(result).toBe("processed");
    expect(chatMock).toHaveBeenCalledWith(
      "42",
      "Ich interessiere mich für Technologie und künstliche Intelligenz."
    );
    expect(transport.sendMessage).toHaveBeenLastCalledWith(
      42,
      "KI-Komplett-System\nhttps://example.com/product"
    );
  });

  it("guides generic messages to a topic selection instead of sending a long fallback", async () => {
    const { handleTelegramUpdate } = await import("../../../../src/integrations/telegram/handlers");
    const transport = {
      sendMessage: vi.fn().mockResolvedValue(undefined),
      sendChatAction: vi.fn().mockResolvedValue(undefined),
      answerCallbackQuery: vi.fn().mockResolvedValue(undefined)
    };

    classifyIntentMock.mockReturnValue({
      label: "geral",
      matchedKeywords: [],
      normalizedText: "online kurse"
    });

    const result = await handleTelegramUpdate(transport, {
      update_id: 104,
      message: {
        message_id: 4,
        text: "Online Kurse",
        chat: { id: 42 }
      }
    } as never);

    expect(result).toBe("processed");
    expect(chatMock).not.toHaveBeenCalled();
    expect(transport.sendMessage).toHaveBeenCalledOnce();
  });

  it("ignores unsupported updates", async () => {
    const { handleTelegramUpdate } = await import("../../../../src/integrations/telegram/handlers");
    const transport = {
      sendMessage: vi.fn().mockResolvedValue(undefined),
      sendChatAction: vi.fn().mockResolvedValue(undefined),
      answerCallbackQuery: vi.fn().mockResolvedValue(undefined)
    };

    const result = await handleTelegramUpdate(transport, {
      update_id: 202
    } as never);

    expect(result).toBe("ignored");
    expect(transport.sendMessage).not.toHaveBeenCalled();
    expect(transport.sendChatAction).not.toHaveBeenCalled();
    expect(transport.answerCallbackQuery).not.toHaveBeenCalled();
  });
});
