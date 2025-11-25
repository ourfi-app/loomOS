// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

/**
 * ChatLLM Integration - "Just Type" Functionality
 * 
 * This chat interface uses the Abacus.AI ChatLLM API (https://api.abacus.ai/api/v0/chatLLM)
 * to provide a simple "just type and get answers" experience for community members.
 * 
 * Features:
 * - Simple text input with streaming responses
 * - Real-time message updates
 * - Chat history persistence
 * - Suggested questions for quick start
 * - Clean, modern UI with Nordic design
 */

'use client';

import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Trash2,
  HelpCircle,
  Building,
  CreditCard,
  FileText,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SuggestedQuestion {
  question: string;
  category: 'rules' | 'payments' | 'documents' | 'general';
  icon: React.ReactNode;
}

export default function ChatPage() {
  const router = useRouter();
  const session = useSession()?.data;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name;
  const userRole = (session?.user as any)?.role;

  // Close handler - navigates back to dashboard
  const handleClose = () => {
    router.back();
  };

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      question: "What are the building quiet hours?",
      category: "rules",
      icon: <Building className="h-4 w-4" />
    },
    {
      question: "How do I pay my monthly dues?",
      category: "payments", 
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      question: "What is my current payment status?",
      category: "payments",
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      question: "Can I access meeting minutes?",
      category: "documents",
      icon: <FileText className="h-4 w-4" />
    },
    {
      question: "What are the rules for renovations?",
      category: "rules",
      icon: <Building className="h-4 w-4" />
    },
    {
      question: "How do I report a maintenance issue?",
      category: "general",
      icon: <HelpCircle className="h-4 w-4" />
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
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
            userId: session?.user?.id
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

      setMessages(prev => [...prev, assistantMessage]);

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
                    setMessages(prev => prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content: assistantResponse }
                        : msg
                    ));
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
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rules': return 'bg-webos-orange';
      case 'payments': return 'bg-[var(--semantic-success)]';
      case 'documents': return 'bg-[var(--semantic-accent)]';
      default: return 'bg-[var(--semantic-text-tertiary)]';
    }
  };

  return (
    <>
      {/* Blur Backdrop Overlay */}
      <div 
        className="fixed inset-0 backdrop-blur-md z-40 animate-fade-in"
        onClick={handleClose}
        style={{
          background: 'rgba(0, 0, 0, 0.9)'
        }}
      />

      {/* Right Side Panel */}
      <div 
        className="fixed inset-y-0 right-0 w-full md:w-[600px] z-50 flex flex-col animate-slide-in-right"
        style={{
          background: 'var(--webos-bg-white)',
          boxShadow: 'var(--webos-shadow-xl)',
          border: '1px solid var(--webos-border-glass)',
          fontFamily: 'Helvetica Neue, Arial, sans-serif'
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-5 flex items-center justify-between rounded-3xl"
          style={{
            background: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--webos-border-glass)',
            boxShadow: 'var(--webos-shadow-md)',
            color: 'var(--webos-text-primary)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl backdrop-blur-sm"
              style={{
                background: 'var(--webos-ui-dark)',
                color: 'var(--webos-text-white)'
              }}
            >
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 
                className="text-xl font-light tracking-tight flex items-center gap-2"
                style={{ color: 'var(--webos-text-primary)' }}
              >
                AI Assistant
                <Badge 
                  variant="secondary" 
                  className="text-xs font-light tracking-wide uppercase"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: 'var(--webos-text-primary)',
                    border: '1px solid var(--webos-border-secondary)'
                  }}
                >
                  ChatLLM
                </Badge>
              </h2>
              <p 
                className="text-sm font-light"
                style={{ color: 'var(--webos-text-secondary)' }}
              >
                Just type your question and get instant answers
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-xl font-light hover:opacity-90"
            style={{
              color: 'var(--webos-text-primary)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Status Bar */}
        {isLoading && (
          <div 
            className="px-6 py-3 border-b"
            style={{
              background: 'var(--webos-bg-secondary)',
              borderColor: 'var(--webos-border-primary)'
            }}
          >
            <div 
              className="flex items-center gap-2 text-sm font-light"
              style={{ color: 'var(--webos-text-secondary)' }}
            >
              <Loader2 
                className="h-4 w-4 animate-spin"
                style={{ color: 'var(--webos-app-blue)' }}
              />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
          style={{
            background: 'var(--webos-bg-gradient)'
          }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{
                  background: 'var(--webos-ui-dark)',
                  color: 'var(--webos-text-white)',
                  boxShadow: 'var(--webos-shadow-lg)'
                }}
              >
                <Bot className="h-10 w-10" />
              </div>
              <h3 
                className="text-xl font-light tracking-tight mb-2"
                style={{ color: 'var(--webos-text-primary)' }}
              >
                Hello, {userName}! 👋
              </h3>
              <p 
                className="mb-4 max-w-sm font-light"
                style={{ color: 'var(--webos-text-secondary)' }}
              >
                I'm powered by ChatLLM. Just type your question below and I'll help you instantly!
              </p>
              <div 
                className="flex items-center gap-2 text-sm mb-8"
                style={{ color: 'var(--webos-app-blue)' }}
              >
                <Zap className="h-4 w-4" />
                <span className="font-light">Fast, Simple, Intelligent</span>
              </div>
              
              {/* Suggested Questions */}
              <div className="w-full max-w-md">
                <h4 
                  className="text-xs font-light tracking-wider uppercase mb-3 text-left"
                  style={{ color: 'var(--webos-text-tertiary)' }}
                >
                  Popular Questions
                </h4>
                <div className="space-y-2">
                  {suggestedQuestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 rounded-xl font-light transition-all duration-200 hover:opacity-90"
                      style={{
                        background: 'var(--webos-bg-glass)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--webos-border-glass)',
                        color: 'var(--webos-text-primary)'
                      }}
                      onClick={() => handleSuggestedQuestion(suggestion.question)}
                    >
                      <div 
                        className="p-1.5 rounded-lg mr-3"
                        style={{
                          background: 'var(--webos-ui-dark)',
                          color: 'var(--webos-text-white)'
                        }}
                      >
                        {suggestion.icon}
                      </div>
                      <span className="text-sm font-light">{suggestion.question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-fade-in`}>
                  {message.role === 'assistant' && (
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-nordic-ocean rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-primary to-nordic-ocean text-white' 
                      : 'bg-white border border-nordic-frost text-nordic-night'
                  }`}>
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-9 h-9 bg-nordic-gray rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Action Bar */}
        {messages.length > 0 && (
          <div className="px-6 py-3 bg-gradient-nordic border-t border-nordic-frost">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChat}
              className="text-muted-foreground hover:text-nordic-night hover:bg-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat History
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-5 bg-white border-t border-nordic-frost shadow-lg">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Just type your question... (e.g., What are the quiet hours?)"
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl border-2 border-nordic-frost focus:border-primary transition-colors"
              autoFocus
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-nordic-ocean hover:shadow-lg hover:scale-105 transition-all duration-200"
              title="Send message (or press Enter)"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 text-center flex items-center justify-center gap-1">
            <Zap className="h-3 w-3" />
            Powered by ChatLLM - Just type and get instant, intelligent responses
          </p>
        </div>
      </div>
    </>
  );
}
