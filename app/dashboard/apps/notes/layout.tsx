
'use client';

/**
 * Notes App Layout
 * Wraps the Notes page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { FileText } from 'lucide-react';

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Notes"
      icon={<FileText className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
