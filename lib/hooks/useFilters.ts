'use client';

/**
 * useFilters Hook
 * 
 * Manages filter state for tables and lists.
 * Supports multiple filters with different value types.
 */

import { useState, useCallback, useMemo } from 'react';

export type FilterValue = string | string[] | boolean | number | null;
export type FiltersState = Record<string, FilterValue>;

export interface UseFiltersOptions<T extends FiltersState = FiltersState> {
    initialFilters?: Partial<T>;
}

export interface UseFiltersReturn<T extends FiltersState = FiltersState> {
    // State
    filters: T;

    // Actions
    setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
    setFilters: (newFilters: Partial<T>) => void;
    clearFilter: (key: keyof T) => void;
    clearAllFilters: () => void;
    resetFilters: () => void;

    // Computed
    hasActiveFilters: boolean;
    activeFilterCount: number;

    // For API calls
    filterParams: Record<string, string | string[]>;
}

export function useFilters<T extends FiltersState = FiltersState>(
    options: UseFiltersOptions<T> = {}
): UseFiltersReturn<T> {
    const { initialFilters = {} as Partial<T> } = options;

    const [filters, setFiltersState] = useState<T>({
        ...initialFilters,
    } as T);

    const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
        setFiltersState(prev => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const setFilters = useCallback((newFilters: Partial<T>) => {
        setFiltersState(prev => ({
            ...prev,
            ...newFilters,
        }));
    }, []);

    const clearFilter = useCallback((key: keyof T) => {
        setFiltersState(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }, []);

    const clearAllFilters = useCallback(() => {
        setFiltersState({} as T);
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState({ ...initialFilters } as T);
    }, [initialFilters]);

    const activeFilterCount = useMemo(() => {
        return Object.values(filters).filter(value => {
            if (value === null || value === undefined || value === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        }).length;
    }, [filters]);

    const hasActiveFilters = activeFilterCount > 0;

    // Convert to API-compatible params
    const filterParams = useMemo(() => {
        const params: Record<string, string | string[]> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;
            if (Array.isArray(value)) {
                if (value.length > 0) params[key] = value;
            } else if (typeof value === 'boolean') {
                params[key] = value.toString();
            } else if (typeof value === 'number') {
                params[key] = value.toString();
            } else {
                params[key] = value;
            }
        });

        return params;
    }, [filters]);

    return {
        filters,
        setFilter,
        setFilters,
        clearFilter,
        clearAllFilters,
        resetFilters,
        hasActiveFilters,
        activeFilterCount,
        filterParams,
    };
}
