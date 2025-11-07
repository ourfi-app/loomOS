
'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, HelpCircle, PlayCircle, X, ChevronRight, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  faqItems,
  helpArticles,
  searchHelpContent,
  FAQ_CATEGORIES,
  APP_CATEGORIES,
  type FAQItem,
  type HelpArticle
} from '@/lib/help-content';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface HelpPanelProps {
  onClose: () => void;
  onStartTutorial?: () => void;
  initialTab?: 'faq' | 'docs' | 'search';
  initialAppId?: string;
  isDesktopMode?: boolean;
}

export function HelpPanel({ onClose, onStartTutorial, initialTab = 'faq', initialAppId, isDesktopMode = false }: HelpPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState(initialTab);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchHelpContent(searchQuery);
  }, [searchQuery]);

  // Filtered FAQs by category
  const filteredFAQs = useMemo(() => {
    if (selectedCategory === 'All') return faqItems;
    return faqItems.filter(faq => faq.category === selectedCategory);
  }, [selectedCategory]);

  // Filtered articles by category
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') return helpArticles;
    return helpArticles.filter(article => article.category === selectedCategory);
  }, [selectedCategory]);

  // App-specific articles
  const appArticles = useMemo(() => {
    if (!initialAppId) return [];
    return helpArticles.filter(article => article.appId === initialAppId);
  }, [initialAppId]);

  const handleArticleClick = (article: HelpArticle) => {
    setSelectedArticle(article);
    setActiveTab('docs');
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[249] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Help Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none"
      >
      <div className="w-full max-w-4xl max-h-[calc(100vh-8rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Help & Support</h2>
              <p className="text-xs text-muted-foreground">Get help and learn about features</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setActiveTab('search');
              }}
              className="pl-9 pr-4 h-9 text-sm"
            />
          </div>
        </div>

        {/* Quick Actions */}
        {onStartTutorial && (
          <div className="px-6 py-2.5 bg-muted/30 border-b border-border flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onStartTutorial}
              className="gap-2 h-8 text-xs"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Restart Welcome Tutorial
            </Button>
          </div>
        )}

        {/* Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'faq' | 'docs' | 'search')} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-6 border-b border-border flex-shrink-0">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="faq" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="docs" className="gap-2">
                <Book className="w-4 h-4" />
                Documentation
                {appArticles.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {appArticles.length}
                  </Badge>
                )}
              </TabsTrigger>
              {searchQuery && (
                <TabsTrigger value="search" className="gap-2">
                  <Search className="w-4 h-4" />
                  Search Results
                  <Badge variant="secondary" className="ml-2">
                    {searchResults.length}
                  </Badge>
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            {/* FAQ Tab */}
            <TabsContent value="faq" className="h-full m-0">
              <div className="flex h-full">
                {/* Category Sidebar */}
                <div className="w-48 border-r border-border p-4">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Categories</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedCategory === 'All'
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                      )}
                    >
                      All ({faqItems.length})
                    </button>
                    {FAQ_CATEGORIES.map(category => {
                      const count = faqItems.filter(faq => faq.category === category).length;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                            selectedCategory === category
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-muted'
                          )}
                        >
                          {category} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FAQ Content */}
                <ScrollArea className="flex-1">
                  <div className="p-6">
                    <h3 className="text-base font-semibold mb-4">
                      {selectedCategory === 'All' ? 'Frequently Asked Questions' : selectedCategory}
                    </h3>
                    <Accordion type="single" collapsible className="space-y-2">
                      {filteredFAQs.map(faq => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline text-sm py-3">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="docs" className="h-full m-0">
              {selectedArticle ? (
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToList}
                      className="mb-4 gap-2 h-8 text-xs"
                    >
                      ← Back to list
                    </Button>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <h1 className="text-xl font-bold mb-3">{selectedArticle.title}</h1>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <Badge variant="outline" className="text-xs">{selectedArticle.category}</Badge>
                        {selectedArticle.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="text-sm">
                        <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex h-full">
                  {/* Category Sidebar */}
                  <div className="w-48 border-r border-border p-4">
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Categories</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          selectedCategory === 'All'
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted'
                        )}
                      >
                        All ({helpArticles.length})
                      </button>
                      {APP_CATEGORIES.map(category => {
                        const count = helpArticles.filter(article => article.category === category).length;
                        if (count === 0) return null;
                        return (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                              selectedCategory === category
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'hover:bg-muted'
                            )}
                          >
                            {category} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Articles List */}
                  <ScrollArea className="flex-1">
                    <div className="p-6">
                      <h3 className="text-base font-semibold mb-4">
                        {selectedCategory === 'All' ? 'All Documentation' : selectedCategory}
                      </h3>
                      
                      {/* App-specific articles first */}
                      {initialAppId && appArticles.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Help for this app
                          </h4>
                          <div className="space-y-2">
                            {appArticles.map(article => (
                              <button
                                key={article.id}
                                onClick={() => handleArticleClick(article)}
                                className="w-full p-3 bg-primary/5 border border-primary/10 rounded-lg text-left hover:bg-primary/10 transition-colors group"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h4 className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
                                      {article.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {article.content.substring(0, 150)}...
                                    </p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* All articles */}
                      <div className="space-y-2">
                        {filteredArticles.map(article => (
                          <button
                            key={article.id}
                            onClick={() => handleArticleClick(article)}
                            className="w-full p-3 bg-muted/50 rounded-lg text-left hover:bg-muted transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                                    {article.title}
                                  </h4>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                                    {article.category}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {article.content.substring(0, 150)}...
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>

            {/* Search Results Tab */}
            {searchQuery && (
              <TabsContent value="search" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {searchResults.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-base font-semibold mb-2">No results found</h3>
                        <p className="text-sm text-muted-foreground">
                          Try different keywords or browse FAQs and documentation
                        </p>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-base font-semibold mb-4">
                          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                        </h3>
                        <div className="space-y-3">
                          {searchResults.map(result => {
                            const isFAQ = 'question' in result;
                            const faq = isFAQ ? result as FAQItem : null;
                            const article = !isFAQ ? result as HelpArticle : null;

                            return (
                              <div
                                key={result.id}
                                className="p-3 bg-muted/50 rounded-lg"
                              >
                                {faq && (
                                  <>
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <h4 className="text-sm font-medium">{faq.question}</h4>
                                      <Badge variant="outline" className="flex-shrink-0 text-[10px] px-1.5 py-0">FAQ</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{faq.answer}</p>
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{faq.category}</Badge>
                                  </>
                                )}
                                {article && (
                                  <>
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <h4 className="text-sm font-medium">{article.title}</h4>
                                      <Badge variant="outline" className="flex-shrink-0 text-[10px] px-1.5 py-0">Doc</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                                      {article.content.substring(0, 200)}...
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{article.category}</Badge>
                                      <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => handleArticleClick(article)}
                                        className="h-auto p-0 gap-1 text-xs"
                                      >
                                        Read more <ExternalLink className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </motion.div>
    </>
  );
}
