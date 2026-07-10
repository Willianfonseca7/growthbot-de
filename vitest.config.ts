import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.d.ts", "src/app/**/*.tsx"]
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["tests/setup/vitest.setup.ts"]
        }
      },
      {
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          environment: "node",
          setupFiles: ["tests/setup/integration.setup.ts"]
        }
      }
    ]
  }
});
