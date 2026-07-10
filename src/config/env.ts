import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  TELEGRAM_TOKEN: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  PORT: z.coerce.number().default(3000),
  APP_BASE_URL: z.string().url().optional()
});

export const env = envSchema.parse(process.env);
