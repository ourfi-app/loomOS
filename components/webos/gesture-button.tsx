'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

/**
 * GestureButton Component
 * 
 * A glowing gesture button positioned just below the dock that mimics
 * the classic webOS home button design. When hovered, it reveals the dock.
 * 
 * Features:
 * - Small, pill-shaped design with subtle glow effect
 * - Pulsing animation to draw attention
 * - Hover interaction to reveal dock
 * - Glassmorphism styling matching the design system
 * - Auto-hide behavior coordinated with dock
 */

interface GestureButtonProps {
  /** Whether the dock is currently visible */
  isDockVisible: boolean;
  /** Callback when button is hovered to show dock */
  onShowDock: () => void;
  /** Whether we're on the home/dashboard page */
  isHomePage?: boolean;
  /** Custom className for additional styling */
  className?: string;
}

export function GestureButton({
  isDockVisible,
  onShowDock,
  isHomePage = false,
  className,
}: GestureButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // Show button when dock is hidden and not on home page
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    setShouldShow(!isDockVisible && !isHomePage && isDesktop);
  }, [isDockVisible, isHomePage]);

  // Don't render on mobile or when dock is visible or on home page
  if (!shouldShow) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'gesture-button-container fixed bottom-2 left-1/2 -translate-x-1/2 z-[9998]',
        'pointer-events-auto',
        className
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        onShowDock();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          'gesture-button relative',
          'w-16 h-2 rounded-full',
          'cursor-pointer',
          'gesture-button-glow'
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 0 20px rgba(138, 138, 138, 0.5), 0 0 40px rgba(138, 138, 138, 0.3)',
        }}
      >
        {/* Inner glow element */}
        <div 
          className="absolute inset-0 rounded-full gesture-button-inner-glow"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
