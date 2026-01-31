'use client';

/**
 * HotelFilters Component
 * 
 * Search and filter controls for the hotels list.
 */

import { Search, X, Filter } from 'lucide-react';
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
        <div className="p-4 sm:p-5">
            <div className="flex flex-col gap-4">
                {/* Search Row */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                        placeholder="Search by hotel name, city, or email..."
                        className="w-full pl-11 pr-4 py-3 input-glass rounded-xl text-sm"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted shrink-0">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter by:</span>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value as HotelFiltersType['status'])}
                        className="px-4 py-2.5 input-glass rounded-xl text-sm flex-1 sm:flex-none sm:min-w-[160px]"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Plan Filter */}
                    <select
                        value={filters.plan}
                        onChange={(e) => onFilterChange('plan', e.target.value as HotelFiltersType['plan'])}
                        className="px-4 py-2.5 input-glass rounded-xl text-sm flex-1 sm:flex-none sm:min-w-[160px]"
                    >
                        {planOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-xl transition-colors"
                        >
                            <X className="w-4 h-4" />
                            <span>Clear All</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
