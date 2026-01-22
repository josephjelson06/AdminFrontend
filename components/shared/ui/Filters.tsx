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
            {label && <span className="text-sm text-slate-500">{label}:</span>}
            <div className="flex items-center gap-1.5">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => toggle(opt.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${selected.includes(opt.value)
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            <span className="text-xs text-slate-500">Active filters:</span>
            <div className="flex items-center gap-1.5">
                {filters.map((filter) => (
                    <span
                        key={filter.key}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full text-xs text-slate-700"
                    >
                        <span className="text-slate-400">{filter.label}:</span>
                        {filter.value}
                        <button
                            onClick={() => onRemove(filter.key)}
                            className="hover:text-slate-900 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            <button
                onClick={onClearAll}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
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
            className="px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 w-64"
        />
    );
}
