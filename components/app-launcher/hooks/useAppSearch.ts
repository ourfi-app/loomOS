/**
 * Hook for app search functionality
 */

import { useState, useMemo, useCallback } from 'react';
import { searchApps } from '@/lib/enhanced-app-registry';
import type { AppDefinition, UseAppSearchReturn } from '../types';
import { filterAppsBySearch, filterAppsByAdmin } from '../utils/appFilters';

export function useAppSearch(
  allApps: AppDefinition[],
  showAdminApps: boolean
): UseAppSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return allApps;
    }

    // Use the enhanced search from app registry if available
    try {
      const results = searchApps(searchQuery);
      return filterAppsByAdmin(results, showAdminApps);
    } catch {
      // Fallback to local filtering
      return filterAppsBySearch(allApps, searchQuery);
    }
  }, [searchQuery, allApps, showAdminApps]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const hasSearchQuery = searchQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    searchResults,
    hasSearchQuery,
  };
}
