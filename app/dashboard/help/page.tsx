
'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, HelpCircle, PlayCircle, ChevronRight, ExternalLink } from 'lucide-react';
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

import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_COLORS } from '@/lib/app-design-system';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'faq' | 'docs' | 'search'>('faq');

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

  const handleArticleClick = (article: HelpArticle) => {
    setSelectedArticle(article);
    setActiveTab('docs');
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  return (
    <DesktopAppWrapper
      title="Help & Support"
      icon={<HelpCircle className="w-5 h-5" />}
      gradient={APP_COLORS.help.light}
    >
      <div className="flex flex-col h-full bg-background">

      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-border flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setActiveTab('search');
            }}
            className="pl-10 pr-4 h-10"
          />
        </div>
      </div>

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
              <div className="w-56 border-r border-border p-4 flex-shrink-0">
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
                  <h3 className="text-lg font-semibold mb-4">
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
                    className="mb-4 gap-2"
                  >
                    ← Back to list
                  </Button>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h1 className="text-2xl font-bold mb-3">{selectedArticle.title}</h1>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <Badge variant="outline">{selectedArticle.category}</Badge>
                      {selectedArticle.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
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
                <div className="w-56 border-r border-border p-4 flex-shrink-0">
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
                    <h3 className="text-lg font-semibold mb-4">
                      {selectedCategory === 'All' ? 'All Documentation' : selectedCategory}
                    </h3>
                    
                    <div className="space-y-2">
                      {filteredArticles.map(article => (
                        <button
                          key={article.id}
                          onClick={() => handleArticleClick(article)}
                          className="w-full p-4 bg-muted/50 rounded-lg text-left hover:bg-muted transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                                  {article.title}
                                </h4>
                                <Badge variant="outline" className="text-xs px-2 py-0 shrink-0">
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
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">No results found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try different keywords or browse FAQs and documentation
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold mb-4">
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
                              className="p-4 bg-muted/50 rounded-lg"
                            >
                              {faq && (
                                <>
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h4 className="text-sm font-medium">{faq.question}</h4>
                                    <Badge variant="outline" className="flex-shrink-0 text-xs px-2 py-0">FAQ</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">{faq.answer}</p>
                                  <Badge variant="secondary" className="text-xs px-2 py-0">{faq.category}</Badge>
                                </>
                              )}
                              {article && (
                                <>
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h4 className="text-sm font-medium">{article.title}</h4>
                                    <Badge variant="outline" className="flex-shrink-0 text-xs px-2 py-0">Doc</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                                    {article.content.substring(0, 200)}...
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs px-2 py-0">{article.category}</Badge>
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
    </DesktopAppWrapper>
  );
}
