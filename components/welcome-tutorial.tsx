
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile, useIsTablet } from '@/hooks/use-responsive';
import { cn } from '@/lib/utils';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Montrecott!',
    description: 'Let\'s take a quick tour to help you get started with your community management app.',
    position: 'center'
  },
  {
    id: 'dock',
    title: 'The Dock',
    description: 'Your main navigation is here at the bottom. Click any icon to open an app.',
    targetElement: '[data-tutorial="dock"]',
    position: 'top'
  },
  {
    id: 'app-launcher',
    title: 'App Launcher',
    description: 'Click the grid icon to see all available apps and quickly launch them.',
    targetElement: '[data-tutorial="app-launcher"]',
    position: 'top'
  },
  {
    id: 'status-bar',
    title: 'Status Bar',
    description: 'Check notifications, access settings, and find help here.',
    targetElement: '[data-tutorial="status-bar"]',
    position: 'bottom'
  },
  {
    id: 'mobile-gestures',
    title: 'Mobile Gestures',
    description: 'Swipe left/right to navigate, pull down to refresh, and swipe down from the top for notifications.',
    position: 'center',
    mobileOnly: true
  },
  {
    id: 'desktop-windows',
    title: 'Multiple Windows',
    description: 'On desktop, you can open multiple apps in separate windows and arrange them as you like.',
    position: 'center',
    desktopOnly: true
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You can access this tutorial anytime from the Help menu. Enjoy exploring your community app!',
    position: 'center'
  }
];

interface WelcomeTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function WelcomeTutorial({ onComplete, onSkip }: WelcomeTutorialProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Filter steps based on device
  const visibleSteps = tutorialSteps.filter(s => {
    if (s.mobileOnly && !isMobile && !isTablet) return false;
    if (s.desktopOnly && (isMobile || isTablet)) return false;
    return true;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightElement, setHighlightElement] = useState<DOMRect | null>(null);

  const step = visibleSteps[currentStepIndex];
  const isLastStep = currentStepIndex === visibleSteps.length - 1;

  useEffect(() => {
    if (step?.targetElement) {
      // Wait a bit for DOM to be ready
      const timer = setTimeout(() => {
        const element = document.querySelector(step.targetElement!);
        if (element) {
          const rect = element.getBoundingClientRect();
          setHighlightElement(rect);
          // Scroll element into view
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.warn('Tutorial target element not found:', step.targetElement);
          setHighlightElement(null);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setHighlightElement(null);
      return undefined;
    }
  }, [currentStepIndex, step]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!step) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={handleSkip}
      />

      {/* Highlight spotlight */}
      {highlightElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: highlightElement.left - 8,
            top: highlightElement.top - 8,
            width: highlightElement.width + 16,
            height: highlightElement.height + 16,
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.6)',
          }}
        />
      )}

      {/* Tutorial card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed z-[10000] bg-background border-2 border-primary/20 rounded-2xl shadow-2xl',
            'w-[90vw] max-w-md p-6',
            // Position based on step
            step.position === 'center' && 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            step.position === 'top' && 'left-1/2 top-24 -translate-x-1/2',
            step.position === 'bottom' && 'left-1/2 bottom-24 -translate-x-1/2',
            step.position === 'left' && 'left-8 top-1/2 -translate-y-1/2',
            step.position === 'right' && 'right-8 top-1/2 -translate-y-1/2'
          )}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
            <p className="text-muted-foreground">{step.description}</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {visibleSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentStepIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted'
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentStepIndex + 1} of {visibleSteps.length}
            </span>

            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {isLastStep ? (
                <>
                  Complete
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
