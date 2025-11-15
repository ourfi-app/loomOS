
/**
 * Unified Dashboard Widget - Shows integrated data from all apps
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  CreditCard,
  CheckSquare,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardData {
  notifications: any[];
  upcomingPayments: any[];
  tasks: any[];
  events: any[];
  recentMessages: any[];
  recentDocuments: any[];
}

export function UnifiedDashboardWidget() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [data, setData] = useState<DashboardData>({
    notifications: [],
    upcomingPayments: [],
    tasks: [],
    events: [],
    recentMessages: [],
    recentDocuments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch data from multiple endpoints in parallel
      const [
        notificationsRes,
        paymentsRes,
        tasksRes,
        eventsRes,
        messagesRes,
        documentsRes,
      ] = await Promise.allSettled([
        fetch('/api/notifications'),
        fetch('/api/payments'),
        fetch('/api/tasks?status=TODO&status=IN_PROGRESS'),
        fetch('/api/calendar'),
        fetch('/api/messages?folder=inbox'),
        fetch('/api/documents'),
      ]);

      const dashboardData: DashboardData = {
        notifications: [],
        upcomingPayments: [],
        tasks: [],
        events: [],
        recentMessages: [],
        recentDocuments: [],
      };

      // Process notifications
      if (notificationsRes.status === 'fulfilled' && notificationsRes.value.ok) {
        const notifData = await notificationsRes.value.json();
        dashboardData.notifications = (notifData.notifications || []).slice(0, 5);
      }

      // Process payments
      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.ok) {
        const paymentData = await paymentsRes.value.json();
        const payments = paymentData.payments || [];
        dashboardData.upcomingPayments = payments
          .filter((p: any) => p.status === 'PENDING' || p.status === 'OVERDUE')
          .slice(0, 3);
      }

      // Process tasks
      if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
        const taskData = await tasksRes.value.json();
        dashboardData.tasks = (taskData || []).slice(0, 5);
      }

      // Process events
      if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
        const eventData = await eventsRes.value.json();
        const now = new Date();
        const upcomingEvents = (eventData || []).filter((e: any) => {
          const eventDate = new Date(e.startDate);
          return eventDate >= now;
        });
        dashboardData.events = upcomingEvents.slice(0, 5);
      }

      // Process messages
      if (messagesRes.status === 'fulfilled' && messagesRes.value.ok) {
        const messageData = await messagesRes.value.json();
        dashboardData.recentMessages = (messageData.messages || []).slice(0, 5);
      }

      // Process documents
      if (documentsRes.status === 'fulfilled' && documentsRes.value.ok) {
        const docData = await documentsRes.value.json();
        dashboardData.recentDocuments = (docData.files || []).slice(0, 5);
      }

      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OVERDUE':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      case 'PAID':
        return 'success';
      case 'URGENT':
        return 'destructive';
      case 'COMPLETED':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return 'bg-[var(--semantic-error)]';
      case 'HIGH':
        return 'bg-[var(--semantic-primary)]';
      case 'MEDIUM':
        return 'bg-[var(--semantic-warning)]';
      case 'LOW':
        return 'bg-[var(--semantic-success)]';
      default:
        return 'bg-[var(--semantic-text-tertiary)]';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Dashboard...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/notifications')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.notifications.filter((n) => !n.isRead).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.notifications.length} total notifications
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/payments')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.upcomingPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              ${data.upcomingPayments.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)} total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/apps/tasks')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {data.tasks.filter((t) => t.status === 'IN_PROGRESS').length} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/apps/calendar')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.events.length}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>View integrated data from all your apps</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-3">
              {data.notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
              ) : (
                data.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent',
                      !notif.isRead && 'bg-primary/5'
                    )}
                    onClick={() => router.push('/dashboard/notifications')}
                  >
                    <div className={cn('mt-0.5', notif.notification.isUrgent && 'text-destructive')}>
                      {notif.notification.isUrgent ? <AlertCircle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notif.notification.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notif.notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                ))
              )}
              <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard/notifications')}>
                View All Notifications <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-3">
              {data.upcomingPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No pending payments</p>
              ) : (
                data.upcomingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => router.push('/dashboard/payments')}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">${Number(payment.amount).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Due {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </div>
                ))
              )}
              <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard/payments')}>
                View All Payments <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-3">
              {data.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No active tasks</p>
              ) : (
                data.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => router.push('/dashboard/apps/tasks')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn('h-2 w-2 rounded-full', getPriorityColor(task.priority))} />
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.dueDate ? `Due ${format(new Date(task.dueDate), 'MMM d')}` : 'No due date'}
                        </p>
                      </div>
                    </div>
                    <Badge>{task.status}</Badge>
                  </div>
                ))
              )}
              <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard/apps/tasks')}>
                View All Tasks <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-3">
              {data.events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No upcoming events</p>
              ) : (
                data.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => router.push('/dashboard/apps/calendar')}
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.startDate), 'MMM d, yyyy')} at {event.startTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard/apps/calendar')}>
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-3">
              {data.recentMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent messages</p>
              ) : (
                data.recentMessages.map((message) => {
                  const recipient = message.recipients?.[0];
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent',
                        recipient && !recipient.isRead && 'bg-primary/5'
                      )}
                      onClick={() => router.push('/dashboard/messages')}
                    >
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{message.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          From {message.sender?.name || message.sender?.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      {recipient && !recipient.isRead && (
                        <div className="mt-2 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })
              )}
              <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard/messages')}>
                View All Messages <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

