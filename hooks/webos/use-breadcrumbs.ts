
'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Home, Shield, Users, FileText, CreditCard, User, Building2, Store, Bell, Mail, Sparkles } from 'lucide-react';

export interface Breadcrumb {
  label: string;
  path?: string;
  icon?: any;
}

export function useBreadcrumbs(): Breadcrumb[] {
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname || pathname === '/') return [];

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];

    // Always start with Dashboard
    if (segments[0] === 'dashboard') {
      breadcrumbs.push({
        label: 'Home',
        path: '/dashboard',
        icon: Home,
      });

      // Parse remaining segments
      for (let i = 1; i < segments.length; i++) {
        const segment = segments[i];
        const path = `/${segments.slice(0, i + 1).join('/')}`;

        // Check if it's a dynamic segment (UUID, etc.)
        const isDynamic = segment && (segment.length > 20 || 
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment));

        if (isDynamic) {
          // Try to get context from previous segment
          const prevSegment = segments[i - 1];
          if (prevSegment === 'users') {
            breadcrumbs.push({
              label: 'Edit User',
              path: undefined, // Don't link to current page
            });
          } else if (prevSegment === 'households') {
            breadcrumbs.push({
              label: 'Edit Household',
              path: undefined,
            });
          } else if (prevSegment === 'documents') {
            breadcrumbs.push({
              label: 'View Document',
              path: undefined,
            });
          } else if (prevSegment === 'notifications') {
            breadcrumbs.push({
              label: 'View Notification',
              path: undefined,
            });
          } else {
            breadcrumbs.push({
              label: 'Details',
              path: undefined,
            });
          }
        } else {
          // Map known segments to readable names
          const segmentMap: Record<string, { label: string; icon?: any }> = {
            // Admin
            admin: { label: 'Admin', icon: Shield },
            users: { label: 'Users', icon: Users },
            households: { label: 'Households', icon: Building2 },
            
            // Community
            documents: { label: 'Documents', icon: FileText },
            directory: { label: 'Directory', icon: Users },
            marketplace: { label: 'App Store', icon: Store },
            
            // Personal
            profile: { label: 'My Profile', icon: User },
            payments: { label: 'My Payments', icon: CreditCard },
            
            // Communication
            notifications: { label: 'Notifications', icon: Bell },
            messages: { label: 'Email', icon: Mail },
            chat: { label: 'AI Assistant', icon: Sparkles },
            
            // Actions
            new: { label: 'New' },
            edit: { label: 'Edit' },
            create: { label: 'Create' },
            settings: { label: 'Settings' },
          };

          const mapped = (segment && segmentMap[segment]) || {
            label: segment ? (segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')) : 'Unknown',
          };

          breadcrumbs.push({
            label: mapped.label,
            path: i === segments.length - 1 ? undefined : path, // Don't link to current page
            icon: mapped.icon,
          });
        }
      }
    }

    return breadcrumbs;
  }, [pathname]);
}
