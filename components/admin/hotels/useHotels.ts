'use client';

/**
 * useHotels Hook
 * 
 * Manages hotel list fetching with pagination, sorting, and filtering.
 * Uses the hotelService for data access.
 */

import { useState, useEffect, useCallback } from 'react';
import { hotelService } from '@/lib/services/hotelService';
import { usePagination, useSort, useFilters, useDebounce } from '@/lib/hooks';
import type { Hotel } from '@/types/schema';

export interface HotelFilters {
    search: string;
    status: string;
    plan: string;
    [key: string]: string;
}

export interface UseHotelsOptions {
    initialPageSize?: number;
}

export interface UseHotelsReturn {
    // Data
    hotels: Hotel[];
    isLoading: boolean;
    error: Error | null;

    // Pagination
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;

    // Sorting
    sortBy: string | null;
    sortOrder: 'asc' | 'desc';
    toggleSort: (field: string) => void;

    // Filtering
    filters: HotelFilters;
    setFilter: <K extends keyof HotelFilters>(key: K, value: HotelFilters[K]) => void;
    clearFilters: () => void;

    // Actions
    refresh: () => void;
}

const defaultFilters: HotelFilters = {
    search: '',
    status: '',
    plan: '',
};

export function useHotels(options: UseHotelsOptions = {}): UseHotelsReturn {
    const { initialPageSize = 10 } = options;

    // State
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Hooks
    const pagination = usePagination({ initialPageSize });
    const sort = useSort();
    const { filters, setFilter, clearAllFilters } = useFilters<HotelFilters>({
        initialFilters: defaultFilters,
    });

    // Debounce search
    const debouncedSearch = useDebounce(filters.search, 300);

    // Fetch data
    const fetchHotels = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await hotelService.list({
                page: pagination.page,
                pageSize: pagination.pageSize,
                search: debouncedSearch || undefined,
                sortBy: sort.sortBy || undefined,
                sortOrder: sort.sortBy ? sort.sortOrder : undefined,
                filters: {
                    ...(filters.status && { status: filters.status }),
                    ...(filters.plan && { plan: filters.plan }),
                },
            });

            setHotels(response.data);
            pagination.setTotalItems(response.pagination.totalItems);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch hotels'));
        } finally {
            setIsLoading(false);
        }
    }, [
        pagination.page,
        pagination.pageSize,
        debouncedSearch,
        sort.sortBy,
        sort.sortOrder,
        filters.status,
        filters.plan,
    ]);

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (pagination.page !== 1) {
            pagination.setPage(1);
        }
    }, [debouncedSearch, filters.status, filters.plan]);

    return {
        // Data
        hotels,
        isLoading,
        error,

        // Pagination
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        setPage: pagination.setPage,
        setPageSize: pagination.setPageSize,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,

        // Sorting
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        toggleSort: sort.toggleSort,

        // Filtering
        filters,
        setFilter,
        clearFilters: clearAllFilters,

        // Actions
        refresh: fetchHotels,
    };
}
