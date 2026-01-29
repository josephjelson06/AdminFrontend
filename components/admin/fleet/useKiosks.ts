'use client';

/**
 * useKiosks Hook
 * 
 * Manages kiosk list fetching with pagination, sorting, and filtering.
 */

import { useState, useEffect, useCallback } from 'react';
import { kioskService } from '@/lib/services/kioskService';
import { usePagination, useFilters, useDebounce } from '@/lib/hooks';
import type { Kiosk, KioskStatus } from '@/types/schema';
import type { KioskStats } from '@/lib/services/kioskService';

export interface KioskFilters {
    search: string;
    status: KioskStatus | '';
    model: string;
    [key: string]: string;
}

export interface UseKiosksOptions {
    initialPageSize?: number;
}

export interface UseKiosksReturn {
    // Data
    kiosks: Kiosk[];
    isLoading: boolean;
    error: Error | null;
    stats: KioskStats;
    models: Array<{ value: string; label: string; count: number }>;

    // Pagination
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;

    // Filtering
    filters: KioskFilters;
    setFilter: <K extends keyof KioskFilters>(key: K, value: KioskFilters[K]) => void;
    clearFilters: () => void;

    // Actions
    refresh: () => void;
}

const defaultFilters: KioskFilters = {
    search: '',
    status: '',
    model: '',
};

export function useKiosks(options: UseKiosksOptions = {}): UseKiosksReturn {
    const { initialPageSize = 9 } = options;

    // State
    const [kiosks, setKiosks] = useState<Kiosk[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [stats, setStats] = useState<KioskStats>({ total: 0, online: 0, offline: 0 });
    const [models, setModels] = useState<Array<{ value: string; label: string; count: number }>>([]);

    // Hooks
    const pagination = usePagination({ initialPageSize });
    const { filters, setFilter, clearAllFilters } = useFilters<KioskFilters>({
        initialFilters: defaultFilters,
    });

    // Debounce search
    const debouncedSearch = useDebounce(filters.search, 300);

    // Load models on mount
    useEffect(() => {
        kioskService.getModels().then(setModels);
        kioskService.getStats().then(setStats);
    }, []);

    // Fetch data
    const fetchKiosks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await kioskService.list({
                page: pagination.page,
                pageSize: pagination.pageSize,
                search: debouncedSearch || undefined,
                filters: {
                    ...(filters.status && { status: filters.status as KioskStatus }),
                    ...(filters.model && { model: filters.model }),
                },
            });

            setKiosks(response.data);
            pagination.setTotalItems(response.pagination.totalItems);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch kiosks'));
        } finally {
            setIsLoading(false);
        }
    }, [
        pagination.page,
        pagination.pageSize,
        debouncedSearch,
        filters.status,
        filters.model,
    ]);

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchKiosks();
    }, [fetchKiosks]);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (pagination.page !== 1) {
            pagination.setPage(1);
        }
    }, [debouncedSearch, filters.status, filters.model]);

    return {
        // Data
        kiosks,
        isLoading,
        error,
        stats,
        models,

        // Pagination
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        setPage: pagination.setPage,
        setPageSize: pagination.setPageSize,

        // Filtering
        filters,
        setFilter,
        clearFilters: clearAllFilters,

        // Actions
        refresh: fetchKiosks,
    };
}
