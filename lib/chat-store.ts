
'use client';

import { create } from 'zustand';

interface QuickAction {
  label: string;
  icon: any;
  action: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: QuickAction[];
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  updateLastMessage: (content) => set((state) => ({
    messages: state.messages.map((msg, index) =>
      index === state.messages.length - 1
        ? { ...msg, content }
        : msg
    )
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  setMessages: (messages) => set({ messages }),
}));
