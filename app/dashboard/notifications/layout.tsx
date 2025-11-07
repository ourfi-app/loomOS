
'use client';

/**
 * Notifications App Layout
 * Wraps the Notifications page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { Bell } from 'lucide-react';

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Notifications"
      icon={<Bell className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
