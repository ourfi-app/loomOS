
'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { isOnline } from '@/lib/pwa-utils';

export default function OfflinePage() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    setOnline(isOnline());

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (online) {
      // Redirect to home when back online
      window.location.href = '/dashboard';
    }
  }, [online]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-md w-full"
      >
        <div 
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-xl)'
          }}
        >
          {/* Header with animated icon */}
          <div 
            className="relative h-48 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #d0d0d0 0%, #e0e0e0 50%, #d0d0d0 100%)'
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="relative"
            >
              <div 
                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--webos-app-gray), var(--webos-text-secondary))',
                  boxShadow: 'var(--webos-shadow-lg)'
                }}
              >
                <WifiOff className="w-12 h-12" style={{ color: 'var(--webos-text-white)' }} />
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <h1 
                className="text-2xl font-light tracking-tight"
                style={{ color: 'var(--webos-text-primary)' }}
              >
                You're Offline
              </h1>
              <p 
                className="text-sm font-light"
                style={{ color: 'var(--webos-text-secondary)' }}
              >
                It looks like you've lost your internet connection. Don't worry, you can still access cached content.
              </p>
            </div>

            {/* Status indicator */}
            <div 
              className="flex items-center justify-center gap-2 p-3 rounded-xl"
              style={{
                background: 'var(--webos-bg-secondary)',
                border: '1px solid var(--webos-border-secondary)'
              }}
            >
              <div className="relative">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ background: 'var(--webos-app-blue)' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-3 h-3 rounded-full"
                  style={{ background: 'var(--webos-app-blue)' }}
                />
              </div>
              <span 
                className="text-sm font-light"
                style={{ color: 'var(--webos-text-tertiary)' }}
              >
                No internet connection
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                className="w-full rounded-xl py-3 px-6 flex items-center justify-center text-sm font-light tracking-wide uppercase transition-all hover:opacity-90"
                style={{
                  background: 'var(--webos-ui-dark)',
                  color: 'var(--webos-text-white)',
                  boxShadow: 'var(--webos-shadow-md)'
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={handleGoHome}
                className="w-full rounded-xl py-3 px-6 flex items-center justify-center text-sm font-light tracking-wide uppercase transition-all hover:opacity-90"
                style={{
                  background: 'var(--glass-white-60)',
                  border: '1px solid var(--webos-border-secondary)',
                  color: 'var(--webos-text-primary)',
                  boxShadow: 'var(--webos-shadow-sm)'
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </button>
            </div>

            {/* Tips */}
            <div 
              className="pt-4"
              style={{
                borderTop: '1px solid var(--webos-border-secondary)'
              }}
            >
              <h3 
                className="text-xs font-light tracking-wider mb-3 uppercase"
                style={{ color: 'var(--webos-text-tertiary)' }}
              >
                While you're offline:
              </h3>
              <ul className="space-y-2 text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>
                <li className="flex items-start gap-2">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" 
                    style={{ background: 'var(--webos-app-blue)' }}
                  />
                  <span>View previously loaded pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" 
                    style={{ background: 'var(--webos-app-blue)' }}
                  />
                  <span>Access cached documents and data</span>
                </li>
                <li className="flex items-start gap-2">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" 
                    style={{ background: 'var(--webos-app-blue)' }}
                  />
                  <span>Changes will sync when you're back online</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
