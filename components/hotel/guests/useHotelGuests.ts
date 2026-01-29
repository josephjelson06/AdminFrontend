'use client';

/**
 * useHotelGuests Hook
 * 
 * Manages hotel guests state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    hotelGuestService,
    type GuestStats,
    type GuestStatusFilter,
} from '@/lib/services/hotelGuestService';
import type { GuestCheckIn } from '@/lib/hotel/hotel-data';

export interface UseHotelGuestsReturn {
    // Data
    guests: GuestCheckIn[];
    stats: GuestStats;

    // Filters
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: GuestStatusFilter;
    setStatusFilter: (filter: GuestStatusFilter) => void;
    dateFilter: string;
    setDateFilter: (filter: string) => void;

    // Pagination
    currentPage: number;
    setCurrentPage: (page: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (rows: number) => void;
    totalPages: number;
    paginatedGuests: GuestCheckIn[];

    // Actions
    exportCSV: () => Promise<boolean>;

    // State
    isLoading: boolean;
    isExporting: boolean;
}

const defaultStats: GuestStats = {
    total: 0,
    verified: 0,
    manual: 0,
    failed: 0,
};

export function useHotelGuests(): UseHotelGuestsReturn {
    const [guests, setGuests] = useState<GuestCheckIn[]>([]);
    const [stats, setStats] = useState<GuestStats>(defaultStats);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<GuestStatusFilter>('all');
    const [dateFilter, setDateFilter] = useState('today');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [guestsData, statsData] = await Promise.all([
                hotelGuestService.getGuests(statusFilter, searchQuery),
                hotelGuestService.getStats(),
            ]);
            setGuests(guestsData);
            setStats(statsData);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, searchQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, dateFilter, rowsPerPage]);

    // Calculate pagination
    const totalPages = Math.max(1, Math.ceil(guests.length / rowsPerPage));
    const paginatedGuests = guests.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const exportCSV = useCallback(async (): Promise<boolean> => {
        setIsExporting(true);
        try {
            const result = await hotelGuestService.exportCSV();
            return result.success;
        } finally {
            setIsExporting(false);
        }
    }, []);

    return {
        guests,
        stats,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        dateFilter,
        setDateFilter,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        paginatedGuests,
        exportCSV,
        isLoading,
        isExporting,
    };
}
