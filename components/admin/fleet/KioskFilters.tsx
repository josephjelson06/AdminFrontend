'use client';

/**
 * KioskFilters Component
 * 
 * Search and filter controls for the kiosk fleet.
 */

import { Search, X, Wifi, WifiOff } from 'lucide-react';
import type { KioskFilters as KioskFiltersType } from './useKiosks';
import type { KioskStats } from '@/lib/services/kioskService';

interface KioskFiltersProps {
    filters: KioskFiltersType;
    onFilterChange: <K extends keyof KioskFiltersType>(key: K, value: KioskFiltersType[K]) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    stats: KioskStats;
    models: Array<{ value: string; label: string; count: number }>;
}

export function KioskFiltersBar({
    filters,
    onFilterChange,
    onClearFilters,
    hasActiveFilters,
    stats,
    models,
}: KioskFiltersProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-glass">
            <div className="flex items-center gap-4 flex-wrap">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                        placeholder="Search serial or hotel..."
                        className="pl-10 pr-4 py-2 glass-input rounded-lg text-sm w-64"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex gap-1 surface-glass-soft p-1 rounded-lg">
                    <button
                        onClick={() => onFilterChange('status', '')}
                        className={`px-3 py-1 rounded text-sm transition-all ${filters.status === '' ? 'surface-glass-strong text-primary' : 'text-muted hover:text-primary'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => onFilterChange('status', 'online')}
                        className={`px-3 py-1 rounded text-sm transition-all ${filters.status === 'online' ? 'surface-glass-strong text-success' : 'text-muted hover:text-success'
                            }`}
                    >
                        Online
                    </button>
                    <button
                        onClick={() => onFilterChange('status', 'offline')}
                        className={`px-3 py-1 rounded text-sm transition-all ${filters.status === 'offline' ? 'surface-glass-strong text-danger' : 'text-muted hover:text-danger'
                            }`}
                    >
                        Offline
                    </button>
                </div>

                {/* Model Filter */}
                {models.length > 0 && (
                    <select
                        value={filters.model}
                        onChange={(e) => onFilterChange('model', e.target.value)}
                        className="px-3 py-2 glass-input rounded-lg text-sm min-w-[140px]"
                    >
                        <option value="">All Models</option>
                        {models.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label} ({m.count})
                            </option>
                        ))}
                    </select>
                )}

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

            {/* Stats */}
            <div className="flex gap-3 text-sm font-medium">
                <span className="text-success flex items-center gap-1">
                    <Wifi className="w-4 h-4" /> {stats.online} Online
                </span>
                <span className="text-danger flex items-center gap-1">
                    <WifiOff className="w-4 h-4" /> {stats.offline} Offline
                </span>
            </div>
        </div>
    );
}
