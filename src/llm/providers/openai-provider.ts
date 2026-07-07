import OpenAI from "openai";
import { z } from "zod";
import { env } from "../../config/env";
import type { ProductRecommendation } from "../../types/domain";

const responseSchema = z.object({
  productName: z.string().min(1),
  message: z.string().min(1)
});

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function generateStructuredRecommendation(prompt: string): Promise<ProductRecommendation> {
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a structured product recommendation engine. Reply with valid JSON only."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 700
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = responseSchema.parse(JSON.parse(content));
  return parsed;
}
