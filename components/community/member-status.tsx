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
    className: 'member-status-online bg-[var(--semantic-success)]',
    label: 'Online',
    pulseClass: 'status-online-pulse',
  },
  AWAY: {
    className: 'member-status-away bg-[var(--semantic-warning)]',
    label: 'Away',
    pulseClass: '',
  },
  BUSY: {
    className: 'member-status-busy bg-[var(--semantic-error)]',
    label: 'Busy',
    pulseClass: '',
  },
  OFFLINE: {
    className: 'member-status-offline bg-[var(--semantic-border-strong)]',
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
