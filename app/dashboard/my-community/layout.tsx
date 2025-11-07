
'use client';

/**
 * My Community App Layout
 * Wraps the My Community page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { Users } from 'lucide-react';

export default function MyCommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="My Community"
      icon={<Users className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
