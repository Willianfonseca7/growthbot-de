import { NextRequest, NextResponse } from "next/server";
import { registerClick } from "../../../database/repositories";

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const productId = params.get("id") || "unknown";
  const userId = params.get("user") || "unknown";
  const url = params.get("url");

  registerClick(userId, productId);

  if (!url) {
    return new NextResponse("URL not provided", { status: 400 });
  }

  return NextResponse.redirect(url);
}
