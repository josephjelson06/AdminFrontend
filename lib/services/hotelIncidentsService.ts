/**
 * Hotel Incidents Service
 * 
 * Abstracts incident management operations.
 */

import {
    MOCK_INCIDENTS,
    type Incident,
    type IncidentPriority,
    type IncidentStatus,
} from '@/lib/hotel/hotel-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export type SortOption = 'date-desc' | 'date-asc' | 'priority-high' | 'priority-low' | 'room-asc' | 'room-desc';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'priority-high', label: 'Priority: High to Low' },
    { value: 'priority-low', label: 'Priority: Low to High' },
    { value: 'room-asc', label: 'Room: A-Z' },
    { value: 'room-desc', label: 'Room: Z-A' },
];

export const STATUS_OPTIONS: { value: IncidentStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'Reported', label: 'Reported' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
];

export const PRIORITY_FILTER_OPTIONS: { value: IncidentPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'Immediate Fix', label: 'Immediate Fix' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
    { value: null, label: 'Unset' },
];

export const PRIORITY_OPTIONS: { value: IncidentPriority; label: string }[] = [
    { value: 'Immediate Fix', label: 'Immediate Fix' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
];

const PRIORITY_ORDER: Record<string, number> = {
    'Immediate Fix': 0,
    'Medium': 1,
    'Low': 2,
    'null': 3,
};

export interface IncidentsFilters {
    searchQuery: string;
    sortBy: SortOption;
    statusFilter: IncidentStatus | 'all';
    priorityFilter: IncidentPriority | 'all';
    dateFrom: Date | null;
    dateTo: Date | null;
}

export const hotelIncidentsService = {
    /**
     * Filter and sort incidents
     */
    filterAndSort(incidents: Incident[], filters: IncidentsFilters): Incident[] {
        let result = [...incidents];

        // Search filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(inc =>
                inc.roomNumber.toLowerCase().includes(query) ||
                inc.guestName.toLowerCase().includes(query) ||
                inc.description.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (filters.statusFilter !== 'all') {
            result = result.filter(inc => inc.status === filters.statusFilter);
        }

        // Priority filter
        if (filters.priorityFilter !== 'all') {
            result = result.filter(inc => inc.priority === filters.priorityFilter);
        }

        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
            result = result.filter(inc => {
                const incDate = new Date(inc.reportedAt);
                if (filters.dateFrom && incDate < filters.dateFrom) return false;
                if (filters.dateTo && incDate > filters.dateTo) return false;
                return true;
            });
        }

        // Sort
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case 'date-desc':
                    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
                case 'date-asc':
                    return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
                case 'priority-high':
                    return (PRIORITY_ORDER[String(a.priority)] ?? 3) - (PRIORITY_ORDER[String(b.priority)] ?? 3);
                case 'priority-low':
                    return (PRIORITY_ORDER[String(b.priority)] ?? 3) - (PRIORITY_ORDER[String(a.priority)] ?? 3);
                case 'room-asc':
                    return a.roomNumber.localeCompare(b.roomNumber);
                case 'room-desc':
                    return b.roomNumber.localeCompare(a.roomNumber);
                default:
                    return 0;
            }
        });

        return result;
    },

    /**
     * Paginate incidents
     */
    paginate(incidents: Incident[], page: number, rowsPerPage: number): Incident[] {
        const start = (page - 1) * rowsPerPage;
        return incidents.slice(start, start + rowsPerPage);
    },
};
