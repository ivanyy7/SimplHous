/**
 * Middleware: на Vercel Edge getToken иногда не видит куку после редиректа — получается цикл.
 * Защита только на страницах: /dashboard и /my-prompts делают auth() и редирект на /login.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/my-prompts", "/my-prompts/:path*"],
};
