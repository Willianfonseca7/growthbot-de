import { beforeEach, describe, expect, it, vi } from "vitest";

const { chatMock, clearSessionMock } = vi.hoisted(() => ({
  chatMock: vi.fn(),
  clearSessionMock: vi.fn()
}));

vi.mock("../../../../src/modules/conversation/orchestrator", () => ({
  chat: chatMock,
  clearSession: clearSessionMock
}));

describe("telegram handlers", () => {
  beforeEach(() => {
    chatMock.mockReset();
    clearSessionMock.mockReset();
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
