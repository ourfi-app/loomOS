'use client';

import { motion } from 'framer-motion';
import { Grid3x3, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppLauncherTabsProps, TabType } from '../types';
import { A11Y_LABELS } from '../utils/constants';

const TABS = [
  { id: 'all' as TabType, label: 'All Apps', Icon: Grid3x3 },
  { id: 'favorites' as TabType, label: 'Favorites', Icon: Star },
  { id: 'recent' as TabType, label: 'Recent', Icon: Clock },
];

export function AppLauncherTabs({
  activeTab,
  onTabChange,
  favoritesCount,
  recentCount,
}: AppLauncherTabsProps) {
  const getTabCount = (tabId: TabType) => {
    switch (tabId) {
      case 'favorites':
        return favoritesCount;
      case 'recent':
        return recentCount;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2 mb-4 flex-shrink-0" role="tablist">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = getTabCount(tab.id);

        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            aria-label={A11Y_LABELS.tabButton(tab.label)}
            style={{
              backgroundColor: isActive ? 'var(--glass-white-95)' : 'var(--glass-white-80)',
              color: isActive ? 'var(--chrome-dark)' : 'var(--text-secondary)',
              borderColor: isActive ? 'var(--glass-black-15)' : 'transparent'
            }}
            className={cn(
              'relative flex items-center gap-2',
              'px-4 py-2.5 rounded-lg',
              'transition-all',
              'flex-1 sm:flex-initial',
              'border',
              isActive && 'shadow-sm'
            )}
          >
            <tab.Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
            {count !== null && count > 0 && (
              <span 
                className={cn(
                  'ml-auto px-2 py-0.5 rounded-full text-xs font-semibold',
                  isActive ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600'
                )}
              >
                {count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                style={{ backgroundColor: 'var(--webos-surface-active)', zIndex: -1 }}
                className="absolute inset-0 rounded-lg"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
