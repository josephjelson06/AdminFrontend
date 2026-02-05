'use client';

import { Filter, X } from 'lucide-react';
import type { RoomFilters as FilterType } from './types';

interface RoomFiltersProps {
    filters: FilterType;
    onChange: (filters: FilterType) => void;
}

const STATUS_OPTIONS = [
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'cleaning', label: 'Cleaning' },
];

export function RoomFilters({ filters, onChange }: RoomFiltersProps) {
    const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

    const clearFilters = () => {
        onChange({});
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70">
                <Filter className="w-4 h-4" />
                <span>Filters:</span>
            </div>

            <select
                value={filters.status || ''}
                onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 transition-colors"
                style={{ colorScheme: 'dark' }}
            >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Floor..."
                value={filters.floor || ''}
                onChange={(e) => onChange({ ...filters, floor: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 transition-colors"
            />

            <input
                type="text"
                placeholder="Room Type..."
                value={filters.room_type || ''}
                onChange={(e) => onChange({ ...filters, room_type: e.target.value || undefined })}
                className="w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 transition-colors"
            />

            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                    Clear
                </button>
            )}
        </div>
    );
}
