'use client';

/**
 * useSubscriptions Hook
 * 
 * Manages subscription list fetching with pagination, tabs, and filtering.
 */

import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { usePagination, useFilters, useDebounce } from '@/lib/hooks';
import type { HotelSubscription } from '@/types/finance';
import type { SubscriptionMetrics, TabCounts } from '@/lib/services/subscriptionService';

export type TabType = 'all' | 'auto_pay' | 'manual' | 'failed' | 'grace_period';

export interface SubscriptionFilters {
    search: string;
    plan: 'all' | 'standard' | 'advanced';
    status: 'all' | HotelSubscription['status'];
    [key: string]: string;
}

export interface UseSubscriptionsReturn {
    // Data
    subscriptions: HotelSubscription[];
    isLoading: boolean;
    error: Error | null;
    metrics: SubscriptionMetrics;
    tabCounts: TabCounts;

    // Tabs
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;

    // Pagination
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;

    // Filtering
    filters: SubscriptionFilters;
    setFilter: <K extends keyof SubscriptionFilters>(key: K, value: SubscriptionFilters[K]) => void;
    clearFilters: () => void;

    // Actions
    refresh: () => void;
}

const defaultFilters: SubscriptionFilters = {
    search: '',
    plan: 'all',
    status: 'all',
};

const defaultMetrics: SubscriptionMetrics = {
    activeSubscriptions: 0,
    newSubscriptionsThisMonth: 0,
    churnedThisMonth: 0,
};

const defaultTabCounts: TabCounts = {
    all: 0,
    auto_pay: 0,
    manual: 0,
    failed: 0,
    grace_period: 0,
};

export function useSubscriptions(initialPageSize = 10): UseSubscriptionsReturn {
    // State
    const [subscriptions, setSubscriptions] = useState<HotelSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [metrics, setMetrics] = useState<SubscriptionMetrics>(defaultMetrics);
    const [tabCounts, setTabCounts] = useState<TabCounts>(defaultTabCounts);
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [totalItems, setTotalItems] = useState(0);

    // Hooks
    const pagination = usePagination({ initialPageSize });
    const { filters, setFilter, clearAllFilters } = useFilters<SubscriptionFilters>({
        initialFilters: defaultFilters,
    });

    // Debounce search
    const debouncedSearch = useDebounce(filters.search, 300);

    // Load metrics and tab counts on mount
    useEffect(() => {
        subscriptionService.getMetrics().then(setMetrics);
        subscriptionService.getTabCounts().then(setTabCounts);
    }, []);

    // Fetch data
    const fetchSubscriptions = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await subscriptionService.list({
                page: pagination.page,
                pageSize: pagination.pageSize,
                search: debouncedSearch || undefined,
                plan: filters.plan,
                status: filters.status,
                tab: activeTab,
            });

            setSubscriptions(response.data);
            setTotalItems(response.pagination.totalItems);
            pagination.setTotalItems(response.pagination.totalItems);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch subscriptions'));
        } finally {
            setIsLoading(false);
        }
    }, [
        pagination.page,
        pagination.pageSize,
        debouncedSearch,
        filters.plan,
        filters.status,
        activeTab,
    ]);

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    // Reset to page 1 when filters or tab change
    useEffect(() => {
        if (pagination.page !== 1) {
            pagination.setPage(1);
        }
    }, [debouncedSearch, filters.plan, filters.status, activeTab]);

    return {
        subscriptions,
        isLoading,
        error,
        metrics,
        tabCounts,
        activeTab,
        setActiveTab,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: pagination.totalPages,
        totalItems,
        setPage: pagination.setPage,
        setPageSize: pagination.setPageSize,
        filters,
        setFilter,
        clearFilters: clearAllFilters,
        refresh: fetchSubscriptions,
    };
}
