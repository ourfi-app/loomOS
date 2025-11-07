
'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { 
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  X,
  Minimize2,
  GripHorizontal,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAssistant } from '@/hooks/webos/use-assistant';
import { useChatStore, type Message } from '@/lib/chat-store';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';

export function FloatingChatWindow() {
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isOpen, isDocked, closeAssistant, dockAssistant, pendingMessage, clearPendingMessage } = useAssistant();
  const { openSearch } = useUniversalSearch();
  const { messages, addMessage } = useChatStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && !isDocked) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isDocked]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isDocked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isDocked]);

  // Handle pending message
  useEffect(() => {
    if (pendingMessage && isOpen && !isDocked) {
      setInputValue(pendingMessage);
      clearPendingMessage();
      // Send it immediately
      sendMessage(pendingMessage);
    }
  }, [pendingMessage, isOpen, isDocked]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoadingResponse) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputValue('');
    setIsLoadingResponse(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          userContext: {
            role: (session?.user as any)?.role,
            name: session?.user?.name,
            userId: session?.user?.id,
            currentPath: pathname
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      addMessage(assistantMessage);

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  setIsLoadingResponse(false);
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    assistantResponse += content;
                    useChatStore.getState().updateLastMessage(assistantResponse);
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage({
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      });
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
    }
  };

  const handleDock = () => {
    // Dock back to Just Type search
    dockAssistant();
    openSearch();
  };

  const handleClose = () => {
    closeAssistant();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep window within viewport bounds
        const maxX = window.innerWidth - windowRef.current.offsetWidth;
        const maxY = window.innerHeight - windowRef.current.offsetHeight;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, dragOffset]);

  // Don't render if docked or closed
  if (!isOpen || isDocked) return null;

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed z-50 w-[420px] bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden",
        "transition-shadow duration-300",
        isDragging && "shadow-3xl ring-2 ring-amber-500/50"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Draggable Header */}
      <div
        className="drag-handle flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-border cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {isLoadingResponse && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">AI Assistant</div>
            <div className="text-xs text-muted-foreground">
              {isLoadingResponse ? 'Thinking...' : 'Always here to help'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <GripHorizontal className="w-4 h-4 text-muted-foreground mr-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDock}
            className="h-7 px-2 hover:bg-muted"
            title="Dock to Just Type"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-7 px-2 hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="bg-background">
        <ScrollArea className="h-[450px] p-4">
          <div className="space-y-3">
            {messages.length === 0 && !isLoadingResponse && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Hi {session?.user?.name || 'there'}! 👋
                </h3>
                <p className="text-sm text-muted-foreground px-4">
                  Ask me anything about your community, payments, documents, or how to use the app.
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 animate-fade-in",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2.5 text-sm",
                    message.role === 'user'
                      ? "bg-gradient-to-br from-primary to-blue-600 text-white"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoadingResponse && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-3 bg-muted/20">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoadingResponse}
              className="flex-1 h-10"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoadingResponse}
              size="icon"
              className="h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-600 hover:shadow-lg transition-all"
            >
              {isLoadingResponse ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
