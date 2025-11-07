
'use client';

import { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, Menu } from 'lucide-react';

interface WebOSMultiPaneLayoutProps {
  children: ReactNode;
  className?: string;
}

interface WebOSPaneProps {
  type: 'navigation' | 'list' | 'detail';
  children: ReactNode;
  className?: string;
  visible?: boolean;
  onClose?: () => void;
}

export function WebOSMultiPaneLayout({ children, className }: WebOSMultiPaneLayoutProps) {
  return (
    <div className={cn('webos-multi-pane-layout', className)}>
      {children}
    </div>
  );
}

export function WebOSPane({ type, children, className, visible, onClose }: WebOSPaneProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const paneClass = {
    navigation: 'webos-pane webos-pane-navigation',
    list: 'webos-pane webos-pane-list',
    detail: 'webos-pane webos-pane-detail',
  }[type];

  const showBackButton = isMobile && type === 'detail' && onClose;

  return (
    <div className={cn(
      paneClass,
      isMobile && visible && 'visible',
      className
    )}>
      {showBackButton && (
        <div className="webos-toolbar">
          <button
            onClick={onClose}
            className="webos-button-icon"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
      {children}
    </div>
  );
}

interface WebOSPaneHeaderProps {
  title: string;
  actions?: ReactNode;
  onMenuClick?: () => void;
  showMenu?: boolean;
  className?: string;
}

export function WebOSPaneHeader({ 
  title, 
  actions, 
  onMenuClick, 
  showMenu,
  className 
}: WebOSPaneHeaderProps) {
  return (
    <div className={cn('webos-header', className)}>
      {showMenu && onMenuClick && (
        <button
          onClick={onMenuClick}
          className="webos-button-icon mr-2"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      <div className="webos-header-title">{title}</div>
      {actions && <div className="webos-header-actions">{actions}</div>}
    </div>
  );
}

export function WebOSPaneContent({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn('flex-1 overflow-auto', className)}>
      {children}
    </div>
  );
}

export function WebOSPaneFooter({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn('webos-footer', className)}>
      {children}
    </div>
  );
}
