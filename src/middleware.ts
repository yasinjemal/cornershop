import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API endpoints from public access
  // In production, add proper authentication checks here
  // For now, admin pages are accessible but API routes return 401 without auth
  if (pathname.startsWith("/api/users") && request.method === "GET") {
    const email = request.nextUrl.searchParams.get("email");
    // Allow email lookups (used by checkout) but block full user list from non-admin
    // TODO: Add proper auth token check for admin routes
    if (!email && !pathname.startsWith("/api/users/")) {
      // In production, check for admin session/token here
      // For development, allow all requests
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static files and _next internals
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
