
/**
 * Context menu for cross-app actions
 */

'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Eye,
  Mail,
  CreditCard,
  FileText,
  UserCircle,
  Calendar,
  CheckSquare,
  ExternalLink,
  Copy,
  Bell,
} from 'lucide-react';
import { useQuickActions } from '@/hooks/use-app-integration';
import { useToast } from '@/hooks/use-toast';

interface ContextMenuProps {
  type: 'user' | 'payment' | 'document' | 'task' | 'event' | 'note';
  itemId: string;
  itemData?: any;
  className?: string;
}

export function ContextMenu({ type, itemId, itemData, className }: ContextMenuProps) {
  const actions = useQuickActions();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleAction = async (action: () => void | Promise<void>, successMessage: string) => {
    try {
      await action();
      toast({
        title: 'Success',
        description: successMessage,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform action',
        variant: 'destructive',
      });
    }
  };

  const renderMenuItems = () => {
    switch (type) {
      case 'user':
        return (
          <>
            <DropdownMenuItem onClick={() => actions.viewUserProfile(itemId)}>
              <UserCircle className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.sendMessageToUser(itemId)}>
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.viewUserPayments(itemId)}>
              <CreditCard className="mr-2 h-4 w-4" />
              View Payments
            </DropdownMenuItem>
          </>
        );

      case 'payment':
        return (
          <>
            <DropdownMenuItem onClick={() => actions.viewPayment(itemId)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {itemData?.status === 'PENDING' && (
              <DropdownMenuItem
                onClick={() =>
                  handleAction(
                    () => actions.sendPaymentReminder(itemData.userId, itemData.amount, new Date(itemData.dueDate)),
                    'Reminder sent'
                  )
                }
              >
                <Bell className="mr-2 h-4 w-4" />
                Send Reminder
              </DropdownMenuItem>
            )}
          </>
        );

      case 'document':
        return (
          <>
            <DropdownMenuItem onClick={() => actions.viewDocument(itemId)}>
              <Eye className="mr-2 h-4 w-4" />
              View Document
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleAction(() => actions.shareDocument(itemId), 'Link copied to clipboard')
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
          </>
        );

      case 'task':
        return (
          <>
            <DropdownMenuItem onClick={() => actions.viewTask(itemId)}>
              <Eye className="mr-2 h-4 w-4" />
              View Task
            </DropdownMenuItem>
            {itemData?.dueDate && (
              <DropdownMenuItem
                onClick={() => actions.createEventFromTask(itemData.title, new Date(itemData.dueDate))}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </DropdownMenuItem>
            )}
          </>
        );

      case 'event':
        return (
          <>
            <DropdownMenuItem onClick={() => actions.viewEvent(itemId)}>
              <Eye className="mr-2 h-4 w-4" />
              View Event
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleAction(
                  () =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/dashboard/apps/calendar?event=${itemId}`
                    ),
                  'Link copied to clipboard'
                )
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
          </>
        );

      case 'note':
        return (
          <>
            <DropdownMenuItem
              onClick={() => actions.createTaskFromNote(itemData?.title || '', itemData?.content || '')}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Create Task
            </DropdownMenuItem>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={className} size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {renderMenuItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

