'use client';

/**
 * Unified Toolbar System
 * 
 * A composable toolbar with 4 defined zones:
 * - Search Zone: Primary query input
 * - Filter Zone: Tabs, chips, dropdowns
 * - Context Zone: Status indicators, counts
 * - Action Zone: Export, create buttons
 */

import { ReactNode, useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

// ============================================
// TYPES
// ============================================

export interface ToolbarProps {
    /** Search zone content */
    search?: ReactNode;
    /** Filter zone content */
    filters?: ReactNode;
    /** Context zone content (status indicators) */
    context?: ReactNode;
    /** Action zone content (buttons) */
    actions?: ReactNode;
    /** Additional class names */
    className?: string;
}

export interface ToolbarSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface ToolbarFilterTabsProps {
    tabs: {
        id: string;
        label: string;
        count?: number;
        color?: string;
    }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export interface ToolbarFilterDropdownProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    className?: string;
}

export interface ToolbarStatusBadgeProps {
    label: string;
    count: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    pulse?: boolean;
}

// ============================================
// MAIN TOOLBAR COMPONENT
// ============================================

export function Toolbar({
    search,
    filters,
    context,
    actions,
    className = '',
}: ToolbarProps) {
    return (
        <GlassCard className={`p-0 ${className}`}>
            <div className="flex flex-col">
                {/* Primary Row: Search + Actions */}
                {(search || actions) && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-3 border-b border-glass">
                        {search && (
                            <div className="flex-1 min-w-0">
                                {search}
                            </div>
                        )}
                        {(context || actions) && (
                            <div className="flex items-center gap-3 shrink-0">
                                {context}
                                {actions}
                            </div>
                        )}
                    </div>
                )}

                {/* Secondary Row: Filters */}
                {filters && (
                    <div className="px-4 py-2.5 flex flex-wrap items-center gap-3">
                        {filters}
                    </div>
                )}
            </div>
        </GlassCard>
    );
}

// ============================================
// TOOLBAR SUB-COMPONENTS
// ============================================

/**
 * Search input with icon
 */
export function ToolbarSearch({
    value,
    onChange,
    placeholder = 'Search...',
    className = '',
}: ToolbarSearchProps) {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-2.5 input-glass rounded-xl text-sm"
            />
        </div>
    );
}

/**
 * Filter tabs (segmented control style)
 */
export function ToolbarFilterTabs({
    tabs,
    activeTab,
    onTabChange,
}: ToolbarFilterTabsProps) {
    return (
        <div className="flex items-center gap-1 surface-glass-soft p-1 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-fast ${activeTab === tab.id
                        ? 'surface-glass-strong text-primary shadow-sm'
                        : 'text-muted hover:text-secondary-text'
                        }`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span
                            className={`px-1.5 py-0.5 rounded-md text-xs ${activeTab === tab.id
                                ? 'bg-primary text-inverse'
                                : `surface-glass ${tab.color || 'text-muted'}`
                                }`}
                        >
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

/**
 * Filter dropdown
 */
export function ToolbarFilterDropdown({
    label,
    value,
    onChange,
    options,
    className = '',
}: ToolbarFilterDropdownProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {label && <span className="text-sm text-muted whitespace-nowrap">{label}</span>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-glass py-2 px-3 pr-8 rounded-xl text-sm min-w-[120px]"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

/**
 * Status badge with optional count
 */
export function ToolbarStatusBadge({
    label,
    count,
    variant = 'default',
    pulse = false,
}: ToolbarStatusBadgeProps) {
    const variants = {
        default: 'badge-default',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
    };

    return (
        <div className={`${variants[variant]} flex items-center gap-2 px-3 py-1.5 text-sm font-medium`}>
            {pulse && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                </span>
            )}
            <span>{count}</span>
            <span className="text-xs opacity-80">{label}</span>
        </div>
    );
}

/**
 * Divider for separating filter groups
 */
export function ToolbarDivider() {
    return <div className="h-6 w-px bg-glass hidden sm:block" />;
}

/**
 * Clear filters button
 */
export function ToolbarClearFilters({
    onClick,
    visible = true,
}: {
    onClick: () => void;
    visible?: boolean;
}) {
    if (!visible) return null;

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors"
        >
            <X className="w-3.5 h-3.5" />
            Clear
        </button>
    );
}
