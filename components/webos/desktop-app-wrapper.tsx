
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCardManager } from '@/lib/card-manager-store';
import { DesktopAppWindow, MenuBarItem } from './desktop-app-window';
import { useIsDesktop } from '@/hooks/use-responsive';

interface DesktopAppWrapperProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  menuBar?: MenuBarItem[];
  toolbar?: React.ReactNode;
  statusBar?: React.ReactNode;
  showMenuBar?: boolean;
  className?: string;
  gradient?: string;
}

export function DesktopAppWrapper({
  children,
  title,
  icon,
  menuBar,
  toolbar,
  statusBar,
  showMenuBar = true,
  className,
  gradient,
}: DesktopAppWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { closeCard, cards, activeCardId } = useCardManager();
  const isDesktop = useIsDesktop();
  
  // Find the current card based on pathname
  const currentCard = cards.find((card) => 
    pathname.includes(card.id) || pathname === card.path
  );
  
  const cardId = currentCard?.id || activeCardId || pathname;
  const cardTitle = title || currentCard?.title || 'App';
  
  const handleClose = () => {
    if (currentCard) {
      closeCard(currentCard.id);
    }
    router.push('/dashboard');
  };
  
  // On mobile/tablet, just render children directly
  if (!isDesktop) {
    return <>{children}</>;
  }
  
  // On desktop, wrap in DesktopAppWindow
  return (
    <DesktopAppWindow
      id={cardId}
      title={cardTitle}
      icon={icon}
      onClose={handleClose}
      menuBar={menuBar}
      toolbar={toolbar}
      statusBar={statusBar}
      showMenuBar={showMenuBar}
      className={className}
      gradient={gradient}
    >
      {/* Pass children directly - they should handle their own layout */}
      {children}
    </DesktopAppWindow>
  );
}
