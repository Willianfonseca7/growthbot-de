import { describe, expect, it } from "vitest";
import { classifyIntent } from "./intent-classifier";

describe("classifyIntent", () => {
  it("detects finance intent", () => {
    const result = classifyIntent("Ich möchte mehr über ETFs und Investment lernen");
    expect(result.label).toBe("financas");
  });

  it("detects tech intent", () => {
    const result = classifyIntent("Ich interessiere mich für künstliche Intelligenz und Automation");
    expect(result.label).toBe("tech");
  });

  it("falls back to general when no strong signal exists", () => {
    const result = classifyIntent("Hallo, ich brauche Hilfe");
    expect(result.label).toBe("geral");
  });
});
