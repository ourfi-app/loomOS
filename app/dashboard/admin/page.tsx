
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMode } from '@/lib/admin-mode-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Building,
  Bell,
  Shield,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalUnits: number;
  totalPayments: number;
  pendingPayments: number;
  overduePayments: number;
  paidPayments: number;
  monthlyRevenue: number;
  collectionRate: number;
  totalDocuments: number;
  pendingRequests: number;
  recentActivity: any[];
}

export default function AdminDashboardPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const { isAdminMode } = useAdminMode();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalUnits: 0,
    totalPayments: 0,
    pendingPayments: 0,
    overduePayments: 0,
    paidPayments: 0,
    monthlyRevenue: 0,
    collectionRate: 0,
    totalDocuments: 0,
    pendingRequests: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  
  const userRole = (session?.data?.user as any)?.role;

  useEffect(() => {
    if (status === 'authenticated' && (userRole !== 'ADMIN' || !isAdminMode)) {
      router.push('/dashboard');
    }
  }, [status, userRole, isAdminMode, router]);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchAdminStats();
      const interval = setInterval(fetchAdminStats, 60000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [userRole]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--semantic-primary)] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'ADMIN') {
    return null;
  }

  // Get app definition for styling
  const appDef = APP_REGISTRY['admin'];
  const AdminIcon = appDef?.icon;

  // Desktop window menu bar items
  const menuBar = [
    {
      label: 'Dashboard',
      items: [
        {
          label: 'Refresh Statistics',
          shortcut: 'Ctrl+R',
          onClick: fetchAdminStats,
        },
        { separator: true },
        {
          label: 'Export Report',
          onClick: () => {
            // TODO: Implement export functionality
            console.log('Export report');
          },
        },
      ],
    },
    {
      label: 'Navigate',
      items: [
        {
          label: 'Manage Users',
          onClick: () => router.push('/dashboard/admin/users'),
        },
        {
          label: 'Manage Payments',
          onClick: () => router.push('/dashboard/admin/payments'),
        },
        {
          label: 'Send Announcement',
          onClick: () => router.push('/dashboard/admin/announcements'),
        },
        {
          label: 'View Property Map',
          onClick: () => router.push('/dashboard/admin/property-map'),
        },
        { separator: true },
        {
          label: 'Settings',
          onClick: () => router.push('/dashboard/admin/settings'),
        },
      ],
    },
    {
      label: 'View',
      items: [
        {
          label: 'Key Metrics',
          checked: true,
        },
        {
          label: 'Recent Activity',
          checked: true,
        },
        {
          label: 'Alerts & Warnings',
          checked: stats.overduePayments > 0 || stats.pendingRequests > 0,
        },
      ],
    },
  ];

  return (
    <DesktopAppWrapper
      title={appDef?.title || 'Admin Panel'}
      icon={AdminIcon ? <AdminIcon className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
      gradient={appDef?.gradient}
      menuBar={menuBar}
      showMenuBar={true}
    >
      <div className="h-full overflow-y-auto">
        <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-[var(--semantic-primary)]" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of your condo association
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Activity className="h-4 w-4 mr-2" />
          Live
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-[var(--semantic-success)] font-medium">{stats.activeUsers} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              {stats.collectionRate >= 80 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-[var(--semantic-success)]" />
                  <span className="text-[var(--semantic-success)]">{stats.collectionRate.toFixed(0)}% collected</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-[var(--semantic-primary)]" />
                  <span className="text-[var(--semantic-primary)]">{stats.collectionRate.toFixed(0)}% collected</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.paidPayments} paid this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[var(--semantic-error)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--semantic-error)]">{stats.overduePayments}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">Total files in library</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Directory update requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUnits}</div>
            <p className="text-xs text-muted-foreground">Registered units</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/payments">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Manage Payments</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/announcements">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Bell className="h-6 w-6" />
                <span className="text-sm">Send Announcement</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/settings">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentActivity?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="mt-1">
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-[var(--semantic-success)]" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-[var(--semantic-primary)]" />}
                    {activity.type === 'document' && <FileText className="h-4 w-4 text-[var(--semantic-accent)]" />}
                    {activity.type === 'request' && <Bell className="h-4 w-4 text-[var(--semantic-primary)]" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No recent activity to display
            </p>
          )}
        </CardContent>
      </Card>

      {/* Alerts & Warnings */}
      {(stats.overduePayments > 0 || stats.pendingRequests > 0) && (
        <Card className="border-[var(--semantic-primary-light)] bg-[var(--semantic-primary-subtle)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--semantic-primary-dark)]">
              <AlertTriangle className="h-5 w-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.overduePayments > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">{stats.overduePayments} overdue payments need follow-up</span>
                <Link href="/dashboard/admin/payments?filter=overdue">
                  <Button size="sm" variant="outline">Review</Button>
                </Link>
              </div>
            )}
            {stats.pendingRequests > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">{stats.pendingRequests} directory update requests pending</span>
                <Link href="/dashboard/admin/directory-requests">
                  <Button size="sm" variant="outline">Review</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </DesktopAppWrapper>
  );
}
