
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface LoomOSNavListItemProps {
  label: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function LoomOSNavListItem({
  label,
  count,
  selected,
  onClick,
  className,
  icon
}: LoomOSNavListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
        selected
          ? 'bg-orange-50 text-orange-700 font-medium dark:bg-orange-900/20 dark:text-orange-400'
          : 'text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-hover)] dark:text-gray-300 dark:hover:bg-gray-800',
        className
      )}
    >
      <span className="flex items-center gap-2 truncate">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="truncate">{label}</span>
      </span>
      {count !== undefined && (
        <Badge variant={selected ? 'default' : 'secondary'} className="ml-2 text-xs">
          {count}
        </Badge>
      )}
    </button>
  );
}
