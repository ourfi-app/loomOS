
'use client';

/**
 * Messages App Layout
 * Wraps the Messages page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { MessageSquare } from 'lucide-react';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Messages"
      icon={<MessageSquare className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
