import type { IntentClassification, IntentLabel } from "../../types/domain";

const keywordMap: Record<IntentLabel, string[]> = {
  financas: ["finanz", "geld", "investment", "trading", "aktien", "etf", "krypto", "bitcoin"],
  tech: ["ki", "künstliche intelligenz", "ai", "technologie", "tech", "automation", "automatisierung"],
  saude: ["gesund", "fitness", "abnehmen", "wellness", "sport", "pilates"],
  carreira: ["karriere", "business", "unternehmen", "geschäft", "erfolg", "coaching"],
  marketing: ["marketing", "social media", "seo", "email", "affiliate", "verkaufen"],
  mindset: ["mindset", "persönlichkeit", "selbst", "motivation", "identität", "wachstum"],
  geral: []
};

export function classifyIntent(message: string): IntentClassification {
  const normalizedText = message.trim().toLowerCase();

  let bestLabel: IntentLabel = "geral";
  let bestKeywords: string[] = [];

  for (const [label, keywords] of Object.entries(keywordMap) as [IntentLabel, string[]][]) {
    const matchedKeywords = keywords.filter((keyword) => normalizedText.includes(keyword));

    if (matchedKeywords.length > bestKeywords.length) {
      bestLabel = label;
      bestKeywords = matchedKeywords;
    }
  }

  return {
    label: bestLabel,
    matchedKeywords: bestKeywords,
    normalizedText
  };
}
