

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, TrendingUp, Activity, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

export default function APIManagement() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [apiStats, setApiStats] = useState({
    totalCalls: 0,
    todayCalls: 0,
    weekCalls: 0,
    monthCalls: 0,
    errorRate: 0,
    avgResponseTime: 0
  });

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

    // Mock data - replace with real API call
    setApiStats({
      totalCalls: 1250000,
      todayCalls: 15234,
      weekCalls: 98567,
      monthCalls: 423891,
      errorRate: 0.8,
      avgResponseTime: 145
    });
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DesktopAppWrapper
      title="API Management"

// Back handled in toolbar
      // onBack={() => router.push('/dashboard/super-admin')}
    >
      <div className="space-y-4">
        {/* API Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Calls
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiStats.todayCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                This Week
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiStats.weekCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Error Rate
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiStats.errorRate}%</div>
              <p className="text-xs text-green-500">
                Below target of 1%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Response
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiStats.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>API Keys</span>
              <Button size="sm">
                <Key className="w-4 h-4 mr-2" />
                Generate New Key
              </Button>
            </CardTitle>
            <CardDescription>
              Manage platform API keys and access tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Production API Key</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    sk_prod_••••••••••••••••••••••••••••
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: Jan 15, 2025 · Last used: 2 minutes ago
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Development API Key</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    sk_dev_••••••••••••••••••••••••••••
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: Jan 10, 2025 · Last used: 5 hours ago
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Limiting Configuration</CardTitle>
            <CardDescription>
              Configure request limits to prevent abuse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Per Minute</div>
                  <div className="text-2xl font-bold mt-1">60</div>
                  <div className="text-xs text-muted-foreground mt-1">requests/min</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Per Hour</div>
                  <div className="text-2xl font-bold mt-1">1,000</div>
                  <div className="text-xs text-muted-foreground mt-1">requests/hour</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Per Day</div>
                  <div className="text-2xl font-bold mt-1">10,000</div>
                  <div className="text-xs text-muted-foreground mt-1">requests/day</div>
                </div>
              </div>
              <Button variant="outline">Update Limits</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopAppWrapper>
  );
}
