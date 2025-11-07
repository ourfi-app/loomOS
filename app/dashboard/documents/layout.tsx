
'use client';

/**
 * Documents App Layout
 * Wraps the Documents page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { FileText } from 'lucide-react';

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Documents"
      icon={<FileText className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
