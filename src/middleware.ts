import { NextRequest, NextResponse } from "next/server";

function unauthorizedResponse() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="GrowthBot DE Ops"'
    }
  });
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/ops")) {
    return NextResponse.next();
  }

  const expectedUsername = process.env.OPS_BASIC_AUTH_USERNAME;
  const expectedPassword = process.env.OPS_BASIC_AUTH_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }

    return unauthorizedResponse();
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  const encodedCredentials = authorization.slice("Basic ".length);
  const decodedCredentials = atob(encodedCredentials);
  const separatorIndex = decodedCredentials.indexOf(":");

  if (separatorIndex === -1) {
    return unauthorizedResponse();
  }

  const username = decodedCredentials.slice(0, separatorIndex);
  const password = decodedCredentials.slice(separatorIndex + 1);

  if (username !== expectedUsername || password !== expectedPassword) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops/:path*"]
};
