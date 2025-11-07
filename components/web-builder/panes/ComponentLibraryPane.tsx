'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/lib/web-builder/store/builderStore';

interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  icon: string;
}

// Sample component data - will be replaced with actual registry
const components: Component[] = [
  {
    id: 'hero-centered',
    name: 'Hero - Centered',
    category: 'Hero Sections',
    description: 'Centered hero section with headline and CTA',
    tags: ['hero', 'landing', 'cta'],
    icon: '🎯',
  },
  {
    id: 'hero-split',
    name: 'Hero - Split',
    category: 'Hero Sections',
    description: 'Split layout with image and content',
    tags: ['hero', 'landing', 'image'],
    icon: '📱',
  },
  {
    id: 'navbar-simple',
    name: 'Navbar - Simple',
    category: 'Navigation',
    description: 'Clean navigation bar with links',
    tags: ['navigation', 'header', 'menu'],
    icon: '🧭',
  },
  {
    id: 'navbar-dropdown',
    name: 'Navbar - Dropdown',
    category: 'Navigation',
    description: 'Navigation with dropdown menus',
    tags: ['navigation', 'header', 'dropdown'],
    icon: '📋',
  },
  {
    id: 'features-grid',
    name: 'Features Grid',
    category: 'Content',
    description: 'Grid layout showcasing features',
    tags: ['features', 'grid', 'content'],
    icon: '⚡',
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    category: 'Content',
    description: 'Customer testimonials carousel',
    tags: ['testimonials', 'social-proof', 'carousel'],
    icon: '💬',
  },
  {
    id: 'footer-simple',
    name: 'Footer - Simple',
    category: 'Footer',
    description: 'Basic footer with links',
    tags: ['footer', 'navigation'],
    icon: '📍',
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'Forms',
    description: 'Contact form with validation',
    tags: ['form', 'contact', 'input'],
    icon: '📧',
  },
];

interface ComponentCardProps {
  component: Component;
  onDragStart?: () => void;
}

function ComponentCard({ component, onDragStart }: ComponentCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        'p-3 rounded-lg border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800 cursor-move',
        'hover:border-loomos-orange hover:shadow-md transition-all',
        'group'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">
          {component.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {component.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            {component.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {component.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ComponentCategoryProps {
  name: string;
  components: Component[];
}

function ComponentCategory({ name, components }: ComponentCategoryProps) {
  const { setIsDragging } = useBuilderStore();

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-3">
        {name}
      </h3>
      <div className="space-y-2 px-4">
        {components.map((component) => (
          <ComponentCard
            key={component.id}
            component={component}
            onDragStart={() => setIsDragging(true)}
          />
        ))}
      </div>
    </div>
  );
}

export function ComponentLibraryPane() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleAIDrawer } = useBuilderStore();

  // Group components by category
  const componentsByCategory = useMemo(() => {
    const filtered = components.filter((component) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        component.name.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query) ||
        component.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    return filtered.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    }, {} as Record<string, Component[]>);
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700',
              'bg-gray-50 dark:bg-gray-900 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-loomos-orange focus:border-transparent',
              'placeholder:text-gray-400'
            )}
          />
        </div>

        {searchQuery && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {Object.values(componentsByCategory).flat().length} results
          </div>
        )}
      </div>

      {/* Categories & Components */}
      <div className="flex-1 overflow-y-auto py-4">
        {Object.keys(componentsByCategory).length > 0 ? (
          Object.entries(componentsByCategory).map(([category, items]) => (
            <ComponentCategory
              key={category}
              name={category}
              components={items}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm">No components found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* AI Quick Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <button
          onClick={toggleAIDrawer}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
            'bg-loomos-orange text-white hover:bg-loomos-orange-dark transition-colors',
            'font-medium text-sm min-h-[44px]'
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI to Build</span>
        </button>
      </div>
    </div>
  );
}
