import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow gate page, API routes, and static assets
  if (
    pathname === "/gate" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".woff")
  ) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get("waaha_auth");

  if (authCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // Redirect to gate
  const gateUrl = new URL("/gate", request.url);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
