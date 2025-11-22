// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

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
      <div 
        className="flex items-center justify-center h-full"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: "'Helvetica Neue', Arial, sans-serif"
        }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: 'var(--webos-app-blue)' }}
          ></div>
          <p className="font-light" style={{ color: 'var(--webos-text-secondary)' }}>
            Loading admin dashboard...
          </p>
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
      <div 
        className="h-full overflow-y-auto"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: "'Helvetica Neue', Arial, sans-serif"
        }}
      >
        <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-light tracking-tight flex items-center gap-2"
            style={{ color: 'var(--webos-text-primary)' }}
          >
            <Shield className="h-8 w-8" style={{ color: 'var(--webos-app-blue)' }} />
            Admin Dashboard
          </h1>
          <p className="font-light mt-1" style={{ color: 'var(--webos-text-secondary)' }}>
            Comprehensive overview of your condo association
          </p>
        </div>
        <Badge 
          variant="secondary" 
          className="text-lg px-4 py-2 font-light"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            color: 'var(--webos-text-primary)'
          }}
        >
          <Activity className="h-4 w-4 mr-2" />
          Live
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="rounded-3xl"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-md)'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>Total Residents</CardTitle>
            <Users className="h-4 w-4" style={{ color: 'var(--webos-text-tertiary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light" style={{ color: 'var(--webos-text-primary)' }}>{stats.totalUsers}</div>
            <p className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>
              <span className="font-light" style={{ color: 'var(--webos-app-green)' }}>{stats.activeUsers} active</span>
            </p>
          </CardContent>
        </Card>

        <Card 
          className="rounded-3xl"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-md)'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4" style={{ color: 'var(--webos-text-tertiary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light" style={{ color: 'var(--webos-text-primary)' }}>${stats.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs font-light">
              {stats.collectionRate >= 80 ? (
                <>
                  <TrendingUp className="h-3 w-3" style={{ color: 'var(--webos-app-green)' }} />
                  <span style={{ color: 'var(--webos-app-green)' }}>{stats.collectionRate.toFixed(0)}% collected</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3" style={{ color: 'var(--webos-app-blue)' }} />
                  <span style={{ color: 'var(--webos-app-blue)' }}>{stats.collectionRate.toFixed(0)}% collected</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className="rounded-3xl"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-md)'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>Pending Payments</CardTitle>
            <Clock className="h-4 w-4" style={{ color: 'var(--webos-text-tertiary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light" style={{ color: 'var(--webos-text-primary)' }}>{stats.pendingPayments}</div>
            <p className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>
              {stats.paidPayments} paid this month
            </p>
          </CardContent>
        </Card>

        <Card 
          className="rounded-3xl"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-md)'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4" style={{ color: '#dc2626' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light" style={{ color: '#dc2626' }}>{stats.overduePayments}</div>
            <p className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="rounded-3xl"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-md)'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>Documents</CardTitle>
            <FileText className="h-4 w-4" style={{ color: 'var(--webos-text-tertiary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light" style={{ color: 'var(--webos-text-primary)' }}>{stats.totalDocuments}</div>
            <p className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Total files in library</p>
          </CardContent>
        </Card>

        <Card 
          className="rounded-3xl"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-md)'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>Pending Requests</CardTitle>
            <Bell className="h-4 w-4" style={{ color: 'var(--webos-text-tertiary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light" style={{ color: 'var(--webos-text-primary)' }}>{stats.pendingRequests}</div>
            <p className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Directory update requests</p>
          </CardContent>
        </Card>

        <Card 
          className="rounded-3xl"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-md)'
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>Units</CardTitle>
            <Building className="h-4 w-4" style={{ color: 'var(--webos-text-tertiary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light" style={{ color: 'var(--webos-text-primary)' }}>{stats.totalUnits}</div>
            <p className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Registered units</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card 
        className="rounded-3xl"
        style={{
          background: 'var(--webos-bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--webos-border-glass)',
          boxShadow: 'var(--webos-shadow-md)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="text-xs font-light tracking-wider uppercase"
            style={{ color: 'var(--webos-text-tertiary)' }}
          >
            QUICK ACTIONS
          </CardTitle>
          <CardDescription className="font-light" style={{ color: 'var(--webos-text-secondary)' }}>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/admin/users">
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col gap-2 rounded-xl font-light tracking-wide transition-all hover:opacity-90"
                style={{
                  background: 'var(--webos-ui-dark)',
                  color: 'var(--webos-text-white)',
                  border: 'none',
                  boxShadow: 'var(--webos-shadow-sm)'
                }}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">MANAGE USERS</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/payments">
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col gap-2 rounded-xl font-light tracking-wide transition-all hover:opacity-90"
                style={{
                  background: 'var(--webos-ui-dark)',
                  color: 'var(--webos-text-white)',
                  border: 'none',
                  boxShadow: 'var(--webos-shadow-sm)'
                }}
              >
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">MANAGE PAYMENTS</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/announcements">
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col gap-2 rounded-xl font-light tracking-wide transition-all hover:opacity-90"
                style={{
                  background: 'var(--webos-ui-dark)',
                  color: 'var(--webos-text-white)',
                  border: 'none',
                  boxShadow: 'var(--webos-shadow-sm)'
                }}
              >
                <Bell className="h-6 w-6" />
                <span className="text-sm">SEND ANNOUNCEMENT</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/settings">
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col gap-2 rounded-xl font-light tracking-wide transition-all hover:opacity-90"
                style={{
                  background: 'var(--webos-ui-dark)',
                  color: 'var(--webos-text-white)',
                  border: 'none',
                  boxShadow: 'var(--webos-shadow-sm)'
                }}
              >
                <Shield className="h-6 w-6" />
                <span className="text-sm">SETTINGS</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card 
        className="rounded-3xl"
        style={{
          background: 'var(--webos-bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--webos-border-glass)',
          boxShadow: 'var(--webos-shadow-md)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="flex items-center gap-2 text-xs font-light tracking-wider uppercase"
            style={{ color: 'var(--webos-text-tertiary)' }}
          >
            <Activity className="h-5 w-5" />
            RECENT ACTIVITY
          </CardTitle>
          <CardDescription className="font-light" style={{ color: 'var(--webos-text-secondary)' }}>
            Latest actions in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentActivity?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity: any, index: number) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 pb-3 last:border-0"
                  style={{ borderBottom: index < stats.recentActivity.length - 1 ? '1px solid var(--webos-border-primary)' : 'none' }}
                >
                  <div className="mt-1">
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4" style={{ color: 'var(--webos-app-green)' }} />}
                    {activity.type === 'user' && <Users className="h-4 w-4" style={{ color: 'var(--webos-app-blue)' }} />}
                    {activity.type === 'document' && <FileText className="h-4 w-4" style={{ color: 'var(--webos-app-brown)' }} />}
                    {activity.type === 'request' && <Bell className="h-4 w-4" style={{ color: 'var(--webos-app-blue)' }} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-light" style={{ color: 'var(--webos-text-primary)' }}>{activity.description}</p>
                    <p className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center font-light py-8" style={{ color: 'var(--webos-text-secondary)' }}>
              No recent activity to display
            </p>
          )}
        </CardContent>
      </Card>

      {/* Alerts & Warnings */}
      {(stats.overduePayments > 0 || stats.pendingRequests > 0) && (
        <Card 
          className="rounded-3xl"
          style={{
            background: 'rgba(254, 243, 199, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(251, 191, 36, 0.5)',
            boxShadow: 'var(--webos-shadow-md)'
          }}
        >
          <CardHeader>
            <CardTitle 
              className="flex items-center gap-2 text-xs font-light tracking-wider uppercase"
              style={{ color: '#92400e' }}
            >
              <AlertTriangle className="h-5 w-5" />
              ATTENTION REQUIRED
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.overduePayments > 0 && (
              <div 
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: 'var(--webos-bg-white)',
                  border: '1px solid var(--webos-border-primary)'
                }}
              >
                <span className="text-sm font-light" style={{ color: 'var(--webos-text-primary)' }}>
                  {stats.overduePayments} overdue payments need follow-up
                </span>
                <Link href="/dashboard/admin/payments?filter=overdue">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="rounded-xl font-light tracking-wide transition-all hover:opacity-90"
                    style={{
                      background: 'var(--webos-ui-dark)',
                      color: 'var(--webos-text-white)',
                      border: 'none'
                    }}
                  >
                    REVIEW
                  </Button>
                </Link>
              </div>
            )}
            {stats.pendingRequests > 0 && (
              <div 
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: 'var(--webos-bg-white)',
                  border: '1px solid var(--webos-border-primary)'
                }}
              >
                <span className="text-sm font-light" style={{ color: 'var(--webos-text-primary)' }}>
                  {stats.pendingRequests} directory update requests pending
                </span>
                <Link href="/dashboard/admin/directory-requests">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="rounded-xl font-light tracking-wide transition-all hover:opacity-90"
                    style={{
                      background: 'var(--webos-ui-dark)',
                      color: 'var(--webos-text-white)',
                      border: 'none'
                    }}
                  >
                    REVIEW
                  </Button>
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
