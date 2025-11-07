
'use client';

import Image from 'next/image';
import { useCardManager } from '@/lib/card-manager-store';
import { DraggableWidgetGrid } from '@/components/widgets/draggable-widget-grid';
import { SearchAssistantBar } from '@/components/widgets/search-assistant-bar';

export function InlineAssistant() {
  const { cards } = useCardManager();
  
  // Only show dashboard elements when no cards are open
  const showDashboard = cards.length === 0;

  return (
    <div className="h-full w-full overflow-hidden relative flex flex-col">
      {/* Background Image with Blur - Only visible on dashboard when no cards are open */}
      {showDashboard && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <Image
            src="/montrecott-watercolor.webp"
            alt="Montrecott Building"
            fill
            className="object-cover"
            style={{
              filter: 'blur(5px)',
              transform: 'scale(1.1)',
            }}
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col" style={{ zIndex: 10 }}>
        {/* Search Bar - Only visible on dashboard when no cards are open */}
        {showDashboard && (
          <div className="flex-shrink-0 pt-6 pb-4 px-8">
            <SearchAssistantBar />
          </div>
        )}
        
        {/* Draggable Widget Grid - Takes remaining space */}
        <div className="flex-1 overflow-hidden relative">
          <DraggableWidgetGrid />
        </div>
      </div>
    </div>
  );
}
