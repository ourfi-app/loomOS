// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  Loader2,
  User as UserIcon,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAssistant } from '@/hooks/webos/use-assistant';
import { useChatStore, type Message } from '@/lib/chat-store';

export function SearchAssistantWidget() {
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { pendingMessage, clearPendingMessage, openAssistant } = useAssistant();
  const { messages, addMessage } = useChatStore();

  const userName = session?.user?.name || 'there';
  const userRole = (session?.user as any)?.role;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle pending message when assistant is opened with initial message
  useEffect(() => {
    if (pendingMessage) {
      sendMessage(pendingMessage);
      clearPendingMessage();
    }
  }, [pendingMessage]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleBreakOut = () => {
    openAssistant();
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const hasMessages = messages.length > 0;

  const recommendedPrompts = userRole === 'ADMIN' 
    ? [
        "What's the status of recent maintenance requests?",
        "Show me this month's payment statistics",
        "Help me draft an announcement about upcoming maintenance",
        "What are the latest directory update requests?",
      ]
    : [
        "When is my next HOA payment due?",
        "Show me recent community announcements",
        "How do I submit a maintenance request?",
        "What documents do I need for leasing my unit?",
      ];

  return (
    <div className="h-full flex flex-col bg-background/60 backdrop-blur-xl rounded-xl border border-border/30 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground/90">
              Welcome, <span className="text-primary">{userName.split(' ')[0]}</span>
            </h2>
          </div>
          {hasMessages && (
            <button
              onClick={handleBreakOut}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Open in separate window"
            >
              <ArrowUpRight className="w-4 h-4 text-foreground/60" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-4">
        {!hasMessages && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-base font-medium text-foreground/80">How can I help you today?</h3>
              <p className="text-sm text-muted-foreground">Try asking me about...</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {recommendedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left p-3 rounded-lg bg-card/40 hover:bg-card/60 border border-border/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-0.5 text-primary/60 flex-shrink-0" />
                    <span className="text-sm text-foreground/80">
                      {prompt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {hasMessages && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/90 to-orange-600/90 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2.5 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-card/80 text-foreground'
                      : 'bg-background/40 text-foreground/90'
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-400/80 to-zinc-500/80 flex items-center justify-center flex-shrink-0">
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
      <div className="flex-shrink-0 p-4 border-t border-border/30">
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
            'bg-card/60 border border-border/40',
            isFocused && 'ring-2 ring-primary/20 border-primary/40'
          )}>
            <Sparkles className={cn(
              'w-4 h-4 flex-shrink-0 transition-colors',
              isFocused ? 'text-primary' : 'text-foreground/40'
            )} />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Just type..."
              disabled={isLoading}
              className="flex-1 h-6 border-0 bg-transparent focus-visible:ring-0 px-0 py-0 text-sm"
            />
            {(inputValue.trim() || isLoading) && (
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="flex-shrink-0 p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
