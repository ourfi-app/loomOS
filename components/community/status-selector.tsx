'use client';

import { useState } from 'react';
import { MemberStatus } from '@prisma/client';
import { MemberStatus as MemberStatusComponent } from './member-status';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface StatusSelectorProps {
  currentStatus?: MemberStatus | null;
  onStatusChange?: (status: MemberStatus) => void;
}

const statusOptions = [
  { value: MemberStatus.ONLINE, label: 'Online', color: 'bg-green-500' },
  { value: MemberStatus.AWAY, label: 'Away', color: 'bg-yellow-500' },
  { value: MemberStatus.BUSY, label: 'Busy', color: 'bg-red-500' },
  { value: MemberStatus.OFFLINE, label: 'Offline', color: 'bg-gray-400' },
];

export function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
  const [status, setStatus] = useState<MemberStatus>(currentStatus || MemberStatus.OFFLINE);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: MemberStatus) => {
    try {
      setIsUpdating(true);
      setStatus(newStatus);

      const response = await fetch('/api/users/me/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        onStatusChange?.(newStatus);
        toast({
          title: 'Status updated',
          description: `Your status is now ${newStatus.toLowerCase()}`,
        });
      } else {
        // Revert on error
        setStatus(currentStatus || MemberStatus.OFFLINE);
        toast({
          title: 'Error',
          description: 'Failed to update status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert on error
      setStatus(currentStatus || MemberStatus.OFFLINE);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <MemberStatusComponent status={status} size="md" />
      <Select
        value={status}
        onValueChange={(value) => handleStatusChange(value as MemberStatus)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
