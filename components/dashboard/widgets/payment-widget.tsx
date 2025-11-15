
'use client';

import { Card } from '@/components/ui/card';
import { CreditCard, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function PaymentWidget() {
  const router = useRouter();
  const [nextPayment, setNextPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextPayment() {
      try {
        const response = await fetch('/api/payments/next');
        if (response.ok) {
          const data = await response.json();
          setNextPayment(data);
        }
      } catch (error) {
        console.error('Failed to fetch next payment:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNextPayment();
  }, []);

  if (loading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-20 bg-muted rounded" />
      </Card>
    );
  }

  if (!nextPayment) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--semantic-success)]/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-[var(--semantic-success)]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-muted-foreground">Next Payment</div>
            <div className="text-lg font-bold text-[var(--semantic-success)]">All Paid Up! ✓</div>
          </div>
        </div>
      </Card>
    );
  }

  const daysUntilDue = Math.ceil(
    (new Date(nextPayment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

  return (
    <Card 
      className="p-4 hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => router.push('/dashboard/payments')}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          isOverdue ? "bg-[var(--semantic-error)]/10" : isDueSoon ? "bg-[var(--semantic-primary)]/10" : "bg-[var(--semantic-primary)]/10"
        )}>
          <CreditCard className={cn(
            "w-6 h-6",
            isOverdue ? "text-[var(--semantic-error)]" : isDueSoon ? "text-[var(--semantic-primary)]" : "text-[var(--semantic-primary)]"
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-muted-foreground">Next Payment</div>
          <div className="text-lg font-bold">${nextPayment.amount}</div>
          <div className={cn(
            "text-xs",
            isOverdue ? "text-[var(--semantic-error)]" : isDueSoon ? "text-[var(--semantic-primary)]" : "text-muted-foreground"
          )}>
            {isOverdue 
              ? `Overdue ${Math.abs(daysUntilDue)} days` 
              : isDueSoon 
                ? `Due in ${daysUntilDue} days`
                : new Date(nextPayment.dueDate).toLocaleDateString()
            }
          </div>
        </div>
        
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
      </div>
    </Card>
  );
}
