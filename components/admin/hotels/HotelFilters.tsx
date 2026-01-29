'use client';

/**
 * HotelFilters Component
 * 
 * Search and filter controls for the hotels list.
 */

import { Search, X } from 'lucide-react';
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
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-glass">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                    placeholder="Search hotels..."
                    className="w-full pl-10 pr-4 py-2 glass-input rounded-lg text-sm"
                />
            </div>

            {/* Status Filter */}
            <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value as HotelFiltersType['status'])}
                className="px-3 py-2 glass-input rounded-lg text-sm min-w-[140px]"
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
                className="px-3 py-2 glass-input rounded-lg text-sm min-w-[140px]"
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
                    className="flex items-center gap-1 px-3 py-2 text-sm text-muted hover:text-primary transition-colors"
                >
                    <X className="w-4 h-4" />
                    Clear
                </button>
            )}
        </div>
    );
}
