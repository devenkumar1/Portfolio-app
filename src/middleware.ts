import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === "/login" || 
    path === "/signup" ||
    path === "/" || 
    path.startsWith("/api/auth") || 
    path.startsWith("/api/v1/portfolio") ||
    path === "/api/admin/setup";
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Redirect logic for admin routes
  if (path.startsWith("/admin") || path.startsWith("/api/v1/admin")) {
    // If not logged in, redirect to login
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    // If logged in but not an admin, redirect to home
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  // If trying to access login/signup page but already logged in, redirect to appropriate page
  if ((path === "/login" || path === "/signup") && token) {
    // If admin, redirect to admin dashboard
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // If regular user, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/v1/admin/:path*",
    "/login",
    "/signup"
  ],
}; 