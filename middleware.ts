import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import micromatch from "micromatch";
import { supabase } from "@/modules/common/server/supabase";

// Add API routes that don't require authentication
const unAuthenticatedApiRoutes = [
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/invites/*/accept",
  "/api/invites/*/decline",
];

export async function middleware(req: NextRequest) {
  const { headers, nextUrl } = req;
  const { pathname } = nextUrl;

  // Bypass routes that don't require authentication
  if (micromatch.isMatch(pathname, unAuthenticatedApiRoutes)) {
    return NextResponse.next();
  }

  // Authenticate the request
  const token = headers.get("authorization")?.replace("Bearer ", "");

  const { error } = await supabase.auth.getUser(token);

  // Return an error if the request is not authenticated
  if (error) {
    const response = JSON.stringify({ error });

    return new NextResponse(response, {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  return NextResponse.next();
}

// Limit the middleware to specific '/api/*' routes
export const config = {
  matcher: ["/api/:path*"],
};
