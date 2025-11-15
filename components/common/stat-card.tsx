
'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  iconColor?: string;
  iconBg?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  className,
  onClick
}: StatCardProps) {
  const TrendIcon = change?.trend === 'up' ? TrendingUp : change?.trend === 'down' ? TrendingDown : Minus;
  const trendColor = change?.trend === 'up' ? 'text-[var(--semantic-success)]' : change?.trend === 'down' ? 'text-[var(--semantic-error)]' : 'text-muted-foreground';

  return (
    <Card 
      className={cn(
        "p-5 hover:shadow-md transition-shadow",
        onClick && "cursor-pointer hover:border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground truncate">
            {value}
          </p>
          {change && (
            <div className={cn("flex items-center gap-1 mt-2 text-sm", trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
            iconBg
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        )}
      </div>
    </Card>
  );
}
