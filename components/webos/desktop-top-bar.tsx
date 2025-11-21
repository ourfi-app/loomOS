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
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: 'linear-gradient(135deg, rgba(216, 216, 216, 0.95) 0%, rgba(232, 232, 232, 0.95) 50%, rgba(216, 216, 216, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--webos-border-secondary)',
        boxShadow: 'var(--webos-shadow-sm)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 font-light" style={{ color: 'var(--webos-text-primary)', fontWeight: '300' }}>
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
          <span className="text-base tracking-wide font-light">loomOS</span>
        </div>

        {/* Right: Status Icons + Time */}
        <div className="flex items-center gap-3 text-sm font-light" style={{ color: 'var(--webos-text-secondary)', fontWeight: '300' }}>
          <Wifi className="w-[18px] h-[18px]" strokeWidth={2} />
          <Volume2 className="w-[18px] h-[18px]" strokeWidth={2} />
          <span style={{ color: 'var(--webos-text-primary)' }}>{currentTime}</span>
        </div>
      </div>
    </motion.div>
  );
}
