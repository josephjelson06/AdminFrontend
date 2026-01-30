'use client';

/**
 * ExportFilters Component
 * 
 * Filters and search for report data.
 */

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';

export interface FilterOption {
    id: string;
    label: string;
    type: 'select' | 'search';
    options?: { value: string; label: string }[];
}

interface ExportFiltersProps {
    filters: FilterOption[];
    values: Record<string, string>;
    onChange: (id: string, value: string) => void;
    onClear: () => void;
}

export function ExportFilters({ filters, values, onChange, onClear }: ExportFiltersProps) {
    const hasActiveFilters = Object.values(values).some((v) => v !== '');

    return (
        <GlassCard>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-warning" />
                        <h3 className="text-base font-semibold text-primary">Filters</h3>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            className="flex items-center gap-1 text-xs text-danger hover:text-red-400 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Clear All
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {filters.map((filter) => (
                        <div key={filter.id} className="space-y-2">
                            <label className="text-xs font-medium text-muted uppercase tracking-wide">
                                {filter.label}
                            </label>
                            {filter.type === 'search' ? (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                                    <input
                                        type="text"
                                        value={values[filter.id] || ''}
                                        onChange={(e) => onChange(filter.id, e.target.value)}
                                        placeholder={`Search ${filter.label.toLowerCase()}...`}
                                        className="input-glass w-full pl-10"
                                    />
                                </div>
                            ) : (
                                <select
                                    value={values[filter.id] || ''}
                                    onChange={(e) => onChange(filter.id, e.target.value)}
                                    className="input-glass w-full"
                                >
                                    <option value="">All {filter.label}</option>
                                    {filter.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}
