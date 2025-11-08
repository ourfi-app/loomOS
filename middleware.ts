
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // ============================================================
    // MULTI-TENANCY: Extract tenant from hostname
    // ============================================================
    const hostname = req.headers.get('host') || '';
    const host = hostname.split(':')[0];

    // Skip tenant resolution for certain paths
    const skipTenantPaths = [
      '/auth/',
      '/api/auth/',
      '/sw.js',
      '/_next/',
      '/favicon.ico',
      '/marketing',
    ];

    const shouldSkipTenant = skipTenantPaths.some(path => pathname.startsWith(path)) ||
                            pathname === '/';

    if (!shouldSkipTenant) {
      // Extract subdomain from hostname
      const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'loomos.com';
      let tenantSubdomain: string | null = null;
      let isCustomDomain = false;

      // Development mode
      if (host === 'localhost' || host === '127.0.0.1') {
        // In development, tenant comes from session or URL param
        tenantSubdomain = null;
      }
      // Main domain or www
      else if (host === appDomain || host === `www.${appDomain}`) {
        tenantSubdomain = null;
      }
      // Subdomain routing (e.g., montrecott.loomos.com)
      else if (host.endsWith(appDomain)) {
        tenantSubdomain = host.replace(`.${appDomain}`, '');
        if (tenantSubdomain === 'www') {
          tenantSubdomain = null;
        }
      }
      // Custom domain (e.g., montrecott.com)
      else {
        isCustomDomain = true;
        // Will be resolved by custom domain lookup in API
      }

      // Add tenant context to request headers for downstream use
      const requestHeaders = new Headers(req.headers);
      if (tenantSubdomain) {
        requestHeaders.set('x-tenant-subdomain', tenantSubdomain);
      }
      if (isCustomDomain) {
        requestHeaders.set('x-tenant-custom-domain', host);
      }

      // Create response with updated headers
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Continue with auth and role checks below...
      req.headers.set('x-tenant-subdomain', tenantSubdomain || '');
      req.headers.set('x-tenant-custom-domain', isCustomDomain ? host : '');
    }

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
