
'use client';

import { useAssistant } from '@/hooks/webos/use-assistant';
import { cn } from '@/lib/utils';
import { MdAutoAwesome } from 'react-icons/md';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

export function FloatingAssistantBubble() {
  const { toggleAssistant } = useAssistant();
  const assistantApp = APP_REGISTRY.assistant;

  if (!assistantApp) return null;

  const IconComponent = assistantApp.icon;

  return (
    <button
      onClick={toggleAssistant}
      className="fixed bottom-24 right-6 z-50 group"
      title="AI Assistant"
      aria-label="Open AI Assistant"
    >
      <div className={cn(
        "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center transition-all duration-500 ease-out relative overflow-hidden shadow-lg",
        assistantApp.gradient,
        "group-hover:scale-105 group-active:scale-95"
      )}>
        {/* Dark background layer - LoomOS style */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 rounded-full" />
        
        {/* Subtle color accent */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-30 rounded-full",
          assistantApp.gradient
        )} />
        
        {/* Icon */}
        <IconComponent className="w-7 h-7 text-white drop-shadow-md relative z-10 transition-transform duration-500" />
        
        {/* Very subtle shine effect on hover only */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
      </div>
      
      {/* Subtle status indicator - no animation */}
      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-400/80 rounded-full border-2 border-background flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </div>
    </button>
  );
}
