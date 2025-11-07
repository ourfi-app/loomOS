
'use client';

/**
 * Calendar App Layout
 * Wraps the Calendar page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { Calendar } from 'lucide-react';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Calendar"
      icon={<Calendar className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
