'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminMode } from '@/lib/admin-mode-store';
import { useCardManager } from '@/lib/card-manager-store';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, Search, Grid3x3, Zap } from 'lucide-react';
import { AppGridLauncher } from './app-grid-launcher';
import { IntelligentSearch } from './intelligent-search';
import { QuickAppSwitcher } from './quick-app-switcher';
import { APP_REGISTRY, type AppDefinition, getAppById } from '@/lib/enhanced-app-registry';
import { useAppPreferences } from '@/lib/app-preferences-store';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface UnifiedFloatingMenuProps {
  onOpenMissionControl?: () => void;
}

/**
 * Simplified LoomOS-style Floating Menu
 * Based on the webOS prototype design
 * 
 * Features:
 * - Fixed gesture area at bottom (60px height)
 * - Pulsing triangle indicator
 * - 5-icon dock with simple monochrome icons
 * - Swipe up to show app grid
 */
export function UnifiedFloatingMenu({ onOpenMissionControl }: UnifiedFloatingMenuProps) {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const { isAdminMode } = useAdminMode();
  const { 
    cards, 
    toggleMultitaskingView, 
    closeAllCards 
  } = useCardManager();
  const { dockAppIds, trackAppUsage } = useAppPreferences();
  const haptic = useHapticFeedback();
  
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [showIntelligentSearch, setShowIntelligentSearch] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [gestureProgress, setGestureProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const hapticTriggeredRef = useRef<boolean>(false);
  
  const y = useMotionValue(0);

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const showAdminFeatures = isSuperAdmin || (isAdmin && isAdminMode);

  // Get dock apps (max 5 slots)
  const allApps = Object.values(APP_REGISTRY);
  const dockApps = dockAppIds
    .slice(0, 5) // Max 5 slots
    .map(id => getAppById(id))
    .filter((app): app is AppDefinition => 
      app !== undefined && 
      (!app.requiresAdmin || (app.requiresAdmin && showAdminFeatures))
    );
  
  // Fill empty slots with default apps if needed
  const defaultDockApps = ['home', 'messages', 'calendar', 'directory', 'documents']
    .map(id => getAppById(id))
    .filter((app): app is AppDefinition => app !== undefined);
  
  while (dockApps.length < 5 && defaultDockApps.length > 0) {
    const nextApp = defaultDockApps.shift();
    if (nextApp && !dockApps.find(a => a.id === nextApp.id)) {
      dockApps.push(nextApp);
    }
  }

  // Gesture handlers - simplified for swipe up only
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!containerRef.current?.contains(e.target as Node)) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    
    hapticTriggeredRef.current = false;
    setIsActive(true);
    haptic.dragStart();
  }, [haptic]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || !containerRef.current?.contains(e.target as Node)) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Only handle swipe up gesture
    if (deltaY < -20) {
      const progress = Math.min(Math.abs(deltaY) / 150, 1);
      setGestureProgress(progress);
      y.set(deltaY);
      
      if (progress > 0.6 && !hapticTriggeredRef.current) {
        haptic.select();
        hapticTriggeredRef.current = true;
      }
    }
  }, [y, haptic]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    
    // If swipe up completed, show app grid
    if (gestureProgress > 0.6) {
      haptic.cardOpen();
      setIsGridOpen(true);
    } else if (gestureProgress > 0) {
      haptic.dragEnd();
    }
    
    setIsActive(false);
    setGestureProgress(0);
    touchStartRef.current = null;
    hapticTriggeredRef.current = false;
    y.set(0);
  }, [gestureProgress, haptic]);

  // Event listeners
  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // App launch handler
  const handleAppLaunch = useCallback((app: AppDefinition) => {
    trackAppUsage(app.id);
    
    if (app.id === 'home' || app.path === '/dashboard') {
      closeAllCards();
      router.push(app.path);
    } else {
      router.push(app.path);
    }
  }, [router, trackAppUsage, closeAllCards]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for Intelligent Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowIntelligentSearch(true);
      }
      
      // Cmd/Ctrl + Tab for Quick App Switcher
      if ((e.metaKey || e.ctrlKey) && e.key === 'Tab') {
        e.preventDefault();
        setShowAppSwitcher(true);
      }
      
      // Cmd/Ctrl + Space for App Grid
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setIsGridOpen(prev => !prev);
      }
      
      // Escape to close any open panel
      if (e.key === 'Escape') {
        if (isGridOpen) setIsGridOpen(false);
        if (showIntelligentSearch) setShowIntelligentSearch(false);
        if (showAppSwitcher) setShowAppSwitcher(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGridOpen, showIntelligentSearch, showAppSwitcher]);

  return (
    <>
      {/* Elegant LoomOS-Inspired Dock */}
      <div 
        ref={containerRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'pointer-events-auto',
          'transition-all duration-500 ease-out',
          isActive && 'scale-[1.02]'
        )}
      >
        {/* Wave Background with Enhanced Glassmorphism */}
        <div className="relative h-24">
          {/* Base Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent" />
          
          {/* SVG Wave Shape - More Prominent */}
          <svg 
            className="absolute bottom-0 w-full h-full pointer-events-none" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="[stop-color:hsl(var(--primary)/0.15)]" />
                <stop offset="50%" className="[stop-color:hsl(var(--primary)/0.1)]" />
                <stop offset="100%" className="[stop-color:hsl(var(--primary)/0.05)]" />
              </linearGradient>
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="[stop-color:hsl(var(--accent)/0.2)]" />
                <stop offset="50%" className="[stop-color:hsl(var(--primary)/0.25)]" />
                <stop offset="100%" className="[stop-color:hsl(var(--accent)/0.2)]" />
              </linearGradient>
            </defs>
            {/* Main Wave */}
            <path
              d="M0,50 C320,30 480,70 720,60 C960,50 1120,80 1440,70 L1440,120 L0,120 Z"
              fill="url(#waveGradient)"
              opacity="0.8"
            />
            {/* Secondary Wave for Depth */}
            <path
              d="M0,65 C280,45 520,85 720,75 C920,65 1160,95 1440,85 L1440,120 L0,120 Z"
              fill="url(#waveGradient2)"
              opacity="0.4"
            />
          </svg>
          
          {/* Glassmorphism Overlay with Better Visibility */}
          <div 
            className={cn(
              "absolute inset-0",
              "backdrop-blur-2xl bg-gradient-to-t",
              "from-background/50 via-background/30 to-transparent",
              "border-t border-primary/10",
              "shadow-[0_-4px_24px_rgba(0,0,0,0.1)]",
              "transition-all duration-300",
              isActive && "backdrop-blur-3xl from-background/60 via-background/40"
            )}
          />
          
          {/* Content Container */}
          <div className="relative h-full flex flex-col justify-end items-center pb-2">
            {/* Gesture Progress Indicator */}
            <AnimatePresence>
              {isActive && gestureProgress > 0 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: gestureProgress, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 h-1 w-64",
                    "rounded-full origin-center",
                    "bg-gradient-to-r from-transparent via-cyan-400 to-transparent",
                    gestureProgress > 0.6 && "shadow-lg shadow-cyan-400/50 via-cyan-500"
                  )}
                />
              )}
            </AnimatePresence>

            {/* Enhanced Pulsing Indicator */}
            <motion.div 
              className="flex justify-center items-center w-full h-6 mb-2"
              animate={{ y: isActive ? -3 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.9, 1.1, 0.9],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                {/* Main indicator */}
                <div className={cn(
                  "w-8 h-1 rounded-full",
                  "bg-gradient-to-r from-transparent via-foreground/30 to-transparent",
                  "shadow-sm"
                )} />
                
                {/* Glow effect */}
                <div className="absolute inset-0 blur-md">
                  <div className="w-8 h-1 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                </div>
              </motion.div>
            </motion.div>

            {/* Refined Dock with Apps + Intelligent Features */}
            <div className="flex justify-center items-center gap-10 w-full px-6 pb-1">
              {/* Left side: Intelligent Features */}
              <div className="flex items-center gap-4 pr-6 border-r border-foreground/10">
                {/* Intelligent Search Button */}
                <motion.button
                  onClick={() => setShowIntelligentSearch(true)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: 'easeOut'
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    y: -4,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="relative group w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-2xl"
                  aria-label="Search Everything"
                >
                  {/* Enhanced Icon Glow Background */}
                  <div 
                    className={cn(
                      "absolute inset-0 rounded-2xl",
                      "bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300",
                      "blur-xl scale-125"
                    )}
                  />
                  
                  {/* Icon with refined styling */}
                  <div className={cn(
                    "relative z-10 w-11 h-11 rounded-xl",
                    "flex items-center justify-center",
                    "bg-gradient-to-br",
                    "from-cyan-500/10 to-blue-500/15",
                    "group-hover:from-cyan-500/15 group-hover:to-blue-500/20",
                    "border border-cyan-500/20",
                    "group-hover:border-cyan-500/30",
                    "shadow-sm group-hover:shadow-md",
                    "transition-all duration-300"
                  )}>
                    <Search 
                      className="w-6 h-6 text-cyan-500 transition-colors duration-300"
                      strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))' }}
                    />
                  </div>
                  
                  {/* Enhanced Hover tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileHover={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "absolute -top-14 left-1/2 -translate-x-1/2",
                      "px-3 py-1.5 rounded-lg",
                      "bg-popover/95 backdrop-blur-xl",
                      "text-popover-foreground",
                      "text-xs font-medium",
                      "pointer-events-none",
                      "shadow-xl border border-border/50",
                      "whitespace-nowrap"
                    )}
                  >
                    Search (⌘K)
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover/95 border-l border-b border-border/50 rotate-45" />
                  </motion.div>
                </motion.button>

                {/* Quick App Switcher Button */}
                <motion.button
                  onClick={() => setShowAppSwitcher(true)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.05,
                    duration: 0.4,
                    ease: 'easeOut'
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    y: -4,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="relative group w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-2xl"
                  aria-label="Quick App Switcher"
                >
                  {/* Enhanced Icon Glow Background */}
                  <div 
                    className={cn(
                      "absolute inset-0 rounded-2xl",
                      "bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300",
                      "blur-xl scale-125"
                    )}
                  />
                  
                  {/* Icon with refined styling */}
                  <div className={cn(
                    "relative z-10 w-11 h-11 rounded-xl",
                    "flex items-center justify-center",
                    "bg-gradient-to-br",
                    "from-purple-500/10 to-pink-500/15",
                    "group-hover:from-purple-500/15 group-hover:to-pink-500/20",
                    "border border-purple-500/20",
                    "group-hover:border-purple-500/30",
                    "shadow-sm group-hover:shadow-md",
                    "transition-all duration-300"
                  )}>
                    <Zap 
                      className="w-6 h-6 text-[var(--semantic-accent)] transition-colors duration-300"
                      strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))' }}
                    />
                  </div>
                  
                  {/* Enhanced Hover tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileHover={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "absolute -top-14 left-1/2 -translate-x-1/2",
                      "px-3 py-1.5 rounded-lg",
                      "bg-popover/95 backdrop-blur-xl",
                      "text-popover-foreground",
                      "text-xs font-medium",
                      "pointer-events-none",
                      "shadow-xl border border-border/50",
                      "whitespace-nowrap"
                    )}
                  >
                    Quick Switch (⌘⇥)
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover/95 border-l border-b border-border/50 rotate-45" />
                  </motion.div>
                </motion.button>
              </div>

              {/* Center: Dock Apps */}
              {dockApps.map((app, index) => {
                const Icon = app.icon;
                const isActiveApp = pathname === app.path;
                
                return (
                  <motion.button
                    key={app.id}
                    onClick={() => handleAppLaunch(app)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: (index + 2) * 0.05,
                      duration: 0.4,
                      ease: 'easeOut'
                    }}
                    whileHover={{ 
                      scale: 1.2,
                      y: -4,
                      transition: { duration: 0.2, ease: 'easeOut' }
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'relative group',
                      'w-12 h-12 flex items-center justify-center',
                      'transition-all duration-300',
                      'rounded-2xl',
                      isActiveApp && 'bg-primary/10'
                    )}
                    aria-label={app.title}
                  >
                    {/* Enhanced Icon Glow Background */}
                    <div 
                      className={cn(
                        "absolute inset-0 rounded-2xl",
                        "bg-gradient-to-br from-primary/20 via-accent/10 to-transparent",
                        "opacity-0 group-hover:opacity-100",
                        "transition-opacity duration-300",
                        "blur-xl scale-125",
                        isActiveApp && "opacity-30"
                      )}
                    />
                    
                    {/* Elegant Active Indicator */}
                    {isActiveApp && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={cn(
                          "absolute -bottom-2 left-1/2 -translate-x-1/2",
                          "w-1.5 h-1.5 rounded-full",
                          "bg-primary shadow-lg shadow-primary/50",
                          "ring-2 ring-background/50"
                        )}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    {/* Icon with refined styling and gradient background */}
                    <div className={cn(
                      "relative z-10 w-11 h-11 rounded-xl",
                      "flex items-center justify-center",
                      "bg-gradient-to-br",
                      "from-foreground/5 to-foreground/10",
                      "group-hover:from-foreground/10 group-hover:to-foreground/15",
                      "border border-foreground/10",
                      "group-hover:border-primary/20",
                      "shadow-sm group-hover:shadow-md",
                      "transition-all duration-300",
                      isActiveApp && "from-primary/10 to-primary/20 border-primary/30"
                    )}>
                      <Icon 
                        className={cn(
                          "w-6 h-6",
                          "text-foreground/70",
                          "group-hover:text-foreground",
                          "transition-colors duration-300",
                          isActiveApp && "text-primary"
                        )}
                        strokeWidth={2}
                        style={{
                          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))',
                        }}
                      />
                    </div>
                    
                    {/* Enhanced Hover tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      whileHover={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "absolute -top-12 left-1/2 -translate-x-1/2",
                        "px-3 py-1.5 rounded-lg",
                        "bg-popover/95 backdrop-blur-xl",
                        "text-popover-foreground",
                        "text-xs font-medium",
                        "pointer-events-none",
                        "shadow-xl border border-border/50",
                        "whitespace-nowrap"
                      )}
                    >
                      {app.title}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover/95 border-l border-b border-border/50 rotate-45" />
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* App Grid Launcher */}
      <AppGridLauncher isOpen={isGridOpen} onClose={() => setIsGridOpen(false)} />

      {/* Intelligent Search */}
      <IntelligentSearch 
        isOpen={showIntelligentSearch} 
        onClose={() => setShowIntelligentSearch(false)} 
      />

      {/* Quick App Switcher */}
      <QuickAppSwitcher 
        isOpen={showAppSwitcher} 
        onClose={() => setShowAppSwitcher(false)} 
      />
    </>
  );
}
