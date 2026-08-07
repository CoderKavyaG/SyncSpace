import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // NextAuth session token cookies
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isAuthenticated = !!token;
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedRoute =
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding");

  // If authenticated user visits root, take them directly to their workspace dashboard
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  // 1. Redirect unauthenticated users attempting to access protected routes to /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from auth pages to /workspace
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/workspace/:path*", "/dashboard/:path*", "/onboarding/:path*", "/login", "/signup"],
};
