'use client';

/**
 * GuestFilters Component
 * 
 * Search and date filter controls using the toolbar system.
 */

import { Calendar } from 'lucide-react';
import { DATE_FILTERS } from '@/lib/services/hotelGuestService';
import {
    BaseToolbar,
    ToolbarQueryZone,
    ToolbarFilterZone,
    ToolbarSearch,
    ToolbarSelect,
} from '@/components/hotel/shared';

interface GuestFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    dateFilter: string;
    onDateFilterChange: (filter: string) => void;
}

export function GuestFilters({ searchQuery, onSearchChange, dateFilter, onDateFilterChange }: GuestFiltersProps) {
    // Convert date filters to select options
    const dateOptions = DATE_FILTERS.map(f => ({
        value: f.id,
        label: f.label,
    }));

    return (
        <BaseToolbar density="comfortable">
            <ToolbarQueryZone>
                <ToolbarSearch
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search by name, booking ID, or room..."
                />
            </ToolbarQueryZone>
            <ToolbarFilterZone>
                <ToolbarSelect
                    options={dateOptions}
                    value={dateFilter}
                    onChange={onDateFilterChange}
                    icon={Calendar}
                />
            </ToolbarFilterZone>
        </BaseToolbar>
    );
}
