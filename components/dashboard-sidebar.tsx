

'use client';

import { useSession } from 'next-auth/react';
import { SidebarNav, SidebarNavItem } from '@/components/macos/sidebar-nav';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  MessageSquare,
  User,
  Home,
  Settings,
  Shield,
  Bell,
  MapPin,
  Upload,
  UsersRound,
  Building
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export function DashboardSidebar() {
  const { data: session } = useSession() || {};
  const user = session?.user;

  const userNavItems: SidebarNavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'My Profile', href: '/dashboard/profile', icon: User },
    { title: 'My Household', href: '/dashboard/my-household', icon: Home },
    { title: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { title: 'Documents', href: '/dashboard/documents', icon: FileText },
    { title: 'Directory', href: '/dashboard/directory', icon: Users },
    { title: 'My Community', href: '/dashboard/my-community', icon: Building },
    { title: 'AI Assistant', href: '/dashboard/chat', icon: MessageSquare },
  ];

  const adminNavItems: SidebarNavItem[] = [
    { title: 'Admin Dashboard', href: '/dashboard/admin', icon: Shield },
    { title: 'User Management', href: '/dashboard/admin/users', icon: UsersRound },
    { title: 'Association Settings', href: '/dashboard/admin/association', icon: Settings },
    { title: 'Announcements', href: '/dashboard/admin/announcements', icon: Bell },
    { title: 'Payment Management', href: '/dashboard/admin/payments', icon: CreditCard },
    { title: 'Property Map', href: '/dashboard/admin/property-map', icon: MapPin },
    { title: 'Directory Requests', href: '/dashboard/admin/directory-requests', icon: Users },
    { title: 'Import Units', href: '/dashboard/admin/import-units', icon: Upload },
  ];

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  return (
    <div className="h-full flex flex-col p-4">
      {/* User Profile Section */}
      <div 
        className="mb-6 p-4"
        style={{
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--surface-secondary)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback 
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)',
              }}
            >
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p 
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {user?.name || user?.email}
            </p>
            <p 
              className="text-xs capitalize"
              style={{ color: 'var(--text-secondary)' }}
            >
              {user?.role?.toLowerCase() || 'Resident'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto macos-scrollbar space-y-6">
        <SidebarNav items={userNavItems} title="General" />
        {isAdmin && <SidebarNav items={adminNavItems} title="Administration" />}
      </div>

      {/* Footer */}
      <div 
        className="mt-4 pt-4"
        style={{ borderTop: '1px solid var(--border-light)' }}
      >
        <p 
          className="text-xs text-center"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Montrecott Community
        </p>
      </div>
    </div>
  );
}
