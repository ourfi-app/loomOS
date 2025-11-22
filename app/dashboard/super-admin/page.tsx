
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Globe, 
  Key, 
  Activity, 
  Shield, 
  Database,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { ErrorBoundary } from '@/components/common';
import { APP_COLORS } from '@/lib/app-design-system';

interface SystemStats {
  organizations: {
    total: number;
    active: number;
    suspended: number;
    trial: number;
  };
  users: {
    total: number;
    active: number;
    admins: number;
    residents: number;
  };
  storage: {
    used: number;
    limit: number;
    percentage: number;
  };
  apiCalls: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'SUPER_ADMIN') {
      toast.error('Access denied. Super admin privileges required.');
      router.push('/dashboard');
      return;
    }

    fetchSystemStats();
  }, [session, status, router]);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load system statistics');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Failed to load system statistics</p>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Organizations',
      description: 'Manage tenants and settings',
      href: '/dashboard/super-admin/organizations',
      icon: Building2,
      color: 'text-[var(--semantic-primary)]'
    },
    {
      title: 'Users',
      description: 'Manage all platform users',
      href: '/dashboard/super-admin/users',
      icon: Users,
      color: 'text-[var(--semantic-success)]'
    },
    {
      title: 'Domains',
      description: 'Configure custom domains',
      href: '/dashboard/super-admin/domains',
      icon: Globe,
      color: 'text-[var(--semantic-accent)]'
    },
    {
      title: 'API Management',
      description: 'API keys and usage',
      href: '/dashboard/super-admin/api',
      icon: Key,
      color: 'text-[var(--semantic-primary)]'
    },
    {
      title: 'System Monitoring',
      description: 'Performance and health',
      href: '/dashboard/super-admin/monitoring',
      icon: Activity,
      color: 'text-[var(--semantic-error)]'
    },
    {
      title: 'Security',
      description: 'Security settings and logs',
      href: '/dashboard/super-admin/security',
      icon: Shield,
      color: 'text-[var(--semantic-accent)]'
    }
  ];

  return (
    <ErrorBoundary>
      <DesktopAppWrapper
        title="Super Admin"
        icon={<Shield className="w-5 h-5" />}
        gradient="from-red-500 via-red-600 to-red-700"
      >
    <div 
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: "'Helvetica Neue', Arial, sans-serif"
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-light tracking-tight"
            style={{ color: 'var(--webos-text-primary)' }}
          >
            Super Admin Dashboard
          </h1>
          <p className="font-light mt-1" style={{ color: 'var(--webos-text-secondary)' }}>
            Platform-wide management and monitoring
          </p>
        </div>
        <Badge 
          variant="destructive" 
          className="text-sm font-light"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            color: '#dc2626'
          }}
        >
          <Shield className="w-4 h-4 mr-1" />
          SUPER ADMIN
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Organizations
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.organizations.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-[var(--semantic-success)]">{stats.organizations.active} active</span>
              {' · '}
              <span className="text-[var(--semantic-warning)]">{stats.organizations.trial} trial</span>
              {stats.organizations.suspended > 0 && (
                <>
                  {' · '}
                  <span className="text-[var(--semantic-error)]">{stats.organizations.suspended} suspended</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-[var(--semantic-success)]">{stats.users.active} active</span>
              {' · '}
              {stats.users.admins} admins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Storage Usage
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.storage.used / 1024).toFixed(1)} GB
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min(stats.storage.percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.storage.percentage.toFixed(1)}% of {stats.storage.limit} GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls (Today)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.apiCalls.today.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.apiCalls.thisWeek.toLocaleString()} this week
              {' · '}
              {stats.apiCalls.thisMonth.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-muted ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest system-wide events and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            ) : (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className="mt-0.5">
                    {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-[var(--semantic-success)]" />}
                    {activity.type === 'warning' && <AlertCircle className="h-4 w-4 text-[var(--semantic-warning)]" />}
                    {activity.type === 'error' && <XCircle className="h-4 w-4 text-[var(--semantic-error)]" />}
                    {activity.type === 'info' && <Activity className="h-4 w-4 text-[var(--semantic-primary)]" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          {stats.recentActivity.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Link href="/dashboard/super-admin/activity">
                <Button variant="outline" size="sm">
                  View All Activity
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
        </div>
      </div>
      </DesktopAppWrapper>
    </ErrorBoundary>
  );
}
