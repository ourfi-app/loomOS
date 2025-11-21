// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

/**
 * WebSocket Client for Real-time Updates
 * Provides real-time synchronization across all connected clients
 */

import { useEffect, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';

export type WebSocketMessage = {
  type: 'update' | 'create' | 'delete' | 'notification' | 'presence';
  entity: 'task' | 'note' | 'document' | 'message' | 'calendar' | 'directory' | 'announcement';
  data: any;
  userId?: string;
  timestamp: string;
};

class WebSocketManager {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<(message: WebSocketMessage) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:3000/api/ws?token=${token}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.notifyListeners(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.attemptReconnect(token);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => this.connect(token), delay);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(entity: string, callback: (message: WebSocketMessage) => void) {
    if (!this.listeners.has(entity)) {
      this.listeners.set(entity, new Set());
    }
    this.listeners.get(entity)!.add(callback);

    return () => {
      this.listeners.get(entity)?.delete(callback);
    };
  }

  private notifyListeners(message: WebSocketMessage) {
    const entityListeners = this.listeners.get(message.entity);
    if (entityListeners) {
      entityListeners.forEach(callback => callback(message));
    }

    // Also notify wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(callback => callback(message));
    }
  }

  send(message: Omit<WebSocketMessage, 'timestamp'>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
      }));
    }
  }
}

export const wsManager = new WebSocketManager();

/**
 * Hook for using WebSocket real-time updates
 */
export function useRealtimeUpdates(
  entity: WebSocketMessage['entity'] | '*',
  onUpdate?: (message: WebSocketMessage) => void
) {
  const { data: session } = useSession() || {};
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (session?.user) {
      wsManager.connect((session as any)?.accessToken || 'demo-token');
      setIsConnected(true);
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, [session]);

  useEffect(() => {
    if (onUpdate) {
      return wsManager.subscribe(entity, onUpdate);
    }
    return undefined;
  }, [entity, onUpdate]);

  const broadcast = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    wsManager.send(message);
  }, []);

  return { isConnected, broadcast };
}
