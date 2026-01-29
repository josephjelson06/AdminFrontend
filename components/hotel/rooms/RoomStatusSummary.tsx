'use client';

/**
 * RoomStatusSummary Component
 * 
 * Quick stats display with clickable filters.
 */

import type { RoomStats } from '@/lib/services/hotelRoomService';

interface RoomStatusSummaryProps {
    stats: RoomStats;
    activeFilter: string;
    onFilterChange: (status: string) => void;
}

const statItems = [
    { key: 'ready', label: 'Ready', color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { key: 'cleaning', label: 'Cleaning', color: 'from-amber-500 to-amber-600', textColor: 'text-amber-600 dark:text-amber-400' },
    { key: 'occupied', label: 'Occupied', color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600 dark:text-blue-400' },
    { key: 'dirty', label: 'Dirty', color: 'from-rose-500 to-rose-600', textColor: 'text-rose-600 dark:text-rose-400' },
] as const;

export function RoomStatusSummary({ stats, activeFilter, onFilterChange }: RoomStatusSummaryProps) {
    return (
        <div className="grid grid-cols-4 gap-3 mb-6">
            {statItems.map((stat) => (
                <button
                    key={stat.key}
                    onClick={() => onFilterChange(activeFilter === stat.key ? 'all' : stat.key)}
                    className={`relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 ${activeFilter === stat.key
                            ? `bg-gradient-to-br ${stat.color} text-white shadow-lg`
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                >
                    <div className={`text-2xl sm:text-3xl font-bold ${activeFilter === stat.key ? 'text-white' : stat.textColor}`}>
                        {stats[stat.key]}
                    </div>
                    <div className={`text-xs font-medium ${activeFilter === stat.key ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {stat.label}
                    </div>
                </button>
            ))}
        </div>
    );
}
