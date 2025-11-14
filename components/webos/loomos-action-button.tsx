'use client';

import React, { ReactNode } from 'react';

interface LoomOSActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function LoomOSActionButton({
  children,
  onClick,
  icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = ''
}: LoomOSActionButtonProps) {
  const baseClasses = 'rounded-lg font-semibold transition-all shadow-sm flex items-center justify-center gap-2';
  
  const variantClasses = {
    default: 'bg-gradient-to-b from-gray-200 to-gray-300 border border-[var(--semantic-border-strong)] text-[var(--semantic-text-secondary)] hover:from-gray-300 hover:to-gray-400 active:from-gray-400 active:to-gray-500',
    primary: 'bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-600 text-white hover:from-orange-500 hover:to-orange-600 active:from-orange-600 active:to-orange-700',
    danger: 'bg-gradient-to-b from-red-400 to-red-500 border border-red-600 text-white hover:from-red-500 hover:to-red-600 active:from-red-600 active:to-red-700'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? disabledClasses : ''} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
