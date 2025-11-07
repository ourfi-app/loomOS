
'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { X, Maximize2, Minimize2, ChevronLeft } from 'lucide-react';
import { useCardManager as useCardManagerStore } from '@/lib/card-manager-store';
import { cn } from '@/lib/utils';
import { getAppById } from '@/lib/enhanced-app-registry';
import { useBreadcrumbs } from '@/hooks/webos/use-breadcrumbs';
import { Breadcrumbs } from '@/components/webos/breadcrumb';
import { Button } from '@/components/ui/button';

interface CardProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: any;
  color?: string;
  children: ReactNode;
  isActive?: boolean;
  showBreadcrumbs?: boolean;
  onBack?: () => void;
  actions?: ReactNode;
  isMaximized?: boolean;
}

export function RefinedCard({ 
  id, 
  title, 
  subtitle, 
  icon: IconProp, 
  color: colorProp, 
  children, 
  isActive = false, 
  showBreadcrumbs = true,
  onBack,
  actions,
  isMaximized: isMaximizedProp = false
}: CardProps) {
  const { closeCard, maximizeCard, cards } = useCardManagerStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const startX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const breadcrumbs = useBreadcrumbs();

  // Get maximized state from store
  const currentCard = cards.find(c => c.id === id);
  const isMaximized = currentCard?.maximized || isMaximizedProp;

  // Try to get app info from registry if not provided
  const appInfo = getAppById(id);
  const Icon = IconProp || appInfo?.icon;
  const color = colorProp || appInfo?.gradient || 'from-blue-500 via-blue-600 to-indigo-700';

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Don't intercept touch events from scrollable content
      const target = e.target as HTMLElement;
      if (target.closest('.webos-card-content')) return;
      
      const touch = e.touches[0];
      if (!touch) return;
      
      startY.current = touch.clientY;
      startX.current = touch.clientX;
      isDragging.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      
      const touch = e.touches[0];
      if (!touch) return;
      
      const deltaY = touch.clientY - startY.current;
      const deltaX = Math.abs(touch.clientX - startX.current);
      
      // Only track vertical movement for dismissal (swipe down)
      if (deltaY > 0 && deltaX < 50) {
        const progress = Math.min(deltaY / 300, 1);
        card.style.transform = `translateY(${deltaY}px) scale(${1 - progress * 0.1})`;
        card.style.opacity = `${1 - progress * 0.5}`;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      
      const touch = e.changedTouches[0];
      if (!touch) return;
      
      const deltaY = touch.clientY - startY.current;
      
      // If swiped down significantly, close the card
      if (deltaY > 150) {
        card.classList.add('webos-card-dismiss');
        setTimeout(() => closeCard(id), 300);
      } else {
        // Reset position
        card.style.transform = '';
        card.style.opacity = '';
      }
    };

    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: true });
    card.addEventListener('touchend', handleTouchEnd);

    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [id, closeCard]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    const card = cardRef.current;
    if (card) {
      card.classList.add('webos-card-dismiss');
      setTimeout(() => closeCard(id), 300);
    }
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Just maximize for now - the card manager will handle the state
    maximizeCard(id);
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "webos-card",
        isActive && "webos-card-zoom-in",
        isMaximized && "webos-card-maximized"
      )}
    >
      {/* Enhanced Header */}
      <div className={cn(
        "webos-card-header-refined",
        "px-5 py-3 flex flex-col justify-center",
        showBreadcrumbs && breadcrumbs.length > 0 ? "min-h-20" : "min-h-16",
        color ? `bg-gradient-to-br ${color}` : "bg-primary"
      )}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-9 w-9 flex-shrink-0 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {Icon && !onBack && (
              <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {showBreadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs 
                  breadcrumbs={breadcrumbs} 
                  className="mb-1" 
                  textColor="text-white/80" 
                />
              )}
              <h2 className="text-xl font-bold text-white truncate leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-white/80 truncate mt-0.5 leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {actions}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMaximize}
              className="h-9 w-9 text-white hover:bg-white/20 hidden md:flex"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-9 w-9 text-white hover:bg-white/20"
              title="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="webos-card-content webos-scrollbar relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
