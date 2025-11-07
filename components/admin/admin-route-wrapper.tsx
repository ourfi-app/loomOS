'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAdminMode } from '@/lib/admin-mode-store';

/**
 * Admin Route Wrapper with Code Splitting
 *
 * This wrapper provides:
 * 1. Admin authentication checks
 * 2. Automatic redirect for non-admin users
 * 3. Code splitting for admin-only features
 *
 * Benefits:
 * - Non-admin users never download admin code
 * - Reduces initial bundle for regular residents
 * - Admin features loaded only when needed
 * - Better security through client-side checks
 *
 * Usage in admin pages:
 * ```tsx
 * export default function AdminUsersPage() {
 *   return (
 *     <AdminRouteWrapper>
 *       <YourAdminContent />
 *     </AdminRouteWrapper>
 *   );
 * }
 * ```
 */

interface AdminRouteWrapperProps {
  children: ReactNode;
  requireAdminMode?: boolean; // Whether to require admin mode toggle
}

export function AdminRouteWrapper({
  children,
  requireAdminMode = true,
}: AdminRouteWrapperProps) {
  const session = useSession();
  const router = useRouter();
  const { isAdminMode } = useAdminMode();

  const status = session?.status || 'loading';
  const userRole = (session?.data?.user as any)?.role;

  useEffect(() => {
    if (status === 'loading') return;

    // Redirect non-admins immediately
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
      return;
    }

    // Check admin role
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      router.replace('/dashboard');
      return;
    }

    // Check admin mode if required
    if (requireAdminMode && !isAdminMode) {
      router.replace('/dashboard');
      return;
    }
  }, [status, userRole, isAdminMode, requireAdminMode, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Don't render admin content for non-admins
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return null;
  }

  // Don't render if admin mode is required but not enabled
  if (requireAdminMode && !isAdminMode) {
    return null;
  }

  return <>{children}</>;
}
