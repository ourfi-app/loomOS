'use client';

import React, { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Window Component - Phase 1: Foundation
 * 
 * App window container with title bar following the new design system:
 * - Dark chrome (#1a1a1a) for title bar
 * - White content area with rounded corners
 * - Window controls (close, minimize)
 * - Glassmorphism support
 * 
 * @example
 * ```tsx
 * <Window
 *   title="Mail"
 * >
 *   <p>Window content goes here</p>
 * </Window>
 * ```
 */

export interface WindowProps {
  /** Window title */
  title: string;
  
  /** Window content */
  children: ReactNode;
  
  /** Close handler */
  onClose?: () => void;
  
  /** Minimize handler */
  onMinimize?: () => void;
  
  /** Maximize handler */
  onMaximize?: () => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Container style */
  style?: CSSProperties;
  
  /** Whether the window is maximized */
  maximized?: boolean;
  
  /** Window icon */
  icon?: ReactNode;
}

export function Window({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  className,
  style,
  maximized = false,
  icon,
}: WindowProps) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-3xl',
        className
      )}
      style={{
        backgroundColor: 'white',
        boxShadow: 'var(--shadow-2xl)',
        border: '1px solid var(--glass-border)',
        ...style,
      }}
    >
      {/* Title Bar */}
      <WindowTitleBar
        title={title}
        icon={icon}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        maximized={maximized}
      />
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

/**
 * WindowTitleBar Component
 * 
 * Title bar for windows with controls
 */
interface WindowTitleBarProps {
  title: string;
  icon?: ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  maximized?: boolean;
}

function WindowTitleBar({
  title,
  icon,
  onClose,
  onMinimize,
  onMaximize,
  maximized,
}: WindowTitleBarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-1.5"
      style={{ backgroundColor: 'var(--color-neutral-900)', color: 'var(--color-neutral-100)' }}
    >
      {/* Left side - Icon and Title */}
      <div className="flex items-center space-x-2">
        {icon && (
          <div className="w-5 h-5 flex items-center justify-center">
            {icon}
          </div>
        )}
        <span className="text-sm font-light tracking-tight">{title}</span>
      </div>
      
      {/* Right side - Controls */}
      <div className="flex items-center space-x-1">
        {onMinimize && (
          <WindowButton onClick={onMinimize} ariaLabel="Minimize">
            <MinimizeIcon />
          </WindowButton>
        )}
        
        {onMaximize && (
          <WindowButton onClick={onMaximize} ariaLabel={maximized ? 'Restore' : 'Maximize'}>
            {maximized ? <RestoreIcon /> : <MaximizeIcon />}
          </WindowButton>
        )}
        
        {onClose && (
          <WindowButton onClick={onClose} ariaLabel="Close">
            <CloseIcon />
          </WindowButton>
        )}
      </div>
    </div>
  );
}

/**
 * WindowButton Component
 * 
 * Button for window controls
 */
interface WindowButtonProps {
  onClick: () => void;
  ariaLabel: string;
  children: ReactNode;
}

function WindowButton({ onClick, ariaLabel, children }: WindowButtonProps) {
  return (
    <button
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-200"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

/**
 * Window Control Icons
 */

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}

/**
 * WindowContent Component
 * 
 * Content area for windows with optional padding
 */
export interface WindowContentProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function WindowContent({ children, className, padding = true }: WindowContentProps) {
  return (
    <div className={cn(padding && 'p-6', className)}>
      {children}
    </div>
  );
}
