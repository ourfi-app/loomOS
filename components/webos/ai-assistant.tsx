// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
// TODO: Review setTimeout calls for proper cleanup in useEffect return functions

'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Loader2,
  Lightbulb,
  Zap,
  FileText,
  CreditCard,
  Users,
  Bell,
  Home,
  ChevronDown,
  ArrowRight,
  Bot,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore, type Message } from '@/lib/chat-store';
import { useAssistant } from '@/hooks/webos/use-assistant';

interface ContextualSuggestion {
  title: string;
  description: string;
  icon: any;
  action: string | (() => void);
  category: 'action' | 'info' | 'navigation';
}

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AssistantProps) {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const { isDocked, pendingMessage, clearPendingMessage } = useAssistant();
  const { messages, addMessage, clearMessages } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'there';
  const userRole = (session?.user as any)?.role;

  // Only show when undocked
  if (isDocked) return null;

  // Get contextual suggestions based on current page
  const getContextualSuggestions = (): ContextualSuggestion[] => {
    const suggestions: ContextualSuggestion[] = [];

    if (pathname?.includes('/payments')) {
      suggestions.push({
        title: 'View payment history',
        description: 'See all your past payments',
        icon: CreditCard,
        action: 'Show me my payment history',
        category: 'action'
      });
      suggestions.push({
        title: 'Payment due dates',
        description: 'When is my next payment due?',
        icon: Bell,
        action: 'When is my next payment due?',
        category: 'info'
      });
    }

    if (pathname?.includes('/documents')) {
      suggestions.push({
        title: 'Find documents',
        description: 'Search through community documents',
        icon: FileText,
        action: 'Help me find meeting minutes',
        category: 'action'
      });
      suggestions.push({
        title: 'Building rules',
        description: 'Learn about condo regulations',
        icon: Info,
        action: 'What are the building quiet hours?',
        category: 'info'
      });
    }

    if (pathname?.includes('/directory')) {
      suggestions.push({
        title: 'Search residents',
        description: 'Find someone in your community',
        icon: Users,
        action: 'Help me find a resident',
        category: 'action'
      });
    }

    if (pathname === '/dashboard') {
      suggestions.push({
        title: 'Quick tour',
        description: 'Learn about app features',
        icon: Home,
        action: 'Give me a tour of the app',
        category: 'navigation'
      });
      suggestions.push({
        title: 'Common tasks',
        description: 'What can you help me with?',
        icon: Zap,
        action: 'What can you help me with?',
        category: 'info'
      });
    }

    // Always available suggestions
    suggestions.push({
      title: 'Smart suggestions',
      description: 'Get personalized recommendations',
      icon: Lightbulb,
      action: 'What should I do today?',
      category: 'info'
    });

    return suggestions.slice(0, 4);
  };

  const contextualSuggestions = getContextualSuggestions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Handle pending message
  useEffect(() => {
    if (pendingMessage && isOpen) {
      setInputValue(pendingMessage);
      clearPendingMessage();
      sendMessage(pendingMessage);
    }
  }, [pendingMessage, isOpen]);

  // Dragging functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          sessionId,
          userContext: {
            role: userRole,
            name: userName,
            userId: session?.user?.id,
            currentPath: pathname
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

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
                  setIsLoading(false);
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
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (action: string | (() => void)) => {
    if (typeof action === 'string') {
      sendMessage(action);
    } else {
      action();
    }
  };

  const getPageContext = () => {
    if (pathname?.includes('/payments')) return 'payments';
    if (pathname?.includes('/documents')) return 'documents';
    if (pathname?.includes('/directory')) return 'directory';
    if (pathname?.includes('/admin')) return 'admin';
    return 'dashboard';
  };

  const getGreeting = () => {
    const context = getPageContext();
    const greetings: Record<string, string> = {
      payments: `I can help you with payment inquiries, due dates, and transaction history.`,
      documents: `I can help you find documents, explain rules, and answer policy questions.`,
      directory: `I can help you search residents, update your profile, and manage contacts.`,
      admin: `I can help you with administrative tasks, reports, and system management.`,
      dashboard: `I'm here to help you navigate the app and answer any questions.`
    };
    return greetings[context] || greetings.dashboard;
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-6 z-50 group"
      >
        <div className="relative">
          <div className="webos-assistant-bubble">
            <Sparkles className="w-6 h-6 text-white" />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--semantic-primary)] rounded-full border-2 border-white animate-pulse" />
        </div>
      </button>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed z-50 webos-assistant-container",
        isDragging && "cursor-grabbing"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Assistant Panel */}
      <div className={cn(
        "webos-assistant-panel",
        messages.length > 0 ? "webos-assistant-panel-expanded" : "webos-assistant-panel-compact"
      )}>
        {/* Header */}
        <div 
          className={cn(
            "webos-assistant-header",
            !isDragging && "cursor-grab active:cursor-grabbing"
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
              <p className="text-xs text-white/70 truncate">
                {isLoading ? 'Thinking...' : 'Always here to help'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages or Welcome Screen */}
        <ScrollArea className="flex-1 px-4 py-3">
          {messages.length === 0 ? (
            <div className="space-y-4">
              {/* Welcome Message */}
              <div className="webos-assistant-welcome">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground mb-1">
                      Hi {userName}! 👋
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getGreeting()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contextual Suggestions */}
              {contextualSuggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                    Quick Actions
                  </p>
                  {contextualSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.action)}
                      className="webos-assistant-suggestion"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        suggestion.category === 'action' && "bg-[var(--semantic-primary)]/10 text-[var(--semantic-primary)]",
                        suggestion.category === 'info' && "bg-[var(--semantic-primary)]/10 text-[var(--semantic-primary)]",
                        suggestion.category === 'navigation' && "bg-[var(--semantic-success)]/10 text-[var(--semantic-success)]"
                      )}>
                        <suggestion.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {suggestion.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Tips */}
              <div className="webos-assistant-tip">
                <Lightbulb className="w-4 h-4 text-[var(--semantic-warning)] flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Tip:</span> I understand context! Ask me anything about what you're currently viewing.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 animate-fade-in",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-3 py-2 max-w-[85%]",
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-blue-600 text-white'
                        : 'bg-muted text-foreground'
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant={action.variant || 'secondary'}
                            onClick={action.action}
                            className="h-7 text-xs"
                          >
                            {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="webos-assistant-input-area">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 h-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              size="icon"
              className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 hover:shadow-lg transition-all"
            >
              {isLoading ? (
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
