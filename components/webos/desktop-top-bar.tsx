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
 * - True glassmorphic background with high transparency and strong blur
 * - Proper design token usage for colors, spacing, and typography
 * - Matches the dock's translucent aesthetic
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
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="fixed top-0 left-0 w-full z-50"
      style={{
        // True glassmorphic background - 70% opacity for translucency
        backgroundColor: 'var(--glass-white-70)',
        // Strong backdrop blur for frosted glass effect
        backdropFilter: 'blur(var(--blur-xl)) saturate(180%)',
        WebkitBackdropFilter: 'blur(var(--blur-xl)) saturate(180%)',
        // Subtle border with transparency
        borderBottom: '1px solid var(--glass-border-light)',
        // Soft shadow for depth
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        fontFamily: 'var(--font-sans)'
      }}
    >
      <div 
        className="flex items-center justify-between"
        style={{
          paddingLeft: 'var(--space-lg)',
          paddingRight: 'var(--space-lg)',
          paddingTop: 'var(--space-3)',
          paddingBottom: 'var(--space-3)'
        }}
      >
        {/* Left: Logo */}
        <div 
          className="flex items-center"
          style={{ 
            gap: 'var(--space-2)',
            color: 'var(--text-primary)',
            fontWeight: 500
          }}
        >
          {/* loomOS Interlace Logo */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
            }}
          >
            <path d="M6 10h12" />
            <path d="M6 14h12" />
            <path d="M10 6v12" />
            <path d="M14 6v12" />
          </svg>
          <span 
            style={{
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.02em',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
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
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}
        >
          <Wifi 
            className="w-4 h-4" 
            strokeWidth={2.5} 
            style={{ 
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))',
              opacity: 0.85
            }} 
          />
          <Volume2 
            className="w-4 h-4" 
            strokeWidth={2.5}
            style={{ 
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))',
              opacity: 0.85
            }}
          />
          <Clock 
            className="w-4 h-4" 
            strokeWidth={2.5}
            style={{ 
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))',
              opacity: 0.85
            }}
          />
          <span style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {currentTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
