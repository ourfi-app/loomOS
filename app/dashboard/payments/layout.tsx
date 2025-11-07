
'use client';

/**
 * Payments App Layout
 * Wraps the Payments page with desktop windowing on large screens
 */

import { AppPageWrapper } from '@/components/webos/app-page-wrapper';
import { CreditCard } from 'lucide-react';

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppPageWrapper
      title="Payments"
      icon={<CreditCard className="w-5 h-5" />}
    >
      {children}
    </AppPageWrapper>
  );
}
