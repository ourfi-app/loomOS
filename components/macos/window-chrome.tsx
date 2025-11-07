
'use client';

import { X, Minus, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

interface WindowChromeProps {
  title?: string;
  showTitle?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function WindowChrome({ 
  title = '', 
  showTitle = false,
  onClose,
  onMinimize,
  onMaximize 
}: WindowChromeProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="macos-toolbar h-12 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div 
          className="traffic-light traffic-light-red cursor-pointer flex items-center justify-center"
          onMouseEnter={() => setHoveredButton('close')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={onClose}
        >
          {hoveredButton === 'close' && (
            <X className="w-2 h-2 text-[#4A0000]" strokeWidth={3} />
          )}
        </div>
        <div 
          className="traffic-light traffic-light-yellow cursor-pointer flex items-center justify-center"
          onMouseEnter={() => setHoveredButton('minimize')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={onMinimize}
        >
          {hoveredButton === 'minimize' && (
            <Minus className="w-2 h-2 text-[#662F00]" strokeWidth={3} />
          )}
        </div>
        <div 
          className="traffic-light traffic-light-green cursor-pointer flex items-center justify-center"
          onMouseEnter={() => setHoveredButton('maximize')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={onMaximize}
        >
          {hoveredButton === 'maximize' && (
            <Maximize2 className="w-2 h-2 text-[#003D00]" strokeWidth={3} />
          )}
        </div>
      </div>
      
      {showTitle && title && (
        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground">
          {title}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
