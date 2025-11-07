
'use client';

import { cn } from '@/lib/utils';

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn('webos-segmented-control', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'webos-segmented-control-item',
            value === option.value && 'active'
          )}
          aria-pressed={value === option.value}
        >
          {option.icon && <span className="flex items-center gap-2">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}
