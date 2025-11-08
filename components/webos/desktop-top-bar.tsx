'use client';

import { useSession } from 'next-auth/react';
import { Wifi, Volume2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Desktop Top Bar Component
 *
 * Clean status bar with glass morphism effect
 * Shows logo on left, status icons and time on right
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
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 font-medium text-foreground">
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
          <strong className="text-base tracking-wide">loomOS</strong>
        </div>

        {/* Right: Status Icons + Time */}
        <div className="flex items-center gap-3 text-sm font-medium text-foreground/70">
          <Wifi className="w-[18px] h-[18px]" />
          <Volume2 className="w-[18px] h-[18px]" />
          <span className="text-foreground">{currentTime}</span>
        </div>
      </div>
    </motion.div>
  );
}
