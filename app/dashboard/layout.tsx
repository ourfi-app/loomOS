// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoomOSContainer } from '@/components/webos/loomos-container';
import { useCardManager } from '@/lib/card-manager-store';
import { DesktopWidgets } from '@/components/webos/desktop-widgets';
import { UniversalSearch } from '@/components/webos/universal-search';
import { UserOnboardingModal } from '@/components/onboarding/user-onboarding-modal';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { DesktopCustomizationPanel } from '@/components/webos/desktop-customization-panel';
import { CardStackView } from '@/components/webos/card-stack-view';
import { AnimatePresence } from 'framer-motion';
import { MotionProvider } from '@/components/providers/motion-provider';
import { 
  Home, 
  Users, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Settings, 
  Bell, 
  User, 
  Shield, 
  Upload,
  Calendar,
  BarChart,
  Building
} from 'lucide-react';

const ROUTE_TO_CARD_MAP: Record<string, { id: string; title: string; icon: any }> = {
  '/dashboard': { id: 'dashboard', title: 'Dashboard', icon: Home },
  '/dashboard/directory': { id: 'directory', title: 'Residents Directory', icon: Users },
  '/dashboard/my-community': { id: 'my-community', title: 'My Community', icon: Users },
  '/dashboard/payments': { id: 'payments', title: 'Payments', icon: CreditCard },
  '/dashboard/documents': { id: 'documents', title: 'Documents', icon: FileText },
  '/dashboard/chat': { id: 'chat', title: 'AI Chat', icon: MessageSquare },
  '/dashboard/marketplace': { id: 'marketplace', title: 'Marketplace', icon: Building },
  '/dashboard/messages': { id: 'messages', title: 'Messages', icon: MessageSquare },
  '/dashboard/household': { id: 'household', title: 'My Household', icon: Home },
  '/dashboard/my-household': { id: 'my-household', title: 'My Household', icon: Home },
  '/dashboard/apps/calendar': { id: 'calendar', title: 'Calendar', icon: Calendar },
  '/dashboard/apps/email': { id: 'email', title: 'Email', icon: MessageSquare },
  '/dashboard/apps/notes': { id: 'notes', title: 'Notes', icon: FileText },
  '/dashboard/ai-assistant': { id: 'ai-assistant', title: 'AI Assistant', icon: MessageSquare },
  '/dashboard/notifications': { id: 'notifications', title: 'Notifications', icon: Bell },
  '/dashboard/profile': { id: 'profile', title: 'My Profile', icon: User },
  '/dashboard/admin': { id: 'admin', title: 'Admin Panel', icon: Shield },
  '/dashboard/admin/users': { id: 'admin-users', title: 'User Management', icon: Users },
  '/dashboard/admin/announcements': { id: 'admin-announcements', title: 'Announcements', icon: Bell },
  '/dashboard/admin/association': { id: 'admin-association', title: 'Association', icon: Building },
  '/dashboard/admin/directory-requests': { id: 'admin-directory-requests', title: 'Directory Requests', icon: Users },
  '/dashboard/admin/import-units': { id: 'admin-import-units', title: 'Import Units', icon: Upload },
  '/dashboard/admin/payments': { id: 'admin-payments', title: 'Payments', icon: CreditCard },
  '/dashboard/admin/property-map': { id: 'admin-property-map', title: 'Property Map', icon: Building },
  '/dashboard/admin/units': { id: 'admin-units', title: 'Unit Management', icon: Building },
  '/dashboard/admin/settings': { id: 'admin-settings', title: 'Settings', icon: Settings },
  '/dashboard/admin/reports': { id: 'admin-reports', title: 'Reports', icon: BarChart },
  '/dashboard/admin/import': { id: 'admin-import', title: 'Import Data', icon: Upload },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const pathname = usePathname();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showUserOnboarding, setShowUserOnboarding] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showCardStack, setShowCardStack] = useState(false);
  const { launchApp, cards, toggleMultitaskingView, isMultitaskingView } = useCardManager();

  // Keyboard shortcuts for card management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F3 or Cmd/Ctrl+Tab - Toggle card stack view
      if (e.key === 'F3' || ((e.metaKey || e.ctrlKey) && e.key === 'Tab')) {
        e.preventDefault();
        setShowCardStack((prev) => !prev);
      }
      
      // Escape - Close card stack view
      if (e.key === 'Escape' && showCardStack) {
        setShowCardStack(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCardStack]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (status === 'authenticated' && session?.data?.user) {
        const user = session?.data?.user as any;
        
        // Check system onboarding for admins
        if (user.role === 'ADMIN') {
          try {
            const response = await fetch('/api/onboarding/status');
            if (response.ok) {
              const result = await response.json();
              
              if (result.settings && !result.settings.onboardingCompleted) {
                router.replace('/onboarding');
                return;
              }
            }
          } catch (error) {
            console.error('Error checking system onboarding status:', error);
          }
        }

        // Check user onboarding for all users (board members and residents)
        if (user.role === 'BOARD_MEMBER' || user.role === 'RESIDENT') {
          try {
            const response = await fetch('/api/user/onboarding/status');
            if (response.ok) {
              const result = await response.json();
              
              if (!result.onboardingCompleted) {
                setShowUserOnboarding(true);
              }
            }
          } catch (error) {
            console.error('Error checking user onboarding status:', error);
          }
        }

        setOnboardingChecked(true);
      }
    };

    if (status === 'authenticated' && !onboardingChecked) {
      checkOnboarding();
    }
  }, [status, session, router, onboardingChecked]);

  const handleOnboardingComplete = async () => {
    setShowUserOnboarding(false);
    // No need to reload the page - just close the modal
  };

  // Add card based on current route
  useEffect(() => {
    if (pathname && ROUTE_TO_CARD_MAP[pathname]) {
      const card = ROUTE_TO_CARD_MAP[pathname];
      if (!card) return;
      
      // Skip launching card for dashboard home page
      if (card.id === 'dashboard') {
        return;
      }
      launchApp({
        id: card.id,
        title: card.title,
        path: pathname,
        color: 'from-cyan-500 via-blue-500 to-cyan-600', // Default gradient
        icon: card.id,
      });
    }
  }, [pathname, launchApp]);

  if (status === 'loading' || (status === 'authenticated' && !onboardingChecked)) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--surface-primary)' }}
      >
        <div className="text-center">
          <div className="webos-spinner"></div>
          <p
            style={{
              color: 'var(--text-primary)',
              fontWeight: 'var(--font-medium)',
              marginTop: 'var(--space-md)'
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <MotionProvider>
      <LoomOSContainer
        onOpenCustomization={() => setShowCustomization(true)}
      >
      {/* Show onboarding modal or dashboard content */}
      {showUserOnboarding ? (
        <>
          {/* Blur background during onboarding */}
          <div className="h-full overflow-hidden blur-sm pointer-events-none pt-10">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
          {/* User onboarding modal */}
          <UserOnboardingModal 
            open={showUserOnboarding} 
            onComplete={handleOnboardingComplete} 
          />
        </>
      ) : (
        <>
          <div id="desktop-main" className="h-full overflow-hidden pt-10">
            <ErrorBoundary>
              {/* Render dashboard home or active apps */}
              {pathname === '/dashboard' && cards.length === 0 ? (
                // Show dashboard home when no apps are open
                children
              ) : (
                // Show app windows when apps are open
                children
              )}
            </ErrorBoundary>
          </div>
          
          {/* Desktop Widgets - Task widget, etc. */}
          <DesktopWidgets />
          
          {/* Desktop Customization Panel - for changing background/widgets */}
          <DesktopCustomizationPanel
            isOpen={showCustomization}
            onClose={() => setShowCustomization(false)}
          />
          
          {/* Universal Search - "Just type" feature with Cmd/Ctrl+K */}
          <UniversalSearch />
          
          {/* Card Stack View - webOS-style app switcher (F3 or Cmd/Ctrl+Tab) */}
          <AnimatePresence>
            {showCardStack && cards.length > 0 && (
              <CardStackView onClose={() => setShowCardStack(false)} />
            )}
          </AnimatePresence>
        </>
      )}
    </LoomOSContainer>
    </MotionProvider>
  );
}
