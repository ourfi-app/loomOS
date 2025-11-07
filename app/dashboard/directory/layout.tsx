
'use client';

/**
 * Directory App Layout
 * Wraps the Directory page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { Users } from 'lucide-react';

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Directory"
      icon={<Users className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
