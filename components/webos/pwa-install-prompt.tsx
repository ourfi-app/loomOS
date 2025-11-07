
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Button } from '@/components/ui/button';

export function PWAInstallPrompt() {
  const { canInstall, promptInstall, isInstalled } = usePWA();
  const { press, tap } = useHapticFeedback();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the prompt
    const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    setDismissed(isDismissed);

    // Show prompt after 30 seconds if not installed and not dismissed
    if (canInstall && !isDismissed && !isInstalled) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    press();
    const installed = await promptInstall();
    if (installed) {
      setShow(false);
    }
  };

  const handleDismiss = () => {
    tap();
    setShow(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!canInstall || dismissed || isInstalled) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />

          {/* Install Prompt Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Gradient Header */}
              <div className="relative h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                    <Download className="w-8 h-8 text-blue-600" />
                  </div>
                </motion.div>

                {/* Close Button */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Install Community Manager
                  </h3>
                  <p className="text-sm text-slate-400">
                    Get the full app experience with offline access, faster loading, and native features
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <FeatureItem
                    icon={<Smartphone className="w-5 h-5" />}
                    text="Works like a native app"
                  />
                  <FeatureItem
                    icon={<Monitor className="w-5 h-5" />}
                    text="Access from home screen"
                  />
                  <FeatureItem
                    icon={<Download className="w-5 h-5" />}
                    text="Available offline"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  >
                    Not Now
                  </Button>
                  <Button
                    onClick={handleInstall}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    Install
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 text-slate-300"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="text-sm">{text}</span>
    </motion.div>
  );
}
