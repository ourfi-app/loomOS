'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Activity,
  ExternalLink,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { DesktopWidget } from '@/lib/desktop-widget-store';

interface Stat {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

interface DesktopStatsWidgetProps {
  widget: DesktopWidget;
}

export function DesktopStatsWidget({ widget }: DesktopStatsWidgetProps) {
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockStats: Stat[] = [
        {
          id: '1',
          label: 'Total Residents',
          value: 248,
          change: 5.2,
          trend: 'up',
          icon: 'users',
          color: 'blue',
        },
        {
          id: '2',
          label: 'Occupancy Rate',
          value: '94.5%',
          change: 2.1,
          trend: 'up',
          icon: 'activity',
          color: 'green',
        },
        {
          id: '3',
          label: 'Monthly Revenue',
          value: '$125,840',
          change: -1.3,
          trend: 'down',
          icon: 'dollar',
          color: 'emerald',
        },
        {
          id: '4',
          label: 'Active Requests',
          value: 12,
          change: -8.5,
          trend: 'down',
          icon: 'file',
          color: 'orange',
        },
        {
          id: '5',
          label: 'Completed Tasks',
          value: 34,
          change: 15.3,
          trend: 'up',
          icon: 'check',
          color: 'purple',
        },
        {
          id: '6',
          label: 'Upcoming Events',
          value: 8,
          trend: 'neutral',
          icon: 'calendar',
          color: 'pink',
        },
      ];

      setStats(mockStats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, widget.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchStats, widget.refreshInterval]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      users: Users,
      activity: Activity,
      dollar: DollarSign,
      file: FileText,
      check: CheckCircle2,
      calendar: Calendar,
    };
    return icons[iconName] || Activity;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-[var(--semantic-primary)]/10', text: 'text-[var(--semantic-primary)]', border: 'border-[var(--semantic-primary)]/20' },
      green: { bg: 'bg-[var(--semantic-success)]/10', text: 'text-[var(--semantic-success)]', border: 'border-[var(--semantic-success)]/20' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
      orange: { bg: 'bg-[var(--semantic-primary)]/10', text: 'text-[var(--semantic-primary)]', border: 'border-orange-500/20' },
      purple: { bg: 'bg-[var(--semantic-accent)]/10', text: 'text-[var(--semantic-accent)]', border: 'border-purple-500/20' },
      pink: { bg: 'bg-[var(--semantic-accent)]/10', text: 'text-[var(--semantic-accent)]', border: 'border-pink-500/20' },
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="h-full p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Dashboard Stats</p>
            <p className="text-xs text-muted-foreground">Real-time overview</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => router.push('/dashboard/admin')}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Details
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <ScrollArea className="flex-1 p-3">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(stat => {
            const Icon = getIcon(stat.icon);
            const colors = getColorClasses(stat.color);

            return (
              <div
                key={stat.id}
                className={cn(
                  'p-3 rounded-lg border transition-all hover:shadow-md',
                  'bg-card hover:bg-accent/30',
                  colors.border
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={cn('p-2 rounded-lg', colors.bg)}>
                    <Icon className={cn('h-4 w-4', colors.text)} />
                  </div>
                  {stat.change !== undefined && (
                    <div className={cn(
                      'flex items-center gap-0.5 text-xs font-medium',
                      stat.trend === 'up' && 'text-[var(--semantic-success)]',
                      stat.trend === 'down' && 'text-[var(--semantic-error)]',
                      stat.trend === 'neutral' && 'text-muted-foreground'
                    )}>
                      {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                      {stat.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                      {stat.change > 0 && '+'}
                      {stat.change}%
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-2xl font-bold mb-0.5">{stat.value}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[var(--semantic-success)]" />
            Monthly Performance
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overall Growth</span>
              <span className="font-medium text-[var(--semantic-success)]">+3.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tasks Completed</span>
              <span className="font-medium">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Resident Satisfaction</span>
              <span className="font-medium text-[var(--semantic-success)]">4.6/5.0</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t bg-muted/20">
        <p className="text-xs text-center text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
