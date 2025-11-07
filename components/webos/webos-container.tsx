'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AppDock } from './app-dock';
import { ModeBanner } from '@/components/mode-banner';
import { MultitaskingView } from './multitasking-view';
import { useDesktopCustomization } from '@/lib/desktop-customization-store';

interface WebOSContainerProps {
  children: ReactNode;
  onOpenCustomization?: () => void;
  onOpenQuickSettings?: () => void;
  onOpenMissionControl?: () => void;
}

export function WebOSContainer({ 
  children, 
  onOpenCustomization, 
  onOpenQuickSettings,
  onOpenMissionControl
}: WebOSContainerProps) {
  const { wallpaper } = useDesktopCustomization();
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});
  
  // Apply wallpaper dynamically to background layer
  useEffect(() => {
    const style: React.CSSProperties = {};
    
    // Apply wallpaper based on type
    switch (wallpaper.type) {
      case 'solid':
        style.background = wallpaper.value;
        break;
      case 'gradient':
        style.background = wallpaper.value;
        break;
      case 'image':
        style.backgroundImage = `url(${wallpaper.value})`;
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
        style.backgroundRepeat = 'no-repeat';
        break;
    }
    
    // Apply blur effect if set (only to background layer)
    if (wallpaper.blur > 0) {
      style.filter = `blur(${wallpaper.blur}px)`;
    }
    
    setBackgroundStyle(style);
  }, [wallpaper]);
  
  return (
    <div className="webos-container">
      {/* Desktop Background Layer - z-index: 0 */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{ 
          ...backgroundStyle,
          zIndex: 0,
        }}
      />
      
      {/* Dim Overlay Layer - z-index: 1 */}
      {wallpaper.dim > 0 && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `rgba(0, 0, 0, ${wallpaper.dim / 100})`,
            zIndex: 1,
          }}
        />
      )}
      
      {/* Content Layer - z-index: 10 and above */}
      <div className="relative" style={{ zIndex: 10 }}>
        <ModeBanner />
        
        {/* Main desktop area - Reserve space for dock at bottom */}
        <div className="webos-touchscreen desktop-area pb-24">
          <MultitaskingView>
            {children}
          </MultitaskingView>
        </div>

        {/* Minimalist App Dock */}
        <AppDock />
      </div>
    </div>
  );
}
