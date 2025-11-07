
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Handle service worker in development to prevent 404s
    if (process.env.NODE_ENV === 'development' && pathname === '/sw.js') {
      return new NextResponse(
        '// Service worker disabled in development mode\nconsole.log("[SW] Service worker is disabled in development mode");',
        {
          status: 200,
          headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-store, must-revalidate',
          },
        }
      );
    }

    // Allow access to auth pages when not logged in
    if (pathname.startsWith("/auth/") && !token) {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated and trying to access protected routes
    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Role-based access control and onboarding checks
    if (token) {
      const userRole = token.role as string;
      const onboardingCompleted = token.onboardingCompleted as boolean | undefined;

      // SUPER_ADMIN has unrestricted access to EVERYTHING - bypass all checks
      if (userRole === "SUPER_ADMIN") {
        return NextResponse.next();
      }

      // Check onboarding status for non-admins
      // Allow access to /dashboard and /onboarding regardless of onboarding status
      // Block all other dashboard routes until onboarding is complete
      if (
        (userRole === "BOARD_MEMBER" || userRole === "RESIDENT") &&
        !onboardingCompleted &&
        pathname !== "/dashboard" &&
        !pathname.startsWith("/onboarding") &&
        pathname.startsWith("/dashboard/")
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Admin routes
      if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Board member routes
      if (pathname.startsWith("/dashboard/board") && !["ADMIN", "BOARD_MEMBER"].includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (pathname === "/" || pathname.startsWith("/auth/")) {
          return true;
        }

        // Require token for protected routes
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/admin/:path*",
    "/api/board/:path*",
    "/sw.js" // Handle service worker to prevent 404s in development
  ]
};
