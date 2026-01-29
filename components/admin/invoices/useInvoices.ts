'use client';

/**
 * useInvoices Hook
 * 
 * Manages invoice list fetching with pagination and filtering.
 */

import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '@/lib/services/invoiceService';
import { usePagination, useFilters, useDebounce } from '@/lib/hooks';
import type { Invoice } from '@/types/finance';
import type { InvoiceSummary } from '@/lib/services/invoiceService';

export interface InvoiceFilters {
    search: string;
    status: Invoice['status'] | 'all';
    [key: string]: string;
}

export interface UseInvoicesReturn {
    // Data
    invoices: Invoice[];
    isLoading: boolean;
    error: Error | null;
    summary: InvoiceSummary;

    // Pagination
    page: number;
    pageSize: number;
    totalPages: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;

    // Filtering
    filters: InvoiceFilters;
    setFilter: <K extends keyof InvoiceFilters>(key: K, value: InvoiceFilters[K]) => void;
    clearFilters: () => void;

    // Actions
    refresh: () => void;
}

const defaultFilters: InvoiceFilters = {
    search: '',
    status: 'all',
};

const defaultSummary: InvoiceSummary = {
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    thisMonthBilling: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
    totalCount: 0,
};

export function useInvoices(initialPageSize = 10): UseInvoicesReturn {
    // State
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [summary, setSummary] = useState<InvoiceSummary>(defaultSummary);

    // Hooks
    const pagination = usePagination({ initialPageSize });
    const { filters, setFilter, clearAllFilters } = useFilters<InvoiceFilters>({
        initialFilters: defaultFilters,
    });

    // Debounce search
    const debouncedSearch = useDebounce(filters.search, 300);

    // Load summary on mount
    useEffect(() => {
        invoiceService.getSummary().then(setSummary);
    }, []);

    // Fetch data
    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await invoiceService.list({
                page: pagination.page,
                pageSize: pagination.pageSize,
                search: debouncedSearch || undefined,
                status: filters.status,
            });

            setInvoices(response.data);
            pagination.setTotalItems(response.pagination.totalItems);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch invoices'));
        } finally {
            setIsLoading(false);
        }
    }, [
        pagination.page,
        pagination.pageSize,
        debouncedSearch,
        filters.status,
    ]);

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (pagination.page !== 1) {
            pagination.setPage(1);
        }
    }, [debouncedSearch, filters.status]);

    return {
        invoices,
        isLoading,
        error,
        summary,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: pagination.totalPages,
        setPage: pagination.setPage,
        setPageSize: pagination.setPageSize,
        filters,
        setFilter,
        clearFilters: clearAllFilters,
        refresh: fetchInvoices,
    };
}
