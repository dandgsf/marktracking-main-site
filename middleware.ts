import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * MARKTRACKING — Edge Middleware
 * Adds security and performance headers at the edge
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add timing header for performance monitoring
  response.headers.set("X-Response-Time", Date.now().toString());

  // Prevent information disclosure
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Expect-CT (Certificate Transparency)
  response.headers.set(
    "Expect-CT",
    "max-age=86400, enforce"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
