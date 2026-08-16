import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protects everything under /admin — only signed-in users with role ADMIN
// may pass. Everyone else is redirected to login (or home, if logged in
// but not an admin).
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/account/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
