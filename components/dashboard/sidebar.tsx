// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types


'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Building2, 
  Home, 
  MessageSquare, 
  Bell, 
  Users, 
  Settings, 
  LogOut,
  BarChart3,
  Shield,
  UserCircle,
  FileEdit,
  DollarSign,
  Megaphone,
  ChevronDown,
  ChevronRight,
  Upload,
  MapPin,
  Mail
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: string[];
  showBadge?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const userRole = (session?.user as any)?.role;
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [adminSectionOpen, setAdminSectionOpen] = useState(true);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchPendingRequests();
      const interval = setInterval(fetchPendingRequests, 30000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [userRole]);

  useEffect(() => {
    // Auto-expand admin section if on an admin page
    if (pathname?.startsWith('/dashboard/admin')) {
      setAdminSectionOpen(true);
    }
  }, [pathname]);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch('/api/directory-update-requests?status=PENDING');
      const data = await response.json();
      setPendingRequestsCount(data.requests?.length || 0);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const mainNavigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['ADMIN', 'BOARD_MEMBER', 'RESIDENT'] },
    { name: 'My Household', href: '/dashboard/my-household', icon: UserCircle, roles: ['ADMIN', 'BOARD_MEMBER', 'RESIDENT'] },
    { name: 'Community', href: '/dashboard/my-community', icon: Building2, roles: ['ADMIN', 'BOARD_MEMBER', 'RESIDENT'] },
    { name: 'Messages', href: '/dashboard/messages', icon: Mail, roles: ['ADMIN', 'BOARD_MEMBER'] },
  ];

  const secondaryNavigation: NavItem[] = [];

  const adminNavigation: NavItem[] = [
    { name: 'Overview', href: '/dashboard/admin', icon: Shield, roles: ['ADMIN'] },
    { name: 'Association Info', href: '/dashboard/admin/association', icon: Building2, roles: ['ADMIN'] },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users, roles: ['ADMIN'] },
    { name: 'Property Map', href: '/dashboard/admin/property-map', icon: MapPin, roles: ['ADMIN', 'BOARD_MEMBER'] },
    { name: 'Import Units', href: '/dashboard/admin/import-units', icon: Upload, roles: ['ADMIN'] },
    { name: 'Payments', href: '/dashboard/admin/payments', icon: DollarSign, roles: ['ADMIN'] },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['ADMIN'] },
    { name: 'Announcements', href: '/dashboard/admin/announcements', icon: Megaphone, roles: ['ADMIN'] },
    { name: 'Directory Requests', href: '/dashboard/admin/directory-requests', icon: FileEdit, roles: ['ADMIN'], showBadge: true },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings, roles: ['ADMIN'] },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    const showBadge = item.showBadge && pendingRequestsCount > 0;
    
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          'group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-200',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-nordic-gray hover:bg-nordic-frost hover:text-nordic-night'
        )}
      >
        <item.icon className={cn(
          "h-5 w-5 flex-shrink-0 transition-transform duration-200",
          isActive && "scale-110"
        )} />
        <span className="flex-1">{item.name}</span>
        {showBadge && (
          <Badge 
            className="ml-auto bg-nordic-aurora-red text-white px-2 py-0.5 text-xs border-0"
          >
            {pendingRequestsCount}
          </Badge>
        )}
      </Link>
    );
  };

  const filterNavItems = (items: NavItem[]) => {
    return items.filter(item => item.roles.includes(userRole));
  };

  const hasAdminAccess = userRole === 'ADMIN';

  return (
    <div className={cn('flex flex-col h-full bg-white border-r border-nordic-frost', className)}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-nordic-ocean shadow-sm">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-lg text-nordic-night tracking-tight">Montrecott</h1>
          <p className="text-sm text-muted-foreground">Community Portal</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 pb-6 mb-2">
        <div className="bg-gradient-nordic rounded-2xl p-4 border border-nordic-frost/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary font-semibold text-sm shadow-sm">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-nordic-night text-sm truncate">{session?.user?.name}</p>
              <p className="text-muted-foreground text-xs">{(session?.user as any)?.unitNumber || 'No unit'}</p>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="text-xs font-medium bg-white/60 text-nordic-night border-0 px-2.5 py-1"
          >
            {userRole?.toLowerCase().replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          {filterNavItems(mainNavigation).map(renderNavItem)}
        </div>

        {/* Secondary Navigation */}
        {filterNavItems(secondaryNavigation).length > 0 && (
          <div className="space-y-1 mb-8">
            <div className="px-4 mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                More
              </p>
            </div>
            {filterNavItems(secondaryNavigation).map(renderNavItem)}
          </div>
        )}

        {/* Admin Section */}
        {hasAdminAccess && (
          <div className="space-y-1 pt-6 border-t border-nordic-frost">
            <button
              onClick={() => setAdminSectionOpen(!adminSectionOpen)}
              className="flex items-center gap-2 px-4 py-2 w-full text-left rounded-xl hover:bg-nordic-frost transition-colors duration-200 mb-2"
            >
              {adminSectionOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
              )}
              <Shield className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex-1">
                Administration
              </p>
              {pendingRequestsCount > 0 && (
                <Badge 
                  className="bg-nordic-aurora-red text-white px-1.5 py-0 text-xs border-0"
                >
                  {pendingRequestsCount}
                </Badge>
              )}
            </button>
            {adminSectionOpen && (
              <div className="space-y-1 pt-1 animate-fade-in">
                {filterNavItems(adminNavigation).map(renderNavItem)}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* AI Assistant Chat - Persistent */}
      <div className="p-4 border-t border-nordic-frost">
        <Link href="/dashboard/chat">
          <Button
            variant={pathname === '/dashboard/chat' ? 'default' : 'outline'}
            className={cn(
              "w-full justify-start gap-3 rounded-xl transition-all duration-200 mb-2",
              pathname === '/dashboard/chat'
                ? "bg-gradient-to-r from-primary to-nordic-ocean text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 border-0"
                : "border-2 border-nordic-frost hover:border-primary/30 hover:bg-gradient-to-r hover:from-nordic-frost hover:to-white text-nordic-night"
            )}
          >
            <MessageSquare className={cn(
              "h-5 w-5 transition-transform",
              pathname === '/dashboard/chat' && "scale-110"
            )} />
            <span className="font-semibold">AI Assistant</span>
          </Button>
        </Link>
      </div>

      {/* Logout */}
      <div className="px-4 pb-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-nordic-night hover:bg-nordic-frost rounded-xl transition-all duration-200"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
