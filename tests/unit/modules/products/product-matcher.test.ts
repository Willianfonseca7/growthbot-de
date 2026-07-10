import { describe, expect, it } from "vitest";
import { matchProducts } from "../../../../src/modules/products/product-matcher";

describe("matchProducts", () => {
  it("returns finance products for finance intent", () => {
    const result = matchProducts({
      label: "financas",
      matchedKeywords: ["investment"],
      normalizedText: "investment"
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((product) => product.nicho.includes("financas"))).toBe(true);
  });

  it("returns fallback products for general intent", () => {
    const result = matchProducts({
      label: "geral",
      matchedKeywords: [],
      normalizedText: "hilfe"
    });

    expect(result.length).toBe(5);
  });
});
