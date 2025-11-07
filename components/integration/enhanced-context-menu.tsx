
/**
 * Enhanced Context Menu with Cross-App Actions
 * Provides contextual actions that span multiple apps
 */

'use client';

import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  CreditCard,
  FileText,
  MessageSquare,
  Calendar,
  CheckSquare,
  Bell,
  Users,
  ArrowRight,
  Copy,
  ExternalLink,
  Sparkles,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useNotificationService } from '@/hooks/use-app-integration';

interface EnhancedContextMenuProps {
  children: React.ReactNode;
  type: 'user' | 'payment' | 'document' | 'task' | 'event' | 'message' | 'note';
  data: any;
  onAction?: (action: string) => void;
}

export function EnhancedContextMenu({ children, type, data, onAction }: EnhancedContextMenuProps) {
  const router = useRouter();
  const notifications = useNotificationService();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
    onAction?.('copy');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onAction?.('navigate');
  };

  const getContextActions = () => {
    switch (type) {
      case 'user':
        return (
          <>
            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/directory?user=${data.id}`)}>
              <Users className="mr-2 h-4 w-4" />
              View Profile
            </ContextMenuItem>
            
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={() => handleNavigation(`/dashboard/messages/compose?to=${data.id}`)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </ContextMenuItem>
                {data.email && (
                  <ContextMenuItem onClick={() => copyToClipboard(data.email, 'Email')}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Email
                  </ContextMenuItem>
                )}
                {data.phone && (
                  <ContextMenuItem onClick={() => copyToClipboard(data.phone, 'Phone')}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Phone
                  </ContextMenuItem>
                )}
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <CheckSquare className="mr-2 h-4 w-4" />
                Create...
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/tasks/create?assignedTo=${data.id}`)}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Task for User
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/calendar/create?attendees=${data.id}`)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Event with User
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/admin/payments?user=${data.id}`)}>
              <CreditCard className="mr-2 h-4 w-4" />
              View Payments
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/household?user=${data.id}`)}>
              <Users className="mr-2 h-4 w-4" />
              View Household
            </ContextMenuItem>

            {data.unit && (
              <ContextMenuItem onClick={() => copyToClipboard(data.unit, 'Unit')}>
                <MapPin className="mr-2 h-4 w-4" />
                Copy Unit: {data.unit}
              </ContextMenuItem>
            )}
          </>
        );

      case 'payment':
        return (
          <>
            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/payments?id=${data.id}`)}>
              <CreditCard className="mr-2 h-4 w-4" />
              View Details
            </ContextMenuItem>

            {data.userId && (
              <ContextMenuItem onClick={() => handleNavigation(`/dashboard/directory?user=${data.userId}`)}>
                <Users className="mr-2 h-4 w-4" />
                View Resident
              </ContextMenuItem>
            )}

            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => copyToClipboard(`Payment #${data.id}`, 'Payment reference')}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Reference
            </ContextMenuItem>

            {data.status === 'PENDING' && data.userId && (
              <ContextMenuItem 
                onClick={() => {
                  notifications.notifyPaymentDue(data.userId, data.amount, new Date(data.dueDate));
                  toast.success('Payment reminder sent');
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Send Reminder
              </ContextMenuItem>
            )}

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/accounting?payment=${data.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              View in Accounting
            </ContextMenuItem>
          </>
        );

      case 'document':
        return (
          <>
            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/documents?doc=${data.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              View Document
            </ContextMenuItem>

            <ContextMenuItem onClick={() => window.open(data.url || data.cloud_storage_path, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => copyToClipboard(window.location.origin + `/dashboard/documents?doc=${data.id}`, 'Document link')}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </ContextMenuItem>

            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <ArrowRight className="mr-2 h-4 w-4" />
                Share via...
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={() => handleNavigation(`/dashboard/messages/compose?attachment=${data.id}`)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleNavigation(`/dashboard/chat?context=document:${data.id}`)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ask AI About This
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/notes/create?document=${data.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              Create Note
            </ContextMenuItem>
          </>
        );

      case 'task':
        return (
          <>
            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/tasks?id=${data.id}`)}>
              <CheckSquare className="mr-2 h-4 w-4" />
              View Task
            </ContextMenuItem>

            {data.assignedTo && (
              <ContextMenuItem onClick={() => handleNavigation(`/dashboard/directory?user=${data.assignedTo}`)}>
                <Users className="mr-2 h-4 w-4" />
                View Assignee
              </ContextMenuItem>
            )}

            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/calendar/create?task=${data.id}`)}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule on Calendar
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/notes/create?task=${data.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              Add Note
            </ContextMenuItem>

            {data.assignedTo && (
              <ContextMenuItem 
                onClick={() => {
                  notifications.notifyTaskAssigned(data.assignedTo, data.title);
                  toast.success('Task reminder sent');
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Send Reminder
              </ContextMenuItem>
            )}

            <ContextMenuItem onClick={() => copyToClipboard(data.title, 'Task title')}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Title
            </ContextMenuItem>
          </>
        );

      case 'event':
        return (
          <>
            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/calendar?event=${data.id}`)}>
              <Calendar className="mr-2 h-4 w-4" />
              View Event
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/tasks/create?event=${data.id}`)}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Create Related Task
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/notes/create?event=${data.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              Take Notes
            </ContextMenuItem>

            {data.attendees && data.attendees.length > 0 && (
              <ContextMenuItem 
                onClick={() => {
                  notifications.notifyEventCreated(data.title, new Date(data.startDate), data.attendees);
                  toast.success('Event invitations sent');
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Send Invitations
              </ContextMenuItem>
            )}

            <ContextMenuItem onClick={() => copyToClipboard(data.title, 'Event title')}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Title
            </ContextMenuItem>
          </>
        );

      case 'message':
        return (
          <>
            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/messages?id=${data.id}`)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              View Message
            </ContextMenuItem>

            {data.sender && (
              <ContextMenuItem onClick={() => handleNavigation(`/dashboard/directory?user=${data.sender.id}`)}>
                <Users className="mr-2 h-4 w-4" />
                View Sender Profile
              </ContextMenuItem>
            )}

            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/messages/compose?replyTo=${data.id}`)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Reply
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/tasks/create?message=${data.id}`)}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Create Task from Message
            </ContextMenuItem>

            <ContextMenuItem onClick={() => copyToClipboard(data.subject, 'Subject')}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Subject
            </ContextMenuItem>
          </>
        );

      case 'note':
        return (
          <>
            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/notes?id=${data.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              View Note
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/apps/tasks/create?note=${data.id}`)}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Convert to Task
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/messages/compose?note=${data.id}`)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Share as Message
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNavigation(`/dashboard/chat?context=note:${data.id}`)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Ask AI About This
            </ContextMenuItem>

            <ContextMenuItem onClick={() => copyToClipboard(data.content, 'Note content')}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Content
            </ContextMenuItem>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {getContextActions()}
      </ContextMenuContent>
    </ContextMenu>
  );
}
