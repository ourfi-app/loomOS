'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { loomOSTheme, animations, layouts } from '@/lib/loomos-design-system';
import { cn } from '@/lib/utils';

export interface DockApp {
  id: string;
  name: string;
  icon: ReactNode;
  color1: string;
  color2: string;
  hasNotification?: boolean;
  notificationCount?: number;
  isActive?: boolean;
  isRunning?: boolean;
}

export interface LoomOSDockProps {
  apps: DockApp[];
  activeAppId?: string | null;
  onAppClick?: (appId: string) => void;
  onAppLongPress?: (appId: string) => void;
  className?: string;
  position?: 'bottom' | 'top' | 'left' | 'right';
  orientation?: 'horizontal' | 'vertical';
}

/**
 * LoomOSDock
 *
 * The signature loomOS application launcher and task switcher.
 * Features:
 * - Beautiful gradient app icons
 * - Notification badges
 * - Active app indicators
 * - Smooth hover animations
 * - Running app indicators (dots)
 */
export function LoomOSDock({
  apps,
  activeAppId,
  onAppClick,
  onAppLongPress,
  className,
  position = 'bottom',
  orientation = 'horizontal',
}: LoomOSDockProps) {
  const isHorizontal = orientation === 'horizontal';

  // Handle app click
  const handleAppClick = (appId: string) => {
    onAppClick?.(appId);
  };

  // Handle long press for context menu
  const handleLongPress = (appId: string) => {
    onAppLongPress?.(appId);
  };

  return (
    <motion.div
      className={cn(
        'loomos-dock',
        'fixed z-50',
        'bg-white/80 backdrop-blur-xl',
        'border border-[var(--semantic-border-light)]',
        'shadow-2xl',
        // Position
        position === 'bottom' && 'bottom-2 left-1/2 -translate-x-1/2',
        position === 'top' && 'top-2 left-1/2 -translate-x-1/2',
        position === 'left' && 'left-2 top-1/2 -translate-y-1/2',
        position === 'right' && 'right-2 top-1/2 -translate-y-1/2',
        // Orientation
        isHorizontal ? 'rounded-2xl px-3 py-2' : 'rounded-2xl px-2 py-3',
        className
      )}
      initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div
        className={cn(
          'flex items-center',
          isHorizontal ? 'flex-row gap-3' : 'flex-col gap-3'
        )}
      >
        {apps.map((app) => (
          <DockIcon
            key={app.id}
            app={app}
            isActive={app.id === activeAppId}
            onClick={() => handleAppClick(app.id)}
            onLongPress={() => handleLongPress(app.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * DockIcon
 *
 * Individual dock icon with gradient background and animations
 */
interface DockIconProps {
  app: DockApp;
  isActive: boolean;
  onClick: () => void;
  onLongPress: () => void;
}

function DockIcon({ app, isActive, onClick, onLongPress }: DockIconProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const pressTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, 500); // 500ms for long press
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (isPressed) {
      onClick();
    }
    setIsPressed(false);
  };

  React.useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  return (
    <motion.div className="relative">
      {/* App Icon */}
      <motion.button
        className={cn(
          'loomos-dock-icon',
          'relative w-14 h-14 rounded-xl',
          'flex items-center justify-center',
          'overflow-hidden',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'transition-all duration-200'
        )}
        style={{
          backgroundImage: `linear-gradient(135deg, ${app.color1}, ${app.color2})`,
        }}
        variants={animations.dockIcon}
        whileHover="hover"
        whileTap="tap"
        animate={{
          scale: isActive ? 1.1 : 1,
        }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        aria-label={app.name}
      >
        {/* Icon */}
        <div className="text-white w-7 h-7 flex items-center justify-center">
          {app.icon}
        </div>

        {/* Active Indicator Glow */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Notification Badge */}
        {app.hasNotification && (
          <motion.div
            className="loomos-notification-badge absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--semantic-error)] rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {app.notificationCount !== undefined && app.notificationCount > 0 && (
              <span className="text-white text-xs font-bold leading-none">
                {app.notificationCount > 99 ? '99+' : app.notificationCount}
              </span>
            )}
          </motion.div>
        )}
      </motion.button>

      {/* Running Indicator Dot */}
      {app.isRunning && (
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--semantic-text-secondary)] rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        />
      )}

      {/* App Name Tooltip */}
      <motion.div
        className={cn(
          'absolute bottom-full mb-2 left-1/2 -translate-x-1/2',
          'px-2 py-1 bg-[var(--semantic-text-primary)] text-white text-xs rounded',
          'whitespace-nowrap pointer-events-none',
          'opacity-0'
        )}
        whileHover={{ opacity: 1 }}
      >
        {app.name}
      </motion.div>
    </motion.div>
  );
}

/**
 * LoomOSDockSeparator
 *
 * Visual separator for grouping dock items
 */
export function LoomOSDockSeparator() {
  return (
    <div className="loomos-dock-separator w-px h-12 bg-[var(--semantic-bg-muted)] mx-2" />
  );
}

/**
 * Predefined Dock Apps Configuration
 * Common apps that would appear in the loomOS dock
 */
export const defaultDockApps: DockApp[] = [
  {
    id: 'home',
    name: 'Home',
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    color1: '#3B82F6',
    color2: '#1D4ED8',
    isRunning: true,
  },
  {
    id: 'email',
    name: 'Email',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color1: '#F59E0B',
    color2: '#D97706',
    hasNotification: true,
    notificationCount: 5,
    isRunning: true,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color1: '#84CC16',
    color2: '#65A30D',
    isRunning: false,
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color1: '#22C55E',
    color2: '#16A34A',
    hasNotification: true,
    notificationCount: 3,
    isRunning: false,
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    color1: '#D946EF',
    color2: '#A21CAF',
    isRunning: false,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color1: '#64748B',
    color2: '#475569',
    isRunning: false,
  },
];
