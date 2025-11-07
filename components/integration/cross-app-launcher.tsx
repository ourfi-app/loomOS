
/**
 * Cross-app launcher - Quick actions that span multiple apps
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  CreditCard,
  Calendar,
  CheckSquare,
  MessageSquare,
  FileText,
  Users,
  Bell,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  apps: string[];
  action: () => void;
  badge?: string;
}

export function CrossAppLauncher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'pay-dues',
      title: 'Pay Monthly Dues',
      description: 'View and pay your association dues',
      icon: <CreditCard className="h-5 w-5" />,
      apps: ['Payments'],
      action: () => {
        router.push('/dashboard/payments');
        setOpen(false);
      },
    },
    {
      id: 'schedule-event',
      title: 'Schedule Event',
      description: 'Create a new calendar event',
      icon: <Calendar className="h-5 w-5" />,
      apps: ['Calendar'],
      action: () => {
        router.push('/dashboard/apps/calendar');
        setOpen(false);
      },
    },
    {
      id: 'create-task',
      title: 'Create Task',
      description: 'Add a new task to your list',
      icon: <CheckSquare className="h-5 w-5" />,
      apps: ['Tasks'],
      action: () => {
        router.push('/dashboard/apps/tasks');
        setOpen(false);
      },
    },
    {
      id: 'send-message',
      title: 'Send Message',
      description: 'Compose a message to residents',
      icon: <MessageSquare className="h-5 w-5" />,
      apps: ['Messages'],
      action: () => {
        router.push('/dashboard/messages');
        setOpen(false);
      },
      badge: 'Admin',
    },
    {
      id: 'upload-document',
      title: 'Upload Document',
      description: 'Add files to the document library',
      icon: <FileText className="h-5 w-5" />,
      apps: ['Documents'],
      action: () => {
        router.push('/dashboard/documents');
        setOpen(false);
      },
    },
    {
      id: 'contact-neighbor',
      title: 'Contact Neighbor',
      description: 'Look up and contact residents',
      icon: <Users className="h-5 w-5" />,
      apps: ['Directory', 'Messages'],
      action: () => {
        router.push('/dashboard/directory');
        setOpen(false);
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Zap className="h-4 w-4" />
          Quick Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quick Actions</DialogTitle>
          <DialogDescription>
            Jump to common tasks across multiple apps
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto justify-start p-4 hover:bg-accent"
              onClick={action.action}
            >
              <div className="flex items-start w-full gap-4">
                <div className="mt-1">{action.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{action.title}</p>
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {action.description}
                  </p>
                  <div className="flex gap-1">
                    {action.apps.map((app) => (
                      <Badge key={app} variant="outline" className="text-xs">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

