
'use client';

/**
 * Tasks App Layout
 * Wraps the Tasks page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { CheckSquare } from 'lucide-react';

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Tasks"
      icon={<CheckSquare className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
