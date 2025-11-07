
'use client';

import { cn } from '@/lib/utils';
import { type IconType } from 'react-icons';

interface MaterialAppIconProps {
  icon: IconType;
  gradient: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconClassName?: string;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
  xl: 'w-16 h-16',
};

const iconSizeMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
  xl: 'w-8 h-8',
};

export function MaterialAppIcon({ 
  icon: Icon, 
  gradient, 
  size = 'md', 
  className,
  iconClassName 
}: MaterialAppIconProps) {
  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden flex items-center justify-center",
        "bg-gradient-to-br shadow-lg",
        gradient,
        sizeMap[size],
        className
      )}
    >
      {/* Dark background layer - WebOS style */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60" />
      
      {/* Subtle color accent */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-30",
        gradient
      )} />
      
      {/* Icon with two-tone effect */}
      <div className="relative z-10">
        <Icon className={cn(
          "text-white drop-shadow-lg",
          iconSizeMap[size],
          iconClassName
        )} />
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
