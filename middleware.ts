/**
 * Middleware: защита маршрутов /dashboard и /my-prompts.
 * Неавторизованных пользователей редиректим на /login.
 */
import NextResponse from "next/server";
import { auth } from "@/auth";

// Маршруты, требующие авторизации
const protectedPaths = ["/dashboard", "/my-prompts"];

function isProtected(pathname: string): boolean {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (isProtected(nextUrl.pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/my-prompts", "/my-prompts/:path*"],
};
