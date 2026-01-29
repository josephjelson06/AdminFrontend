'use client';

/**
 * useHotelIncidents Hook
 * 
 * Manages incidents page state and operations.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    hotelIncidentsService,
    type SortOption,
    type IncidentsFilters,
} from '@/lib/services/hotelIncidentsService';
import type { Incident, IncidentPriority, IncidentStatus } from '@/lib/hotel/hotel-data';

export interface UseHotelIncidentsReturn {
    // Data
    incidents: Incident[];
    filteredIncidents: Incident[];
    paginatedIncidents: Incident[];
    totalPages: number;

    // Pagination
    currentPage: number;
    rowsPerPage: number;
    setCurrentPage: (page: number) => void;
    setRowsPerPage: (rows: number) => void;

    // Filters
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    statusFilter: IncidentStatus | 'all';
    setStatusFilter: (status: IncidentStatus | 'all') => void;
    priorityFilter: IncidentPriority | 'all';
    setPriorityFilter: (priority: IncidentPriority | 'all') => void;
    dateFrom: Date | null;
    setDateFrom: (date: Date | null) => void;
    dateTo: Date | null;
    setDateTo: (date: Date | null) => void;
    activeFilterCount: number;
    clearFilters: () => void;

    // Actions
    setPriority: (id: string, priority: IncidentPriority) => Promise<boolean>;
    assignIncident: (id: string) => Promise<boolean>;
    resolveIncident: (id: string) => Promise<boolean>;

    // Modal
    selectedIncident: Incident | null;
    setSelectedIncident: (incident: Incident | null) => void;

    // State
    isLoading: boolean;
}

export function useHotelIncidents(): UseHotelIncidentsReturn {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPageState] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');
    const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | 'all'>('all');
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const filters: IncidentsFilters = useMemo(() => ({
        searchQuery,
        sortBy,
        statusFilter,
        priorityFilter,
        dateFrom,
        dateTo,
    }), [searchQuery, sortBy, statusFilter, priorityFilter, dateFrom, dateTo]);

    const filteredIncidents = useMemo(
        () => hotelIncidentsService.filterAndSort(incidents, filters),
        [incidents, filters]
    );

    const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / rowsPerPage));
    const paginatedIncidents = hotelIncidentsService.paginate(filteredIncidents, currentPage, rowsPerPage);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (statusFilter !== 'all') count++;
        if (priorityFilter !== 'all') count++;
        if (dateFrom || dateTo) count++;
        return count;
    }, [searchQuery, statusFilter, priorityFilter, dateFrom, dateTo]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await hotelIncidentsService.getIncidents();
                setIncidents(data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, priorityFilter, dateFrom, dateTo]);

    const setRowsPerPage = useCallback((rows: number) => {
        setRowsPerPageState(rows);
        setCurrentPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setStatusFilter('all');
        setPriorityFilter('all');
        setDateFrom(null);
        setDateTo(null);
    }, []);

    const setPriority = useCallback(async (id: string, priority: IncidentPriority): Promise<boolean> => {
        const result = await hotelIncidentsService.setPriority(id, priority);
        if (result.success) {
            setIncidents(prev => prev.map(inc =>
                inc.id === id ? { ...inc, priority } : inc
            ));
        }
        return result.success;
    }, []);

    const assignIncident = useCallback(async (id: string): Promise<boolean> => {
        const result = await hotelIncidentsService.assignIncident(id);
        if (result.success) {
            setIncidents(prev => prev.map(inc =>
                inc.id === id ? { ...inc, status: 'Assigned' as IncidentStatus } : inc
            ));
        }
        return result.success;
    }, []);

    const resolveIncident = useCallback(async (id: string): Promise<boolean> => {
        const result = await hotelIncidentsService.resolveIncident(id);
        if (result.success) {
            setIncidents(prev => prev.map(inc =>
                inc.id === id ? { ...inc, status: 'Resolved' as IncidentStatus } : inc
            ));
        }
        return result.success;
    }, []);

    return {
        incidents,
        filteredIncidents,
        paginatedIncidents,
        totalPages,
        currentPage,
        rowsPerPage,
        setCurrentPage,
        setRowsPerPage,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        activeFilterCount,
        clearFilters,
        setPriority,
        assignIncident,
        resolveIncident,
        selectedIncident,
        setSelectedIncident,
        isLoading,
    };
}
