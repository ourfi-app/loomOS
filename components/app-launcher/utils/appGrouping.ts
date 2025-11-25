/**
 * Utility functions for grouping and organizing apps
 */

import type { AppDefinition, AppCategory } from '../types';
import { CATEGORY_ORDER } from './constants';

/**
 * Group apps by category with ordering
 */
export function groupAndOrderApps(
  apps: AppDefinition[]
): Array<{ category: AppCategory; apps: AppDefinition[]; label: string }> {
  // First group by category
  const grouped: Record<string, AppDefinition[]> = {};
  
  apps.forEach((app) => {
    if (!grouped[app.category]) {
      grouped[app.category] = [];
    }
    grouped[app.category]!.push(app);
  });
  
  // Then order by CATEGORY_ORDER
  return CATEGORY_ORDER
    .map((category) => ({
      category,
      apps: grouped[category] || [],
      label: getCategoryLabel(category),
    }))
    .filter((group) => group.apps.length > 0);
}

/**
 * Get category label for display
 */
export function getCategoryLabel(category: AppCategory): string {
  const labels: Record<AppCategory, string> = {
    essentials: 'Essentials',
    personal: 'Personal',
    community: 'Community',
    productivity: 'Productivity',
    admin: 'Administration',
    settings: 'Settings',
  };
  
  return labels[category] || category;
}

/**
 * Get category color for styling
 */
export function getCategoryColor(category: AppCategory): string {
  const colors: Record<AppCategory, string> = {
    essentials: 'from-blue-500 to-indigo-600',
    personal: 'from-purple-500 to-pink-600',
    community: 'from-green-500 to-emerald-600',
    productivity: 'from-orange-500 to-red-600',
    admin: 'from-red-500 to-pink-600',
    settings: 'from-gray-500 to-slate-600',
  };
  
  return colors[category] || 'from-gray-500 to-gray-600';
}

/**
 * Count apps per category
 */
export function countAppsByCategory(
  apps: AppDefinition[]
): Record<AppCategory, number> {
  const counts: Record<string, number> = {};
  
  apps.forEach((app) => {
    counts[app.category] = (counts[app.category] || 0) + 1;
  });
  
  return counts as Record<AppCategory, number>;
}
