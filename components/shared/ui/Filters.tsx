'use client';

import { X } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterChipsProps {
    options: FilterOption[];
    selected: string[];
    onChange: (values: string[]) => void;
    label?: string;
}

export function FilterChips({ options, selected, onChange, label }: FilterChipsProps) {
    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-sm text-muted">{label}:</span>}
            <div className="flex items-center gap-1.5">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => toggle(opt.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-normal ${selected.includes(opt.value)
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-500/25'
                            : 'surface-glass-soft text-secondary hover:text-primary'
                            }`}
                    >
                        {opt.label}
                        {opt.count !== undefined && (
                            <span className="ml-1 opacity-70">({opt.count})</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface ActiveFiltersProps {
    filters: { key: string; label: string; value: string }[];
    onRemove: (key: string) => void;
    onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
    if (filters.length === 0) return null;

    return (
        <div className="flex items-center gap-2 py-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Active filters:</span>
            <div className="flex items-center gap-1.5">
                {filters.map((filter) => (
                    <span
                        key={filter.key}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300"
                    >
                        <span className="text-slate-400 dark:text-slate-500">{filter.label}:</span>
                        {filter.value}
                        <button
                            onClick={() => onRemove(filter.key)}
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            <button
                onClick={onClearAll}
                className="text-xs text-muted hover:text-primary underline transition-colors duration-normal"
            >
                Clear all
            </button>
        </div>
    );
}

interface SearchFilterProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchFilter({ value, onChange, placeholder = 'Search...' }: SearchFilterProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="input-glass w-64"
        />
    );
}
