

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Activity, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

interface ActivityLog {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category: string;
  description: string;
  user: string | null;
  organization: string | null;
  timestamp: string;
  metadata: any;
}

export default function ActivityLogs() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

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

    fetchActivity();
  }, [session, status, router]);

  useEffect(() => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.organization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category === categoryFilter);
    }

    setFilteredActivities(filtered);
  }, [searchTerm, typeFilter, categoryFilter, activities]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/activity');
      if (!response.ok) throw new Error('Failed to fetch activity');
      const data = await response.json();
      setActivities(data);
      setFilteredActivities(data);
    } catch (error) {
      console.error('Error fetching activity:', error);
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-[var(--semantic-success)]" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-[var(--semantic-error)]" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-[var(--semantic-warning)]" />;
      default:
        return <Info className="h-4 w-4 text-[var(--semantic-primary)]" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      info: 'outline'
    };
    return <Badge variant={variants[type] || 'outline'}>{type.toUpperCase()}</Badge>;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DesktopAppWrapper
      title="Activity Logs"

      toolbar={
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      }
// Back handled in toolbar
      // onBack={() => router.push('/dashboard/super-admin')}
    >
      <div className="space-y-4">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activity logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log ({filteredActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No activity found
                  </p>
                </div>
              ) : (
                filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                    <div className="mt-0.5">{getTypeIcon(activity.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.description}</p>
                        {getTypeBadge(activity.type)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Category: {activity.category}</span>
                        {activity.user && <span>User: {activity.user}</span>}
                        {activity.organization && <span>Org: {activity.organization}</span>}
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopAppWrapper>
  );
}
