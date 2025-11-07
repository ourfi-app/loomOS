
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';
import { useAssistant } from '@/hooks/webos/use-assistant';
import { 
  Search, 
  X, 
  Sparkles, 
  Send, 
  Loader2, 
  ExternalLink, 
  Bot, 
  User as UserIcon,
  CreditCard,
  FileText,
  Users,
  Home,
  ArrowRight
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore, type Message } from '@/lib/chat-store';

export function UniversalSearch() {
  const { isOpen, closeSearch, search, mode, setMode } = useUniversalSearch();
  const { isDocked, undockAssistant, openAssistant, pendingMessage, clearPendingMessage } = useAssistant();
  const { data: session } = useSession() || {};
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Chat state
  const { messages, addMessage } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (mode === 'search' && query.trim()) {
      const searchResults = search(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, search, mode]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (mode === 'ai') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mode]);

  // Handle pending message
  useEffect(() => {
    if (pendingMessage && isOpen && mode === 'ai') {
      setQuery(pendingMessage);
      clearPendingMessage();
      sendMessage(pendingMessage);
    }
  }, [pendingMessage, isOpen, mode]);

  // Listen for custom event to open Universal Search in AI mode
  useEffect(() => {
    const handleOpenAI = (event: Event) => {
      const customEvent = event as CustomEvent;
      const message = customEvent.detail?.message;
      
      // Open in AI mode
      setMode('ai');
      
      if (!isOpen) {
        // Open the search if not already open
        const { openSearch } = useUniversalSearch.getState();
        openSearch('ai');
      }
      
      // If there's a message, send it immediately
      if (message) {
        sendMessage(message);
      }
    };

    window.addEventListener('openUniversalSearchAI', handleOpenAI);
    return () => window.removeEventListener('openUniversalSearchAI', handleOpenAI);
  }, [isOpen]);

  const handleResultClick = (result: any) => {
    // Handle AI Assistant specially - switch to AI mode
    if (result.id === 'ai-assistant') {
      setMode('ai');
      setQuery('');
      return;
    }
    
    if (result.action) {
      result.action();
    } else if (result.path) {
      router.push(result.path);
    }
    handleClose();
  };

  const handleClose = () => {
    closeSearch();
    setQuery('');
    setResults([]);
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
    setQuery('');
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
            role: (session?.user as any)?.role,
            name: session?.user?.name,
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
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'ai') {
      sendMessage(query);
    } else if (results.length > 0) {
      handleResultClick(results[0]);
    }
  };

  const handleUndock = () => {
    undockAssistant();
    closeSearch();
  };

  if (!isOpen) return null;

  return (
    <div className="webos-universal-search">
      {/* Header with Mode Switcher */}
      <div className="webos-search-bar">
        <div className="flex items-center gap-2">
          {mode === 'search' ? (
            <Search className="w-6 h-6 text-white/70" />
          ) : (
            <Sparkles className="w-6 h-6 text-amber-400" />
          )}
          
          {/* Mode Toggle Buttons */}
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setMode('search')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                mode === 'search' 
                  ? "bg-white text-gray-900" 
                  : "text-white/70 hover:text-white"
              )}
            >
              Search
            </button>
            <button
              onClick={() => setMode('ai')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5",
                mode === 'ai' 
                  ? "bg-white text-gray-900" 
                  : "text-white/70 hover:text-white"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === 'search' ? "Just Type..." : "Ask me anything..."}
            className="webos-search-input"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleClose();
              }
            }}
          />
          
          {mode === 'ai' && query.trim() && (
            <Button
              type="submit"
              disabled={isLoading}
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white h-8 px-3"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          )}
        </form>

        <div className="flex items-center gap-1">
          {mode === 'ai' && (
            <button
              onClick={handleUndock}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              title="Open in floating window"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="webos-search-results">
        {mode === 'search' ? (
          // Search Mode
          <>
            {query.trim() === '' ? (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Start typing to search...</p>
                <p className="text-sm mt-2">Search apps, contacts, documents, and more</p>
                <button
                  onClick={() => setMode('ai')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Or ask AI Assistant
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No results found</p>
                <p className="text-sm mt-2">Try a different search term</p>
                <button
                  onClick={() => {
                    setMode('ai');
                    // Keep the query for AI
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI about &quot;{query}&quot;
                </button>
              </div>
            ) : (
              <div>
                {Object.entries(
                  results.reduce((acc: any, result) => {
                    if (!acc[result.category]) acc[result.category] = [];
                    acc[result.category].push(result);
                    return acc;
                  }, {})
                ).map(([category, categoryResults]: [string, any]) => (
                  <div key={category} className="webos-search-category">
                    <h3 className="webos-search-category-title">{category}</h3>
                    {categoryResults.map((result: any, index: number) => (
                      <div
                        key={index}
                        className="webos-search-result"
                        onClick={() => handleResultClick(result)}
                      >
                        {result.icon && (
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <result.icon className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{result.title}</div>
                          {result.description && (
                            <div className="text-sm text-muted-foreground">{result.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // AI Assistant Mode - Enhanced Visual Design
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 px-5 py-4">
              {messages.length === 0 && !isLoading ? (
                <div className="space-y-6 py-6">
                  {/* Welcome Section */}
                  <div className="webos-assistant-welcome">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-base text-foreground mb-1.5">
                          Hi {session?.user?.name || 'there'}! 👋
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          I'm your AI assistant. Ask me anything about your community, payments, documents, or how to use the app.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                      Quick Actions
                    </p>
                    {[
                      { q: 'Show my payment history', icon: CreditCard, desc: 'View all your past payments', color: 'from-blue-500 to-blue-600' },
                      { q: 'Find building rules', icon: FileText, desc: 'Search community documents', color: 'from-emerald-500 to-emerald-600' },
                      { q: 'Search residents', icon: Users, desc: 'Find someone in your community', color: 'from-purple-500 to-purple-600' },
                      { q: 'Give me a tour', icon: Home, desc: 'Learn about app features', color: 'from-amber-500 to-amber-600' },
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion.q)}
                        className="webos-assistant-suggestion group"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-md",
                          suggestion.color
                        )}>
                          <suggestion.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {suggestion.q}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {suggestion.desc}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>

                  {/* Tip */}
                  <div className="webos-assistant-tip">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Tip:</span> I understand context! Ask me anything about what you're currently viewing.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 max-w-3xl mx-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2.5 animate-fade-in",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 max-w-[85%] shadow-sm",
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-blue-600 text-white'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {message.actions && message.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2.5">
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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <UserIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2.5 justify-start animate-fade-in">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
