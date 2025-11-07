
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAdminMode } from '@/lib/admin-mode-store';
import { useEffect, ReactNode } from 'react';

interface AdminRouteGuardProps {
  children: ReactNode;
  fallbackPath?: string;
  requireSuperAdmin?: boolean;
}

export function AdminRouteGuard({ 
  children, 
  fallbackPath = '/dashboard',
  requireSuperAdmin = false 
}: AdminRouteGuardProps) {
  const { data: session, status } = useSession() || {};
  const { isAdminMode } = useAdminMode();
  const router = useRouter();

  const userRole = (session?.user as any)?.role;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isAdmin = userRole === 'ADMIN';
  
  // SUPER_ADMIN has unrestricted access to EVERYTHING
  let hasAccess = false;
  if (isSuperAdmin) {
    hasAccess = true;
  } else if (requireSuperAdmin) {
    // If super admin is required, only super admins can access
    hasAccess = false;
  } else if (isAdmin) {
    // Regular admins need admin mode enabled (unless they're super admin)
    hasAccess = isAdminMode;
  }

  useEffect(() => {
    if (status === 'authenticated' && !hasAccess) {
      router.push(fallbackPath);
    }
  }, [status, hasAccess, router, fallbackPath]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="webos-spinner mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
