'use client';

/**
 * KioskFilters Component
 * 
 * Search and filter controls for the kiosk fleet using unified Toolbar.
 */

import { Wifi, WifiOff } from 'lucide-react';
import {
    Toolbar,
    ToolbarSearch,
    ToolbarFilterTabs,
    ToolbarFilterDropdown,
    ToolbarClearFilters,
    ToolbarDivider,
} from '@/components/shared/ui/Toolbar';
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

const statusTabs = [
    { id: '', label: 'All' },
    { id: 'online', label: 'Online' },
    { id: 'offline', label: 'Offline' },
];

export function KioskFiltersBar({
    filters,
    onFilterChange,
    onClearFilters,
    hasActiveFilters,
    stats,
    models,
}: KioskFiltersProps) {
    // Convert models to dropdown options
    const modelOptions = [
        { value: '', label: 'All Models' },
        ...models.map((m) => ({ value: m.value, label: `${m.label} (${m.count})` })),
    ];

    return (
        <Toolbar
            search={
                <ToolbarSearch
                    value={filters.search}
                    onChange={(value) => onFilterChange('search', value)}
                    placeholder="Search serial or hotel..."
                />
            }
            filters={
                <>
                    <ToolbarFilterTabs
                        tabs={statusTabs}
                        activeTab={filters.status}
                        onTabChange={(id) => onFilterChange('status', id as KioskFiltersType['status'])}
                    />
                    {models.length > 0 && (
                        <ToolbarFilterDropdown
                            value={filters.model}
                            onChange={(value) => onFilterChange('model', value)}
                            options={modelOptions}
                        />
                    )}
                    <ToolbarClearFilters
                        onClick={onClearFilters}
                        visible={hasActiveFilters}
                    />
                </>
            }
            context={
                <div className="flex gap-3 text-sm font-medium">
                    <span className="text-success flex items-center gap-1">
                        <Wifi className="w-4 h-4" /> {stats.online} Online
                    </span>
                    <span className="text-danger flex items-center gap-1">
                        <WifiOff className="w-4 h-4" /> {stats.offline} Offline
                    </span>
                </div>
            }
        />
    );
}
