import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function createTestDatabaseContext() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "growthbot-tests-"));
  const databasePath = path.join(directory, "growthbot.test.db");

  return {
    databasePath,
    cleanup() {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  };
}
