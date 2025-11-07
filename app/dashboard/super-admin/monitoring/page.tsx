

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Database, Cpu, HardDrive, Zap, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

export default function SystemMonitoring() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '15 days, 7 hours',
    cpu: 34,
    memory: 62,
    disk: 45,
    database: 'healthy',
    api: 'healthy'
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
      title="System Monitoring"

// Back handled in toolbar
      // onBack={() => router.push('/dashboard/super-admin')}
      toolbar={
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="w-4 h-4 mr-1" />
          All Systems Operational
        </Badge>
      }
    >
      <div className="space-y-4">
        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                CPU Usage
              </CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.cpu}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${systemHealth.cpu}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Normal operation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Memory Usage
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.memory}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${systemHealth.memory}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                8.2 GB / 16 GB
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Disk Usage
              </CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.disk}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${systemHealth.disk}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                225 GB / 500 GB
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Uptime
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{systemHealth.uptime}</div>
              <p className="text-xs text-green-500 mt-2">
                99.98% availability
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>
              Current status of all platform services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'API Server', status: 'operational', icon: Server },
                { name: 'Database', status: 'operational', icon: Database },
                { name: 'Authentication', status: 'operational', icon: Zap },
                { name: 'File Storage', status: 'operational', icon: HardDrive },
                { name: 'Email Service', status: 'operational', icon: Activity }
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <service.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Last checked: 30 seconds ago
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopAppWrapper>
  );
}
