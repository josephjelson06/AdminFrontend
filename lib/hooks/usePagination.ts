'use client';

/**
 * usePagination Hook
 * 
 * Manages pagination state for tables and lists.
 * Can be used standalone or integrated with useSort and useFilters.
 */

import { useState, useMemo, useCallback } from 'react';

export interface PaginationState {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

export interface UsePaginationOptions {
    initialPage?: number;
    initialPageSize?: number;
    pageSizeOptions?: number[];
}

export interface UsePaginationReturn {
    // State
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;

    // Actions
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setTotalItems: (total: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;

    // Computed
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startIndex: number;
    endIndex: number;
    pageSizeOptions: number[];

    // For API calls
    paginationParams: { page: number; pageSize: number };
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
    const {
        initialPage = 1,
        initialPageSize = 10,
        pageSizeOptions = [10, 20, 50, 100],
    } = options;

    const [page, setPageState] = useState(initialPage);
    const [pageSize, setPageSizeState] = useState(initialPageSize);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = useMemo(
        () => Math.ceil(totalItems / pageSize) || 1,
        [totalItems, pageSize]
    );

    const setPage = useCallback((newPage: number) => {
        setPageState(Math.max(1, Math.min(newPage, totalPages)));
    }, [totalPages]);

    const setPageSize = useCallback((newSize: number) => {
        setPageSizeState(newSize);
        setPageState(1); // Reset to first page when changing page size
    }, []);

    const nextPage = useCallback(() => {
        setPage(page + 1);
    }, [page, setPage]);

    const prevPage = useCallback(() => {
        setPage(page - 1);
    }, [page, setPage]);

    const firstPage = useCallback(() => {
        setPage(1);
    }, [setPage]);

    const lastPage = useCallback(() => {
        setPage(totalPages);
    }, [setPage, totalPages]);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, totalItems);

    return {
        page,
        pageSize,
        totalPages,
        totalItems,
        setPage,
        setPageSize,
        setTotalItems,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        hasNextPage,
        hasPrevPage,
        startIndex,
        endIndex,
        pageSizeOptions,
        paginationParams: { page, pageSize },
    };
}
