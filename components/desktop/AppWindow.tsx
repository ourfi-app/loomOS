'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, MoreVertical } from 'lucide-react';
import { useAppStore } from '@/lib/store/appStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AppWindow() {
  const { getFullscreenApp, minimizeApp, closeApp } = useAppStore();
  const router = useRouter();
  const fullscreenApp = getFullscreenApp();

  useEffect(() => {
    // Navigate to app route when fullscreen app changes
    if (fullscreenApp) {
      router.push(fullscreenApp.appDef.path);
    }
  }, [fullscreenApp, router]);

  if (!fullscreenApp) return null;

  const Icon = fullscreenApp.appDef.icon;

  const handleMinimize = () => {
    minimizeApp(fullscreenApp.id);
    router.push('/dashboard');
  };

  const handleClose = () => {
    closeApp(fullscreenApp.id);
    router.push('/dashboard');
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={fullscreenApp.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-40 flex flex-col bg-bg-primary"
      >
        {/* App Header */}
        <div className="flex-shrink-0 h-14 bg-bg-surface border-b border-border-light flex items-center justify-between px-4">
          {/* Left: App Info */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shadow-md',
                'bg-gradient-to-br',
                fullscreenApp.appDef.gradient || 'from-gray-500 to-gray-700'
              )}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-text-primary">
              {fullscreenApp.appDef.title}
            </span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleMinimize}>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Minimize
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClose} className="text-error">
                  <X className="w-4 h-4 mr-2" />
                  Close App
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Minimize Button */}
            <button
              onClick={handleMinimize}
              className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Minimize"
            >
              <Minimize2 className="w-5 h-5" />
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* App Content Area */}
        <div className="flex-1 overflow-hidden bg-bg-primary">
          {/* The actual app content will be rendered by Next.js routing */}
          {/* This is just the frame/container */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
