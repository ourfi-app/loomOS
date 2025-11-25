/**
 * Unit tests for app filter and sort utilities
 */

import { describe, it, expect } from '@jest/globals';
import type { AppDefinition } from '../types';
import {
  filterAppsBySearch,
  filterAppsByCategories,
  filterAppsByAdmin,
  sortApps,
} from '../utils/appFilters';

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
    requiresAdmin: false,
  },
  {
    id: 'app2',
    title: 'Admin Panel',
    description: 'Administrative panel',
    path: '/admin',
    icon: () => null,
    gradient: 'from-red-500 to-pink-600',
    category: 'admin',
    requiresAdmin: true,
  },
  {
    id: 'app3',
    title: 'Calendar',
    description: 'Schedule events',
    path: '/calendar',
    icon: () => null,
    gradient: 'from-green-500 to-emerald-600',
    category: 'productivity',
    keywords: ['events', 'schedule', 'appointments'],
    requiresAdmin: false,
  },
];

describe('filterAppsBySearch', () => {
  it('should return all apps when query is empty', () => {
    const result = filterAppsBySearch(mockApps, '');
    expect(result).toEqual(mockApps);
  });

  it('should filter apps by title', () => {
    const result = filterAppsBySearch(mockApps, 'Dashboard');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('app1');
  });

  it('should filter apps by description', () => {
    const result = filterAppsBySearch(mockApps, 'administrative');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('app2');
  });

  it('should filter apps by keywords', () => {
    const result = filterAppsBySearch(mockApps, 'events');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('app3');
  });

  it('should filter apps by category', () => {
    const result = filterAppsBySearch(mockApps, 'productivity');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('app3');
  });

  it('should be case-insensitive', () => {
    const result = filterAppsBySearch(mockApps, 'DASHBOARD');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('app1');
  });
});

describe('filterAppsByCategories', () => {
  it('should return all apps when no categories selected', () => {
    const result = filterAppsByCategories(mockApps, []);
    expect(result).toEqual(mockApps);
  });

  it('should filter apps by single category', () => {
    const result = filterAppsByCategories(mockApps, ['essentials']);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('app1');
  });

  it('should filter apps by multiple categories', () => {
    const result = filterAppsByCategories(mockApps, ['essentials', 'productivity']);
    expect(result).toHaveLength(2);
  });
});

describe('filterAppsByAdmin', () => {
  it('should return all apps when showAdminApps is true', () => {
    const result = filterAppsByAdmin(mockApps, true);
    expect(result).toEqual(mockApps);
  });

  it('should filter out admin apps when showAdminApps is false', () => {
    const result = filterAppsByAdmin(mockApps, false);
    expect(result).toHaveLength(2);
    expect(result.find(app => app.requiresAdmin)).toBeUndefined();
  });
});

describe('sortApps', () => {
  it('should sort apps alphabetically', () => {
    const result = sortApps(mockApps, 'alphabetical');
    expect(result[0]?.id).toBe('app2'); // Admin Panel
    expect(result[1]?.id).toBe('app3'); // Calendar
    expect(result[2]?.id).toBe('app1'); // Dashboard
  });

  it('should sort apps by recent usage', () => {
    const appUsage = {
      app1: { count: 5, lastUsed: 1000 },
      app2: { count: 3, lastUsed: 3000 },
      app3: { count: 10, lastUsed: 2000 },
    };
    const result = sortApps(mockApps, 'recent', appUsage);
    expect(result[0]?.id).toBe('app2'); // Most recent
    expect(result[1]?.id).toBe('app3');
    expect(result[2]?.id).toBe('app1'); // Least recent
  });

  it('should sort apps by frequency', () => {
    const appUsage = {
      app1: { count: 5, lastUsed: 1000 },
      app2: { count: 3, lastUsed: 3000 },
      app3: { count: 10, lastUsed: 2000 },
    };
    const result = sortApps(mockApps, 'frequent', appUsage);
    expect(result[0]?.id).toBe('app3'); // Most frequent (10)
    expect(result[1]?.id).toBe('app1'); // Middle (5)
    expect(result[2]?.id).toBe('app2'); // Least frequent (3)
  });

  it('should sort apps by category', () => {
    const result = sortApps(mockApps, 'category');
    // Should be grouped by category, then alphabetically within category
    expect(result[0]?.category).toBe('admin');
    expect(result[1]?.category).toBe('essentials');
    expect(result[2]?.category).toBe('productivity');
  });
});
