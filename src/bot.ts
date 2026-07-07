import { createTelegramBot } from "./integrations/telegram/bot";
import { runFollowUpJob } from "./modules/followup/followup-service";

async function bootstrap(): Promise<void> {
  const bot = createTelegramBot();

  console.log("GrowthBot DE bot runtime is running...");

  await runFollowUpJob(bot);
  setInterval(() => {
    void runFollowUpJob(bot);
  }, 60 * 60 * 1000);
}

void bootstrap();
