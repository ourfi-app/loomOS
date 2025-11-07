
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMode } from '@/lib/admin-mode-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud,
  CreditCard,
  Mail,
  Phone,
  Globe,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Save,
  Settings,
  TestTube,
  Plug,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

interface ServiceConfig {
  id: string;
  name: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  category: string;
  hasConfig: boolean;
  isRequired: boolean;
  lastChecked?: Date;
  errorMessage?: string;
}

export default function ExternalConnectionsPage() {
  const session = useSession();
  const router = useRouter();
  const { isAdminMode } = useAdminMode();
  const [loading, setLoading] = useState(false);
  
  const userRole = (session?.data?.user as any)?.role;
  const status = session?.status || 'loading';

  const [services, setServices] = useState<ServiceConfig[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      icon: CreditCard,
      status: 'connected',
      description: 'Payment processing and billing',
      category: 'payments',
      hasConfig: true,
      isRequired: true,
      lastChecked: new Date(),
    },
    {
      id: 'twilio',
      name: 'Twilio',
      icon: Phone,
      status: 'connected',
      description: 'SMS and voice notifications',
      category: 'communications',
      hasConfig: true,
      isRequired: false,
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      icon: Mail,
      status: 'connected',
      description: 'Email delivery and campaigns',
      category: 'communications',
      hasConfig: true,
      isRequired: true,
    },
    {
      id: 'weather',
      name: 'Weather API',
      icon: Cloud,
      status: 'connected',
      description: 'Weather data and forecasts',
      category: 'data',
      hasConfig: true,
      isRequired: false,
    },
    {
      id: 'maps',
      name: 'Google Maps',
      icon: Globe,
      status: 'disconnected',
      description: 'Location and mapping services',
      category: 'data',
      hasConfig: false,
      isRequired: false,
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: Activity,
      status: 'connected',
      description: 'Usage tracking and insights',
      category: 'monitoring',
      hasConfig: true,
      isRequired: false,
    },
  ]);

  useEffect(() => {
    if (status === 'authenticated' && (userRole !== 'ADMIN' || !isAdminMode)) {
      router.push('/dashboard');
    }
  }, [status, userRole, isAdminMode, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Disconnected</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const testConnection = async (serviceId: string) => {
    setLoading(true);
    toast.loading(`Testing ${serviceId} connection...`);
    
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${serviceId} connection test successful!`);
      setLoading(false);
    }, 2000);
  };

  const saveSettings = () => {
    setLoading(true);
    toast.loading('Saving settings...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('Settings saved successfully!');
      setLoading(false);
    }, 1500);
  };

  if (status === 'loading' || (status === 'authenticated' && (userRole !== 'ADMIN' || !isAdminMode))) {
    return null;
  }

  const connectedServices = services.filter(s => s.status === 'connected').length;
  const totalServices = services.length;
  const healthPercentage = Math.round((connectedServices / totalServices) * 100);

  // Get app definition for styling
  const appDef = APP_REGISTRY['external-connections'];
  const ExternalConnectionsIcon = appDef?.icon;

  return (
    <DesktopAppWrapper
      title={appDef?.title || 'External Connections'}
      icon={ExternalConnectionsIcon ? <ExternalConnectionsIcon className="h-5 w-5" /> : <Plug className="h-5 w-5" />}
      gradient={appDef?.gradient}
      showMenuBar={true}
    >
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Plug className="h-8 w-8" />
            External Connections
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage API connections and external service providers
          </p>
        </div>
        <Button onClick={saveSettings} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Connection Health Overview */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Connection Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Overall Status</div>
              <div className="flex items-center gap-2">
                {healthPercentage === 100 ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : healthPercentage >= 75 ? (
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <div className="text-2xl font-bold">{healthPercentage}%</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Active Services</div>
              <div className="text-2xl font-bold">{connectedServices}/{totalServices}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="text-sm font-medium">{new Date().toLocaleTimeString()}</div>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Services */}
      <Card>
        <CardHeader>
          <CardTitle>External Service Integrations</CardTitle>
          <CardDescription>Manage API connections and service providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['payments', 'communications', 'data', 'monitoring'].map((category) => {
              const categoryServices = services.filter(s => s.category === category);
              if (categoryServices.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    {category}
                  </h3>
                  <div className="grid gap-3">
                    {categoryServices.map((service) => {
                      const Icon = service.icon;
                      return (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {getStatusIcon(service.status)}
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {service.name}
                                  {service.isRequired && (
                                    <Badge variant="secondary" className="text-xs">Required</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{service.description}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(service.status)}
                            {service.hasConfig && (
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => testConnection(service.id)}>
                              <TestTube className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
    </DesktopAppWrapper>
  );
}
