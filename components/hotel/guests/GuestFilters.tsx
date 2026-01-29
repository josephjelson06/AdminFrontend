'use client';

/**
 * GuestFilters Component
 * 
 * Search and date filter controls.
 */

import { Search, Calendar } from 'lucide-react';
import { DATE_FILTERS } from '@/lib/services/hotelGuestService';

interface GuestFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    dateFilter: string;
    onDateFilterChange: (filter: string) => void;
}

export function GuestFilters({ searchQuery, onSearchChange, dateFilter, onDateFilterChange }: GuestFiltersProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by name, booking ID, or room..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <select
                        value={dateFilter}
                        onChange={(e) => onDateFilterChange(e.target.value)}
                        className="px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {DATE_FILTERS.map((filter) => (
                            <option key={filter.id} value={filter.id}>{filter.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
