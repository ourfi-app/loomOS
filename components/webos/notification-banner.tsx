
'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNotifications } from '@/hooks/webos/use-notifications';

export function NotificationBanner() {
  const { notifications, dismissNotification } = useNotifications();
  const [visible, setVisible] = useState(false);
  const currentNotification = notifications[0];

  useEffect(() => {
    if (currentNotification) {
      setVisible(true);
      
      // Auto-dismiss after 5 seconds for passive notifications
      if (currentNotification.tier === 'passive') {
        const timer = setTimeout(() => {
          handleDismiss();
        }, 5000);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
    
    return undefined;
  }, [currentNotification]);

  const handleDismiss = () => {
    if (currentNotification) {
      const banner = document.querySelector('.webos-notification-banner');
      if (banner) {
        banner.classList.add('dismissing');
        setTimeout(() => {
          dismissNotification(currentNotification.id);
        }, 250);
      }
    }
  };

  const handleSwipe = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    
    const deltaX = touch.clientX - (e.target as any).startX;
    
    if (Math.abs(deltaX) > 100) {
      handleDismiss();
    }
  };

  if (!visible || !currentNotification) return null;

  return (
    <div
      className="webos-notification-banner"
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (touch) {
          (e.target as any).startX = touch.clientX;
        }
      }}
      onTouchEnd={handleSwipe}
    >
      <div className="flex items-start gap-4">
        {currentNotification.icon && (
          <div className="flex-shrink-0">
            <currentNotification.icon className="w-6 h-6 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-bold text-white mb-1">{currentNotification.title}</h4>
          <p className="text-sm text-white/80">{currentNotification.message}</p>
          {currentNotification.actions && currentNotification.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {currentNotification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.handler();
                    handleDismiss();
                  }}
                  className="webos-button-primary text-sm h-8 px-4"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
