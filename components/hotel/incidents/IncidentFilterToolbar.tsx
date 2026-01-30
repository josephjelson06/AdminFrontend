'use client';

/**
 * IncidentFilterToolbar Component
 * 
 * Filter toolbar for incidents using the unified toolbar system.
 */

import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import {
    type IncidentPriority,
    type IncidentStatus,
} from '@/lib/hotel/hotel-data';
import {
    SORT_OPTIONS,
    STATUS_OPTIONS,
    PRIORITY_FILTER_OPTIONS,
    type SortOption,
} from '@/lib/services/hotelIncidentsService';
import {
    BaseToolbar,
    ToolbarQueryZone,
    ToolbarFilterZone,
    ToolbarSearch,
    ToolbarSelect,
    ToolbarClearFilters,
} from '@/components/hotel/shared';

interface IncidentFilterToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sortBy: SortOption;
    onSortChange: (value: SortOption) => void;
    statusFilter: IncidentStatus | 'all';
    onStatusChange: (value: IncidentStatus | 'all') => void;
    priorityFilter: IncidentPriority | 'all';
    onPriorityChange: (value: IncidentPriority | 'all') => void;
    onClearFilters: () => void;
    activeFilterCount: number;
}

export function IncidentFilterToolbar({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
    onClearFilters,
    activeFilterCount,
}: IncidentFilterToolbarProps) {
    // Convert options to the format expected by ToolbarSelect
    const statusOptions = STATUS_OPTIONS.map(opt => ({
        value: opt.value as IncidentStatus | 'all',
        label: opt.label,
    }));

    const priorityOptions = PRIORITY_FILTER_OPTIONS.map(opt => ({
        value: opt.value as IncidentPriority | 'all',
        label: opt.label,
    }));

    const sortOptions = SORT_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label,
    }));

    return (
        <BaseToolbar density="comfortable">
            <ToolbarQueryZone>
                <ToolbarSearch
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search by room, guest name, or description..."
                />
            </ToolbarQueryZone>
            <ToolbarFilterZone>
                <ToolbarSelect
                    options={statusOptions}
                    value={statusFilter}
                    onChange={onStatusChange}
                    icon={Filter}
                    placeholder="Status"
                />
                <ToolbarSelect
                    options={priorityOptions}
                    value={priorityFilter}
                    onChange={onPriorityChange}
                    icon={SlidersHorizontal}
                    placeholder="Priority"
                />
                <ToolbarSelect
                    options={sortOptions}
                    value={sortBy}
                    onChange={onSortChange}
                    icon={ArrowUpDown}
                    placeholder="Sort"
                />
                <ToolbarClearFilters
                    activeCount={activeFilterCount}
                    onClear={onClearFilters}
                />
            </ToolbarFilterZone>
        </BaseToolbar>
    );
}
