'use client';

/**
 * useSupport Hook
 * 
 * Manages support ticket state and filtering.
 */

import { useState, useEffect, useCallback } from 'react';
import { supportService, type TicketFilterStatus, type TicketStats } from '@/lib/services/supportService';
import type { SupportTicket } from '@/lib/admin/support-data';

export interface UseSupportReturn {
    tickets: SupportTicket[];
    isLoading: boolean;
    error: Error | null;
    stats: TicketStats;
    filterStatus: TicketFilterStatus;
    setFilterStatus: (status: TicketFilterStatus) => void;
    selectedTicket: SupportTicket | null;
    selectTicket: (ticket: SupportTicket | null) => void;
    refresh: () => void;
}

const defaultStats: TicketStats = {
    total: 0,
    open: 0,
    resolved: 0,
    critical: 0,
};

export function useSupport(): UseSupportReturn {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [stats, setStats] = useState<TicketStats>(defaultStats);
    const [filterStatus, setFilterStatus] = useState<TicketFilterStatus>('all');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [ticketData, statsData] = await Promise.all([
                supportService.list(filterStatus),
                supportService.getStats(),
            ]);

            setTickets(ticketData);
            setStats(statsData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch tickets'));
        } finally {
            setIsLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const selectTicket = useCallback((ticket: SupportTicket | null) => {
        setSelectedTicket(ticket);
    }, []);

    return {
        tickets,
        isLoading,
        error,
        stats,
        filterStatus,
        setFilterStatus,
        selectedTicket,
        selectTicket,
        refresh: fetchTickets,
    };
}
