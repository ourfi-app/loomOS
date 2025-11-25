/**
 * Unit tests for app grouping utilities
 */

import { describe, it, expect } from '@jest/globals';
import type { AppDefinition } from '../types';
import {
  groupAndOrderApps,
  getCategoryLabel,
  countAppsByCategory,
} from '../utils/appGrouping';

// Mock app data
const mockApps: AppDefinition[] = [
  {
    id: 'app1',
    title: 'Dashboard',
    description: 'Main dashboard',
    path: '/dashboard',
    icon: () => null,
    gradient: 'from-blue-500 to-indigo-600',
    category: 'essentials',
  },
  {
    id: 'app2',
    title: 'Calendar',
    description: 'Schedule events',
    path: '/calendar',
    icon: () => null,
    gradient: 'from-green-500 to-emerald-600',
    category: 'productivity',
  },
  {
    id: 'app3',
    title: 'Settings',
    description: 'Configure settings',
    path: '/settings',
    icon: () => null,
    gradient: 'from-gray-500 to-slate-600',
    category: 'settings',
  },
  {
    id: 'app4',
    title: 'Admin Panel',
    description: 'Administrative panel',
    path: '/admin',
    icon: () => null,
    gradient: 'from-red-500 to-pink-600',
    category: 'admin',
  },
];

describe('groupAndOrderApps', () => {
  it('should group apps by category', () => {
    const result = groupAndOrderApps(mockApps);
    expect(result.length).toBeGreaterThan(0);
    
    const categories = result.map(g => g.category);
    expect(categories).toContain('essentials');
    expect(categories).toContain('productivity');
    expect(categories).toContain('admin');
    expect(categories).toContain('settings');
  });

  it('should include category labels', () => {
    const result = groupAndOrderApps(mockApps);
    result.forEach(group => {
      expect(group.label).toBeDefined();
      expect(typeof group.label).toBe('string');
    });
  });

  it('should only include categories with apps', () => {
    const singleApp = [mockApps[0]!];
    const result = groupAndOrderApps(singleApp);
    expect(result).toHaveLength(1);
    expect(result[0]?.category).toBe('essentials');
  });

  it('should follow category order', () => {
    const result = groupAndOrderApps(mockApps);
    // Essentials should come before productivity
    const essentialsIndex = result.findIndex(g => g.category === 'essentials');
    const productivityIndex = result.findIndex(g => g.category === 'productivity');
    expect(essentialsIndex).toBeLessThan(productivityIndex);
  });
});

describe('getCategoryLabel', () => {
  it('should return correct labels for all categories', () => {
    expect(getCategoryLabel('essentials')).toBe('Essentials');
    expect(getCategoryLabel('personal')).toBe('Personal');
    expect(getCategoryLabel('community')).toBe('Community');
    expect(getCategoryLabel('productivity')).toBe('Productivity');
    expect(getCategoryLabel('admin')).toBe('Administration');
    expect(getCategoryLabel('settings')).toBe('Settings');
  });
});

describe('countAppsByCategory', () => {
  it('should count apps correctly', () => {
    const counts = countAppsByCategory(mockApps);
    expect(counts.essentials).toBe(1);
    expect(counts.productivity).toBe(1);
    expect(counts.admin).toBe(1);
    expect(counts.settings).toBe(1);
  });

  it('should handle empty array', () => {
    const counts = countAppsByCategory([]);
    expect(Object.keys(counts)).toHaveLength(0);
  });
});
