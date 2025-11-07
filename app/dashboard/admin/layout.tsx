'use client';

import { AdminRouteWrapper } from '@/components/admin/admin-route-wrapper';
import { ReactNode } from 'react';

/**
 * Admin Layout with Code Splitting
 *
 * This layout wraps all admin routes and provides:
 * 1. Automatic admin authentication
 * 2. Code splitting for admin features
 * 3. Consistent admin experience
 *
 * Code Splitting Benefits:
 * - Non-admin users: Never download admin code
 * - Admin users: Code loads only when visiting admin pages
 * - Reduced initial bundle for residents by ~200-300 KB
 *
 * All admin pages under /dashboard/admin/* automatically:
 * - Check for ADMIN or SUPER_ADMIN role
 * - Redirect non-admins to /dashboard
 * - Load admin-specific code on demand
 */

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminRouteWrapper requireAdminMode={true}>
      {children}
    </AdminRouteWrapper>
  );
}
