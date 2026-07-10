import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  delete process.env.DATABASE_PATH;
  vi.resetModules();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
