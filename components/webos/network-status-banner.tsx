
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { useState, useEffect } from 'react';

export function NetworkStatusBanner() {
  const { isOnline } = usePWA();
  const [showOffline, setShowOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
      setShowBackOnline(false);
    } else if (showOffline) {
      // Was offline, now back online
      setShowOffline(false);
      setShowBackOnline(true);
      
      // Hide the "back online" message after 3 seconds
      const timer = setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isOnline, showOffline]);

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {showOffline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <WifiOff className="w-5 h-5" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium">
                    You're currently offline
                  </p>
                  <p className="text-xs opacity-90">
                    Some features may be limited
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Online Banner */}
      <AnimatePresence>
        {showBackOnline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  <Wifi className="w-5 h-5" />
                </motion.div>
                <p className="text-sm font-medium">
                  You're back online
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
