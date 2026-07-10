import type { ChatHistoryEntry, IntentClassification, Product } from "../../types/domain";

export function buildRecommendationPrompt(args: {
  intent: IntentClassification;
  candidates: Product[];
  history: ChatHistoryEntry[];
  userMessage: string;
}): string {
  const { intent, candidates, history, userMessage } = args;
  const historySummary = history
    .slice(-6)
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
    .join("\n");

  const candidateText = candidates
    .map((product) => `- ${product.nome} | Nischen: ${product.nicho.join(", ")} | Beschreibung: ${product.descricao} | Provision: €${product.comissao} | Link: ${product.link}`)
    .join("\n");

  return [
    "You are GrowthBot DE, a sales assistant for digital products in the DACH market.",
    "You must recommend exactly one product from the candidate list below.",
    "Return valid JSON with this shape only:",
    '{"productName":"...","message":"..."}',
    "Rules:",
    "- productName must exactly match one candidate product name",
    "- message must be in German unless the user clearly wrote in English",
    "- message must be concise, persuasive, and grounded in the user goal",
    "- keep the message short enough for a chat reply, ideally under 650 characters",
    "- use short paragraphs or bullet-like line breaks",
    "- include one short social-proof line",
    "- include the tracked product link from the chosen product as a plain raw URL",
    "- do not use Markdown links like [text](url)",
    "- avoid long introductions and avoid repeating the user request back",
    `Detected intent: ${intent.label}`,
    `Matched keywords: ${intent.matchedKeywords.join(", ") || "none"}`,
    `User message: ${userMessage}`,
    historySummary ? `Recent conversation:\n${historySummary}` : "No prior conversation.",
    `Candidate products:\n${candidateText}`
  ].join("\n\n");
}
