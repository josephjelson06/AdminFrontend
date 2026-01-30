'use client';

/**
 * GuestQuickStats Component
 * 
 * Quick stats display with clickable filters.
 */

import type { GuestStats, GuestStatusFilter } from '@/lib/services/hotelGuestService';

interface GuestQuickStatsProps {
    stats: GuestStats;
    activeFilter: GuestStatusFilter;
    onFilterChange: (status: GuestStatusFilter) => void;
}

export function GuestQuickStats({ stats, activeFilter, onFilterChange }: GuestQuickStatsProps) {
    return (
        <div className="grid grid-cols-4 gap-3 mb-6">
            <button
                onClick={() => onFilterChange('all')}
                className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${activeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                    }`}
            >
                <div className={`text-xl font-bold ${activeFilter === 'all' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {stats.total}
                </div>
                <div className={`text-xs ${activeFilter === 'all' ? 'text-white/80' : 'text-slate-500'}`}>Total</div>
            </button>
            <button
                onClick={() => onFilterChange('verified')}
                className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${activeFilter === 'verified'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                    }`}
            >
                <div className={`text-xl font-bold ${activeFilter === 'verified' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {stats.verified}
                </div>
                <div className={`text-xs ${activeFilter === 'verified' ? 'text-white/80' : 'text-slate-500'}`}>Verified</div>
            </button>
            <button
                onClick={() => onFilterChange('manual')}
                className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${activeFilter === 'manual'
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                    }`}
            >
                <div className={`text-xl font-bold ${activeFilter === 'manual' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`}>
                    {stats.manual}
                </div>
                <div className={`text-xs ${activeFilter === 'manual' ? 'text-white/80' : 'text-slate-500'}`}>Manual</div>
            </button>
            <button
                onClick={() => onFilterChange('failed')}
                className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${activeFilter === 'failed'
                    ? 'bg-rose-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                    }`}
            >
                <div className={`text-xl font-bold ${activeFilter === 'failed' ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                    {stats.failed}
                </div>
                <div className={`text-xs ${activeFilter === 'failed' ? 'text-white/80' : 'text-slate-500'}`}>Failed</div>
            </button>
        </div>
    );
}
