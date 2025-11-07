
'use client';

/**
 * My Household App Layout
 * Wraps the My Household page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { Home } from 'lucide-react';

export default function MyHouseholdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="My Household"
      icon={<Home className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
