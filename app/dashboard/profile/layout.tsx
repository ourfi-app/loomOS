
'use client';

/**
 * Profile App Layout
 * Wraps the Profile page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { User } from 'lucide-react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="My Profile"
      icon={<User className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
