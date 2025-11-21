// TODO: Review setTimeout calls for proper cleanup in useEffect return functions
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wand2, Layout, Type, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/lib/web-builder/store/builderStore';

const loomOSSpring = { stiffness: 300, damping: 25, mass: 1 };

interface AIQuickActionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
}

function AIQuickAction({ icon: Icon, title, description, onClick }: AIQuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 rounded-lg border border-[var(--semantic-border-light)] dark:border-[var(--semantic-border-strong)]',
        'bg-white dark:bg-[var(--semantic-text-primary)] hover:border-loomos-orange hover:bg-[var(--semantic-bg-subtle)] dark:hover:bg-[var(--semantic-text-secondary)]',
        'transition-all text-left group min-h-[44px]'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-loomos-orange/10 group-hover:bg-loomos-orange/20 transition-colors">
          <Icon className="w-4 h-4 text-loomos-orange" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[var(--semantic-text-primary)] dark:text-[var(--semantic-text-inverse)]">
            {title}
          </h4>
          <p className="text-xs text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

export function AIDrawer() {
  const { ui, toggleAIDrawer } = useBuilderStore();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt;
    setPrompt('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // TODO: Implement actual AI API call
      // Placeholder for now
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'll help you build that! This is a placeholder response. The AI integration will be completed in the next phase.",
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('AI error:', error);
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {ui.aiDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleAIDrawer}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', ...loomOSSpring }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-[var(--semantic-text-primary)] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--semantic-border-light)] dark:border-[var(--semantic-border-strong)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-loomos-orange/10">
                  <Sparkles className="w-5 h-5 text-loomos-orange" />
                </div>
                <h2 className="font-semibold text-[var(--semantic-text-primary)] dark:text-[var(--semantic-text-inverse)]">
                  AI Assistant
                </h2>
              </div>
              <button
                onClick={toggleAIDrawer}
                className="p-2 hover:bg-[var(--semantic-surface-hover)] dark:hover:bg-[var(--semantic-text-secondary)] rounded-lg transition-colors"
                aria-label="Close AI Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 space-y-2 border-b border-[var(--semantic-border-light)] dark:border-[var(--semantic-border-strong)]">
              <h3 className="text-xs font-semibold text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <AIQuickAction
                icon={Layout}
                title="Generate Layout"
                description="Create a page structure from a description"
                onClick={() => setPrompt('Generate a modern landing page layout with hero, features, and CTA sections')}
              />
              <AIQuickAction
                icon={Type}
                title="Write Content"
                description="Generate headlines, copy, and CTAs"
                onClick={() => setPrompt('Write compelling copy for a SaaS product landing page')}
              />
              <AIQuickAction
                icon={Wand2}
                title="Style Suggestions"
                description="Get AI recommendations for colors and fonts"
                onClick={() => setPrompt('Suggest a modern color scheme and typography for my website')}
              />
            </div>

            {/* Conversation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)]">
                  <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm font-medium">AI Assistant Ready</p>
                  <p className="text-xs mt-1">
                    Describe what you want to build and I'll help you create it
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-loomos-orange/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-loomos-orange" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-loomos-orange text-white'
                          : 'bg-[var(--semantic-surface-hover)] dark:bg-[var(--semantic-text-secondary)] text-[var(--semantic-text-primary)] dark:text-[var(--semantic-text-inverse)]'
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-loomos-orange/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-loomos-orange animate-pulse" />
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-[var(--semantic-surface-hover)] dark:bg-[var(--semantic-text-secondary)]">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--semantic-border-strong)] animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-[var(--semantic-border-strong)] animate-pulse delay-75" />
                      <div className="w-2 h-2 rounded-full bg-[var(--semantic-border-strong)] animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--semantic-border-light)] dark:border-[var(--semantic-border-strong)]">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to build..."
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg border border-[var(--semantic-border-light)] dark:border-[var(--semantic-border-strong)]',
                    'bg-[var(--semantic-bg-subtle)] dark:bg-[var(--semantic-text-primary)] text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-loomos-orange focus:border-transparent',
                    'placeholder:text-[var(--semantic-text-tertiary)]'
                  )}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-colors min-w-[44px] min-h-[44px]',
                    'bg-loomos-orange text-white hover:bg-loomos-orange-dark',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-center justify-center'
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
