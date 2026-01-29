'use client';

/**
 * useSort Hook
 * 
 * Manages sorting state for tables.
 * Supports single-column sorting with ascending/descending toggle.
 */

import { useState, useCallback } from 'react';

export interface SortState {
    sortBy: string | null;
    sortOrder: 'asc' | 'desc';
}

export interface UseSortOptions {
    initialSortBy?: string | null;
    initialSortOrder?: 'asc' | 'desc';
}

export interface UseSortReturn {
    // State
    sortBy: string | null;
    sortOrder: 'asc' | 'desc';

    // Actions
    setSortBy: (field: string | null) => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    toggleSort: (field: string) => void;
    clearSort: () => void;

    // Computed
    isSorted: boolean;
    getSortDirection: (field: string) => 'asc' | 'desc' | null;

    // For API calls
    sortParams: { sortBy?: string; sortOrder?: 'asc' | 'desc' };
}

export function useSort(options: UseSortOptions = {}): UseSortReturn {
    const {
        initialSortBy = null,
        initialSortOrder = 'asc',
    } = options;

    const [sortBy, setSortBy] = useState<string | null>(initialSortBy);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

    const toggleSort = useCallback((field: string) => {
        if (sortBy === field) {
            // Toggle order if same field
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, start with ascending
            setSortBy(field);
            setSortOrder('asc');
        }
    }, [sortBy]);

    const clearSort = useCallback(() => {
        setSortBy(null);
        setSortOrder('asc');
    }, []);

    const getSortDirection = useCallback((field: string) => {
        if (sortBy !== field) return null;
        return sortOrder;
    }, [sortBy, sortOrder]);

    const isSorted = sortBy !== null;

    const sortParams = sortBy
        ? { sortBy, sortOrder }
        : {};

    return {
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
        toggleSort,
        clearSort,
        isSorted,
        getSortDirection,
        sortParams,
    };
}
