
'use client';

/**
 * Email App Layout
 * Wraps the Email page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { Mail } from 'lucide-react';

export default function EmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Email"
      icon={<Mail className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
