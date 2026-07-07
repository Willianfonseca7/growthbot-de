import { buildRecommendationPrompt } from "../../llm/prompts/recommendation-prompt";
import { generateStructuredRecommendation } from "../../llm/providers/openai-provider";
import { getSessionHistory, saveSessionHistory, clearUserSession, upsertFollowUp } from "../../database/repositories";
import { classifyIntent } from "../intent/intent-classifier";
import { matchProducts } from "../products/product-matcher";
import type { ChatHistoryEntry } from "../../types/domain";

function trimHistory(history: ChatHistoryEntry[]): ChatHistoryEntry[] {
  return history.slice(-10);
}

export async function chat(userId: string, userMessage: string): Promise<string> {
  const previousHistory = getSessionHistory(userId);
  const history = trimHistory([...previousHistory, { role: "user", content: userMessage }]);

  const intent = classifyIntent(userMessage);
  const candidates = matchProducts(intent);
  const prompt = buildRecommendationPrompt({
    intent,
    candidates,
    history,
    userMessage
  });

  const recommendation = await generateStructuredRecommendation(prompt);
  const selectedProduct = candidates.find((product) => product.nome === recommendation.productName) ?? candidates[0];

  const finalMessage = selectedProduct
    ? recommendation.message.replace(selectedProduct.link, selectedProduct.link)
    : recommendation.message;

  const nextHistory = trimHistory([
    ...history,
    { role: "assistant", content: finalMessage }
  ]);

  saveSessionHistory(userId, nextHistory);

  if (selectedProduct) {
    upsertFollowUp({
      user_id: userId,
      produto_id: selectedProduct.nome,
      produto_nome: selectedProduct.nome,
      produto_link: selectedProduct.link,
      scheduled_at: Math.floor(Date.now() / 1000) + 86400
    });
  }

  return finalMessage;
}

export function clearSession(userId: string): void {
  clearUserSession(userId);
}
