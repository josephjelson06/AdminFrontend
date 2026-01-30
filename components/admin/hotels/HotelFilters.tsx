'use client';

/**
 * HotelFilters Component
 * 
 * Search and filter controls for the hotels list using unified Toolbar.
 */

import { Filter } from 'lucide-react';
import {
    Toolbar,
    ToolbarSearch,
    ToolbarFilterDropdown,
    ToolbarClearFilters,
    ToolbarDivider,
} from '@/components/shared/ui/Toolbar';
import type { HotelFilters as HotelFiltersType } from './useHotels';

interface HotelFiltersProps {
    filters: HotelFiltersType;
    onFilterChange: <K extends keyof HotelFiltersType>(key: K, value: HotelFiltersType[K]) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
];

const planOptions = [
    { value: '', label: 'All Plans' },
    { value: 'basic', label: 'Basic' },
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' },
];

export function HotelFiltersBar({
    filters,
    onFilterChange,
    onClearFilters,
    hasActiveFilters,
}: HotelFiltersProps) {
    return (
        <Toolbar
            search={
                <ToolbarSearch
                    value={filters.search}
                    onChange={(value) => onFilterChange('search', value)}
                    placeholder="Search by hotel name, city, or email..."
                />
            }
            filters={
                <>
                    <div className="flex items-center gap-2 text-sm text-muted shrink-0">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter by:</span>
                    </div>
                    <ToolbarFilterDropdown
                        value={filters.status}
                        onChange={(value) => onFilterChange('status', value as HotelFiltersType['status'])}
                        options={statusOptions}
                    />
                    <ToolbarFilterDropdown
                        value={filters.plan}
                        onChange={(value) => onFilterChange('plan', value as HotelFiltersType['plan'])}
                        options={planOptions}
                    />
                    <ToolbarClearFilters
                        onClick={onClearFilters}
                        visible={hasActiveFilters}
                    />
                </>
            }
        />
    );
}
