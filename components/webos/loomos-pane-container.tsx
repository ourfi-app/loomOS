
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, Menu } from 'lucide-react';

interface PaneContextValue {
  activePane: string | null;
  setActivePane: (pane: string | null) => void;
  isPeeking: boolean;
  setIsPeeking: (peeking: boolean) => void;
}

const PaneContext = createContext<PaneContextValue | undefined>(undefined);

function usePaneContext() {
  const context = useContext(PaneContext);
  if (!context) {
    throw new Error('Pane components must be used within LoomOSPaneContainer');
  }
  return context;
}

export interface LoomOSPaneContainerProps {
  children: React.ReactNode;
  className?: string;
  defaultPane?: string;
}

/**
 * LoomOS Pane Container
 * 
 * Container for multi-pane layouts with peeking animations and responsive behavior.
 * Reference: layouts-pane-peeking.png, layouts-pane-navigation.png
 * 
 * @example
 * <LoomOSPaneContainer>
 *   <LoomOSContainerPane type="navigation" id="nav" width={240} peekable>
 *     <Navigation />
 *   </LoomOSContainerPane>
 *   
 *   <LoomOSContainerPane type="list" id="list" width={320}>
 *     <ListItems />
 *   </LoomOSContainerPane>
 *   
 *   <LoomOSContainerPane type="detail" id="detail" fill>
 *     <DetailView />
 *   </LoomOSContainerPane>
 * </LoomOSPaneContainer>
 */
export function LoomOSPaneContainer({
  children,
  className,
  defaultPane
}: LoomOSPaneContainerProps) {
  const [activePane, setActivePane] = useState<string | null>(defaultPane || null);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <PaneContext.Provider value={{ activePane, setActivePane, isPeeking, setIsPeeking }}>
      <div className={cn('flex h-full overflow-hidden', className)}>
        {children}
      </div>
    </PaneContext.Provider>
  );
}

export interface LoomOSContainerPaneProps {
  id: string;
  type: 'navigation' | 'list' | 'detail';
  children: React.ReactNode;
  width?: number;
  fill?: boolean;
  peekable?: boolean;
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

/**
 * LoomOS Container Pane
 * 
 * Individual pane within a pane container.
 */
export function LoomOSContainerPane({
  id,
  type,
  children,
  width,
  fill,
  peekable,
  className,
  showBackButton,
  onBack
}: LoomOSContainerPaneProps) {
  const { activePane, setActivePane, isPeeking, setIsPeeking } = usePaneContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isVisible = () => {
    if (!isMobile) return true;
    if (type === 'navigation') return activePane === id || isPeeking;
    if (type === 'list') return activePane === id || activePane === null;
    if (type === 'detail') return activePane === id;
    return true;
  };

  const paneVariants = {
    hidden: { x: type === 'navigation' ? '-100%' : '100%' },
    visible: { 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    peeking: {
      x: type === 'navigation' ? '-20%' : '20%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const getAnimationState = () => {
    if (!isMobile) return 'visible';
    if (isPeeking && peekable) return 'peeking';
    return isVisible() ? 'visible' : 'hidden';
  };

  return (
    <motion.div
      className={cn(
        'h-full overflow-y-auto overflow-x-hidden',
        
        // Desktop styles
        !isMobile && [
          type === 'navigation' && 'border-r border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900',
          type === 'list' && 'border-r border-neutral-200 dark:border-neutral-700',
          fill ? 'flex-1' : width && `w-[${width}px] flex-shrink-0`
        ],
        
        // Mobile styles
        isMobile && [
          'absolute inset-0 z-10 bg-white dark:bg-neutral-900',
          type === 'navigation' && 'z-20 shadow-lg',
          type === 'detail' && 'z-10'
        ],
        
        className
      )}
      style={{
        width: !isMobile && !fill && width ? `${width}px` : undefined
      }}
      variants={isMobile ? paneVariants : undefined}
      initial={isMobile ? 'hidden' : 'visible'}
      animate={getAnimationState()}
      data-pane-type={type}
      data-pane-id={id}
    >
      {/* Mobile Back Button */}
      {isMobile && showBackButton && (
        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                setActivePane(null);
              }
            }}
            className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      )}

      {children}
    </motion.div>
  );
}

/**
 * LoomOS Pane Toggle Button
 * 
 * Button to toggle navigation pane visibility on mobile.
 */
export interface LoomOSPaneToggleProps {
  paneId: string;
  className?: string;
}

export function LoomOSPaneToggle({ paneId, className }: LoomOSPaneToggleProps) {
  const { activePane, setActivePane } = usePaneContext();

  return (
    <button
      onClick={() => setActivePane(activePane === paneId ? null : paneId)}
      className={cn(
        'md:hidden p-2 rounded-lg',
        'text-neutral-700 dark:text-neutral-300',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        'transition-colors',
        className
      )}
      aria-label="Toggle navigation"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

LoomOSPaneContainer.displayName = 'LoomOSPaneContainer';
LoomOSContainerPane.displayName = 'LoomOSContainerPane';
LoomOSPaneToggle.displayName = 'LoomOSPaneToggle';
