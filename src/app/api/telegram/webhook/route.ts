import { NextResponse } from "next/server";
import { processTelegramWebhookPayload } from "../../../../integrations/telegram/webhook";

export const runtime = "nodejs";

function methodNotAllowed() {
  return NextResponse.json(
    {
      ok: false,
      error: "Method not allowed"
    },
    {
      status: 405,
      headers: {
        Allow: "POST, OPTIONS"
      }
    }
  );
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON payload"
      },
      { status: 400 }
    );
  }

  try {
    const result = await processTelegramWebhookPayload(payload);

    return NextResponse.json({
      ok: true,
      status: result.status
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "Invalid Telegram webhook payload") {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid Telegram webhook payload"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook processing failed"
      },
      { status: 500 }
    );
  }
}

export function GET() {
  return methodNotAllowed();
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS"
    }
  });
}
