
'use client';

import { useAdminMode } from '@/lib/admin-mode-store';
import { useSession } from 'next-auth/react';
import { Eye, Users, User } from 'lucide-react';

const VIEW_BANNER_CONFIG = {
  board: {
    icon: Users,
    text: 'Viewing as Board Member - Limited admin features available',
    colors: 'from-admin to-messaging',
  },
  resident: {
    icon: User,
    text: 'Viewing as Resident - Admin features are hidden',
    colors: 'from-community to-accent',
  },
} as const;

export function ModeBanner() {
  const { data: session } = useSession() || {};
  const { viewMode } = useAdminMode();

  // Only show for admin users not in admin mode
  if (!session?.user || session.user.role !== 'ADMIN' || viewMode === 'admin') {
    return null;
  }

  const config = VIEW_BANNER_CONFIG[viewMode];
  const Icon = config.icon;

  return (
    <div className={`w-full bg-gradient-to-r ${config.colors} text-white py-2 px-4 text-center text-sm font-medium shadow-md`}>
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{config.text}</span>
      </div>
    </div>
  );
}
