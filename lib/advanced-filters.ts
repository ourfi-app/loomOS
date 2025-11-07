
/**
 * Advanced Filtering System
 * Provides sophisticated filtering capabilities across all apps
 */

import { useMemo, useCallback, useState } from 'react';

export type FilterOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty';

export type FilterCondition = {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  type?: 'string' | 'number' | 'date' | 'boolean' | 'array';
};

export type FilterGroup = {
  id: string;
  name?: string;
  operator: 'AND' | 'OR';
  conditions: FilterCondition[];
  groups?: FilterGroup[];
};

export type SavedFilter = {
  id: string;
  name: string;
  description?: string;
  entity: string;
  filter: FilterGroup;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Apply a single filter condition to a value
 */
function applyCondition(value: any, condition: FilterCondition): boolean {
  const { operator, value: filterValue } = condition;

  switch (operator) {
    case 'equals':
      return value === filterValue;
    case 'notEquals':
      return value !== filterValue;
    case 'contains':
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    case 'notContains':
      return !String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    case 'startsWith':
      return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
    case 'endsWith':
      return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
    case 'greaterThan':
      return value > filterValue;
    case 'lessThan':
      return value < filterValue;
    case 'greaterThanOrEqual':
      return value >= filterValue;
    case 'lessThanOrEqual':
      return value <= filterValue;
    case 'between':
      return Array.isArray(filterValue) && value >= filterValue[0] && value <= filterValue[1];
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(value);
    case 'notIn':
      return Array.isArray(filterValue) && !filterValue.includes(value);
    case 'isEmpty':
      return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
    case 'isNotEmpty':
      return value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0);
    default:
      return true;
  }
}

/**
 * Apply a filter group to an item
 */
function applyFilterGroup(item: any, group: FilterGroup): boolean {
  const conditionResults = group.conditions.map(condition => {
    const value = condition.field.split('.').reduce((obj, key) => obj?.[key], item);
    return applyCondition(value, condition);
  });

  const groupResults = (group.groups || []).map(subGroup => applyFilterGroup(item, subGroup));

  const allResults = [...conditionResults, ...groupResults];

  if (group.operator === 'AND') {
    return allResults.every(result => result);
  } else {
    return allResults.some(result => result);
  }
}

/**
 * Hook for advanced filtering
 */
export function useAdvancedFilter<T = any>(data: T[], initialFilter?: FilterGroup) {
  const [filter, setFilter] = useState<FilterGroup | null>(initialFilter || null);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  const filteredData = useMemo(() => {
    if (!filter || !data) return data;

    return data.filter(item => applyFilterGroup(item, filter));
  }, [data, filter]);

  const applyFilter = useCallback((newFilter: FilterGroup | null) => {
    setFilter(newFilter);
  }, []);

  const clearFilter = useCallback(() => {
    setFilter(null);
  }, []);

  const saveFilter = useCallback((name: string, description?: string, entity?: string) => {
    if (!filter) return;

    const savedFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name,
      description,
      entity: entity || 'unknown',
      filter,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSavedFilters(prev => [...prev, savedFilter]);

    // TODO: Persist to backend
    return savedFilter;
  }, [filter]);

  const loadFilter = useCallback((filterId: string) => {
    const savedFilter = savedFilters.find(f => f.id === filterId);
    if (savedFilter) {
      setFilter(savedFilter.filter);
    }
  }, [savedFilters]);

  const deleteFilter = useCallback((filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
    // TODO: Delete from backend
  }, []);

  return {
    filter,
    filteredData,
    applyFilter,
    clearFilter,
    saveFilter,
    loadFilter,
    deleteFilter,
    savedFilters,
  };
}

/**
 * Create a simple filter group
 */
export function createFilterGroup(
  conditions: Omit<FilterCondition, 'id'>[],
  operator: 'AND' | 'OR' = 'AND'
): FilterGroup {
  return {
    id: `group-${Date.now()}`,
    operator,
    conditions: conditions.map((c, i) => ({
      ...c,
      id: `condition-${Date.now()}-${i}`,
    })),
  };
}

/**
 * Quick filter helpers
 */
export const quickFilters = {
  search: (fields: string[], searchTerm: string): FilterGroup => {
    return createFilterGroup(
      fields.map(field => ({
        field,
        operator: 'contains' as FilterOperator,
        value: searchTerm,
        type: 'string' as const,
      })),
      'OR'
    );
  },

  dateRange: (field: string, start: Date, end: Date): FilterGroup => {
    return createFilterGroup([
      {
        field,
        operator: 'between' as FilterOperator,
        value: [start, end],
        type: 'date' as const,
      },
    ]);
  },

  status: (field: string, statuses: string[]): FilterGroup => {
    return createFilterGroup([
      {
        field,
        operator: 'in' as FilterOperator,
        value: statuses,
        type: 'array' as const,
      },
    ]);
  },

  hasValue: (field: string): FilterGroup => {
    return createFilterGroup([
      {
        field,
        operator: 'isNotEmpty' as FilterOperator,
        value: null,
      },
    ]);
  },
};
