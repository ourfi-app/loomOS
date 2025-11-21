// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * Creator Studio - Super Admin Development Hub
 *
 * IMPORTANT: This is NOT a consolidation pattern like Organizer or Inbox.
 * This is a **quick access dashboard** for super admins to access platform
 * development tools. The individual apps are NOT deprecated.
 *
 * PATTERN:
 * - Creator Studio provides overview tabs that LINK TO full apps
 * - The full apps remain active and fully functional
 * - Super admins use Creator Studio for quick access and overview
 * - Super admins use the full apps for deep work
 *
 * TABS AND THEIR FULL APPS:
 * - Branding tab → Links to /dashboard/apps/brandy (Brandy Logo Designer)
 * - Designer tab → Links to /dashboard/apps/designer (App Designer)
 * - Marketplace tab → Links to /dashboard/marketplace (App Marketplace)
 * - Enhancements tab → Links to /dashboard/apps/enhancements (System Enhancements)
 *
 * WHY BOTH EXIST:
 * - Quick overview without leaving Creator Studio
 * - Full apps provide complete features for actual development work
 * - Similar to how VS Code has a sidebar for quick access but full editors for work
 *
 * Access: SUPER_ADMIN only
 * Release: Phase 1 (2025-11-03)
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Palette,
  Wrench,
  Store,
  Sparkles,
  Code,
  Shield
} from 'lucide-react';
import {
  LoomOSNavigationPane,
  DesktopAppWrapper
} from '@/components/webos';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import the individual tab components
import dynamic from 'next/dynamic';

// Dynamically import the heavy components to improve initial load
const BrandingTab = dynamic(() => import('@/components/creator-studio/branding-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

const DesignerTab = dynamic(() => import('@/components/creator-studio/designer-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

const MarketplaceTab = dynamic(() => import('@/components/creator-studio/marketplace-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

const EnhancementsTab = dynamic(() => import('@/components/creator-studio/enhancements-tab'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

type TabType = 'branding' | 'designer' | 'marketplace' | 'enhancements';

export default function CreatorStudioPage() {
  const session = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('branding');

  const userRole = (session?.data?.user as any)?.role;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  // Redirect non-super-admins
  if (session.status === 'authenticated' && !isSuperAdmin) {
    router.push('/dashboard');
    return null;
  }

  const navItems = [
    {
      id: 'branding',
      label: 'Branding',
      icon: <Palette className="h-5 w-5" />,
      active: activeTab === 'branding',
      onClick: () => setActiveTab('branding')
    },
    {
      id: 'designer',
      label: 'App Designer',
      icon: <Wrench className="h-5 w-5" />,
      active: activeTab === 'designer',
      onClick: () => setActiveTab('designer')
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: <Store className="h-5 w-5" />,
      active: activeTab === 'marketplace',
      onClick: () => setActiveTab('marketplace')
    },
    {
      id: 'enhancements',
      label: 'Enhancements',
      icon: <Sparkles className="h-5 w-5" />,
      active: activeTab === 'enhancements',
      onClick: () => setActiveTab('enhancements')
    },
  ];

  const appDef = APP_REGISTRY['creator-studio'];
  const CreatorStudioIcon = appDef?.icon;

  return (
    <DesktopAppWrapper
      title={appDef?.title || 'Creator Studio'}
      icon={CreatorStudioIcon ? <CreatorStudioIcon className="w-5 h-5" /> : <Code className="w-5 h-5" />}
      gradient={appDef?.gradient || 'from-violet-500 via-purple-500 to-fuchsia-500'}
    >
      <div className="h-full flex overflow-hidden">
        <LoomOSNavigationPane
          title="Creator Tools"
          items={navItems}
        />

        <div className="flex-1 bg-background overflow-hidden flex flex-col">
          {/* Super Admin Badge */}
          <div className="px-4 py-2 border-b border-border bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20">
            <Alert className="border-violet-200 bg-white/50 dark:bg-black/20">
              <Shield className="h-4 w-4 text-violet-600" />
              <AlertDescription className="text-sm">
                <strong className="text-violet-700 dark:text-violet-400">Super Admin Mode:</strong> These tools modify the platform itself. Changes affect all communities and users.
              </AlertDescription>
            </Alert>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'branding' && <BrandingTab />}
            {activeTab === 'designer' && <DesignerTab />}
            {activeTab === 'marketplace' && <MarketplaceTab />}
            {activeTab === 'enhancements' && <EnhancementsTab />}
          </div>
        </div>
      </div>
    </DesktopAppWrapper>
  );
}
