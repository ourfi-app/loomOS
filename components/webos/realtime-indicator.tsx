
'use client';

import { useRealtimeUpdates } from '@/lib/websocket-client';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RealtimeIndicator() {
  const { isConnected } = useRealtimeUpdates('*');

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 z-50',
        'flex items-center gap-2 px-3 py-2 rounded-full',
        'text-xs font-medium',
        'transition-all duration-300',
        isConnected
          ? 'bg-[var(--semantic-success)]/10 text-[var(--semantic-success)] dark:text-[var(--semantic-success)]'
          : 'bg-[var(--semantic-error)]/10 text-[var(--semantic-error)] dark:text-[var(--semantic-error)]'
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
