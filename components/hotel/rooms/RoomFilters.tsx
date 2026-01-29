'use client';

/**
 * RoomFilters Component
 * 
 * Floor and status filter controls.
 */

import { Filter } from 'lucide-react';
import { FLOOR_FILTERS, STATUS_FILTERS } from '@/lib/services/hotelRoomService';

interface RoomFiltersProps {
    floorFilter: string;
    onFloorChange: (floor: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
}

export function RoomFilters({ floorFilter, onFloorChange, statusFilter, onStatusChange }: RoomFiltersProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={floorFilter}
                        onChange={(e) => onFloorChange(e.target.value)}
                        className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {FLOOR_FILTERS.map((filter) => (
                            <option key={filter.id} value={filter.id}>{filter.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => onStatusChange(filter.id)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${statusFilter === filter.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${filter.color}`} />
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
