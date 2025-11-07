
'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with animated icon */}
          <div className="relative h-48 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="relative"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center shadow-xl">
                <WifiOff className="w-12 h-12 text-slate-400" />
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-white">
                You're Offline
              </h1>
              <p className="text-slate-400">
                It looks like you've lost your internet connection. Don't worry, you can still access cached content.
              </p>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="relative">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-3 h-3 bg-orange-500 rounded-full"
                />
              </div>
              <span className="text-sm text-slate-300">
                No internet connection
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>

            {/* Tips */}
            <div className="pt-4 border-t border-slate-700/50">
              <h3 className="text-sm font-medium text-slate-300 mb-3">
                While you're offline:
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>View previously loaded pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Access cached documents and data</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
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
