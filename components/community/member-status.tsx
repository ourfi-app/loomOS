import { MemberStatus as MemberStatusType } from '@prisma/client';
import { cn } from '@/lib/utils';

interface MemberStatusProps {
  status: MemberStatusType | null | undefined;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

const statusConfig = {
  ONLINE: {
    className: 'member-status-online bg-green-500',
    label: 'Online',
    pulseClass: 'status-online-pulse',
  },
  AWAY: {
    className: 'member-status-away bg-yellow-500',
    label: 'Away',
    pulseClass: '',
  },
  BUSY: {
    className: 'member-status-busy bg-red-500',
    label: 'Busy',
    pulseClass: '',
  },
  OFFLINE: {
    className: 'member-status-offline bg-gray-400',
    label: 'Offline',
    pulseClass: '',
  },
};

export function MemberStatus({
  status,
  showLabel = false,
  className,
  size = 'md'
}: MemberStatusProps) {
  if (!status) {
    status = 'OFFLINE';
  }

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'member-status rounded-full',
          sizeClasses[size],
          config.className,
          config.pulseClass
        )}
        title={config.label}
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {config.label}
        </span>
      )}
    </div>
  );
}
