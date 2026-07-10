# Telegram Webhook on Vercel

This project uses a Next.js Route Handler at `/api/telegram/webhook` for production-ready Telegram delivery on Vercel. Continuous polling remains a local development workflow and is not intended for serverless production.

## Required variables

- `TELEGRAM_TOKEN`: Telegram Bot API token.
- `APP_BASE_URL`: public HTTPS base URL of the deployed application, for example `https://growthbot-de.vercel.app`.
- `OPENAI_API_KEY`: required by the conversation pipeline.

## Production architecture

- Production receives Telegram updates through `POST /api/telegram/webhook`.
- The route validates the payload, applies idempotency using `update_id`, and forwards supported updates to the existing conversation orchestration.
- The webhook is registered only through an explicit command after deploy. It is never registered during request handling.

## Local development

- Local bot polling remains available with `npm run dev:bot`.
- Before using polling locally, remove the production webhook to avoid delivery conflicts.
- If you need to test the webhook route locally, expose `http://localhost:3000` through an HTTPS tunnel and temporarily set `APP_BASE_URL` to that public URL.

## Register the webhook

1. Deploy the application.
2. Set `TELEGRAM_TOKEN` and `APP_BASE_URL` in the target environment.
3. Run:

```bash
npm run telegram:webhook:set
```

## Check webhook status

```bash
npm run telegram:webhook:info
```

This calls Telegram `getWebhookInfo` and returns the current configured URL, pending update count, and recent delivery errors.

## Remove the webhook

```bash
npm run telegram:webhook:delete
```

After removal, polling can be used again for local development.

## Test the route locally

1. Start Next.js with `npm run dev`.
2. Expose the app with an HTTPS tunnel.
3. Set `APP_BASE_URL` to the tunnel URL.
4. Register the webhook with `npm run telegram:webhook:set`.
5. Send `/start` or a regular message to the bot.
6. Inspect the application logs and `npm run telegram:webhook:info`.

## Operational notes

- Only `POST` is accepted by the webhook route.
- Logs intentionally avoid storing full incoming message bodies.
- Telegram duplicate deliveries are filtered by persisted `update_id`.
- The current hourly follow-up scheduler lives in `src/bot.ts` and is not an always-on Vercel runtime. Follow-up delivery still requires a separate worker or scheduled execution strategy.
- SQLite is local-file persistence and is not suitable for shared, horizontally scaled Vercel execution. See deploy risks before promoting this runtime to production.
