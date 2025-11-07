

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

export default function SecurityManagement() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'SUPER_ADMIN') {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const securityEvents = [
    {
      id: '1',
      type: 'warning',
      title: 'Multiple failed login attempts',
      description: 'User john@example.com - 5 attempts from IP 192.168.1.1',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'info',
      title: 'New admin created',
      description: 'Super admin created new admin user for Organization A',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'success',
      title: 'Security scan completed',
      description: 'No vulnerabilities detected',
      timestamp: '1 day ago'
    }
  ];

  return (
    <DesktopAppWrapper
      title="Security Management"

// Back handled in toolbar
      // onBack={() => router.push('/dashboard/super-admin')}
      toolbar={
        <Badge variant="default" className="bg-green-500">
          <Shield className="w-4 h-4 mr-1" />
          Secure
        </Badge>
      }
    >
      <div className="space-y-4">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Sessions
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                Across all organizations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Logins (24h)
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                -15% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Score
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98/100</div>
              <p className="text-xs text-green-500">
                Excellent security posture
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>
              Latest security-related activities and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className="mt-0.5">
                    {event.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {event.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {event.type === 'info' && <Eye className="h-4 w-4 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{event.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure platform-wide security policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground">
                    Require 2FA for all admin users
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Session Timeout</div>
                  <div className="text-xs text-muted-foreground">
                    Auto-logout after 24 hours of inactivity
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Password Policy</div>
                  <div className="text-xs text-muted-foreground">
                    Minimum 8 characters, 1 uppercase, 1 number
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">IP Whitelisting</div>
                  <div className="text-xs text-muted-foreground">
                    Restrict admin access to specific IPs
                  </div>
                </div>
                <Badge variant="secondary">Disabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopAppWrapper>
  );
}
