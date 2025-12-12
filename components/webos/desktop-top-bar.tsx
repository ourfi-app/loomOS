'use client';

import { useSession } from 'next-auth/react';
import { Wifi, Volume2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Desktop Top Bar Component
 *
 * Clean status bar with glassmorphism effect matching webOS design system
 * Shows logo on left, status icons and time on right
 * 
 * Design System Compliance:
 * - Uses glassmorphic background with backdrop blur
 * - Proper design token usage for colors, spacing, and typography
 * - Consistent with webOS minimal aesthetic
 */
export function DesktopTopBar() {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.2,
        ease: 'var(--ease-out)'
      }}
      className="fixed top-0 left-0 w-full z-50"
      style={{
        backgroundColor: 'var(--glass-white-95)',
        backdropFilter: 'blur(var(--blur-lg))',
        WebkitBackdropFilter: 'blur(var(--blur-lg))',
        borderBottom: '1px solid var(--border-lightest)',
        boxShadow: 'var(--shadow-navbar)',
        fontFamily: 'var(--font-sans)'
      }}
    >
      <div 
        className="flex items-center justify-between"
        style={{
          paddingLeft: 'var(--space-lg)',
          paddingRight: 'var(--space-lg)',
          paddingTop: 'var(--space-2)',
          paddingBottom: 'var(--space-2)'
        }}
      >
        {/* Left: Logo */}
        <div 
          className="flex items-center"
          style={{ 
            gap: 'var(--space-2)',
            color: 'var(--text-primary)',
            fontWeight: 'var(--font-light)'
          }}
        >
          {/* loomOS Interlace Logo */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 10h12" />
            <path d="M6 14h12" />
            <path d="M10 6v12" />
            <path d="M14 6v12" />
          </svg>
          <span 
            style={{
              fontSize: 'var(--text-sm)',
              letterSpacing: 'var(--tracking-wide)',
              fontWeight: 'var(--font-light)'
            }}
          >
            loomOS
          </span>
        </div>

        {/* Right: Status Icons + Time */}
        <div 
          className="flex items-center"
          style={{ 
            gap: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            fontWeight: 'var(--font-light)'
          }}
        >
          <Wifi className="w-4 h-4" strokeWidth={2} />
          <Volume2 className="w-4 h-4" strokeWidth={2} />
          <Clock className="w-4 h-4" strokeWidth={2} />
          <span>{currentTime}</span>
        </div>
      </div>
    </motion.div>
  );
}
