
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Button } from '@/components/ui/button';

export function PWAUpdateNotification() {
  const { hasUpdate, isDismissed, updateServiceWorker } = usePWA();
  const { press, tap } = useHapticFeedback();

  const handleUpdate = () => {
    press();
    updateServiceWorker();
  };

  const handleDismiss = () => {
    tap();
    // Dispatch event to mark as dismissed
    window.dispatchEvent(new Event('dismissUpdate'));
  };

  // Only show if there's an update AND it hasn't been dismissed
  const shouldShow = hasUpdate && !isDismissed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              {/* Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">
                  Update Available
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  A new version is ready to install
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  className="bg-white hover:bg-white/90 text-[var(--semantic-primary)] h-8 px-3"
                >
                  Update
                </Button>
                <button
                  onClick={handleDismiss}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
