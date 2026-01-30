'use client';

/**
 * Unified Toolbar System
 * 
 * A system-driven toolbar for all list and table pages.
 * Toolbars are composed of 4 zones: Query, Filter, Context, Action.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    Search,
    X,
    ChevronDown,
    Check,
    type LucideIcon,
} from 'lucide-react';
import { getSemanticToken, getTokenStyles, type SemanticToken } from './status-system';

// =============================================================================
// TOOLBAR CONTAINER
// =============================================================================

export type ToolbarDensity = 'compact' | 'comfortable';
export type ToolbarEmphasis = 'query-heavy' | 'filter-heavy' | 'action-heavy' | 'balanced';

interface BaseToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    density?: ToolbarDensity;
    emphasis?: ToolbarEmphasis;
    children: React.ReactNode;
}

export function BaseToolbar({
    density = 'comfortable',
    emphasis = 'balanced',
    children,
    className,
    ...props
}: BaseToolbarProps) {
    const densityClasses = {
        compact: 'p-3 gap-2',
        comfortable: 'p-4 gap-3',
    };

    return (
        <div
            className={cn(
                'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-6',
                densityClasses[density],
                className
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row gap-3">
                {children}
            </div>
        </div>
    );
}

// =============================================================================
// TOOLBAR ZONES
// =============================================================================

interface ZoneProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function ToolbarQueryZone({ children, className, ...props }: ZoneProps) {
    return (
        <div className={cn('flex-1 min-w-0', className)} {...props}>
            {children}
        </div>
    );
}

export function ToolbarFilterZone({ children, className, ...props }: ZoneProps) {
    return (
        <div className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
            {children}
        </div>
    );
}

export function ToolbarContextZone({ children, className, ...props }: ZoneProps) {
    return (
        <div className={cn('flex items-center gap-3', className)} {...props}>
            {children}
        </div>
    );
}

export function ToolbarActionZone({ children, className, ...props }: ZoneProps) {
    return (
        <div className={cn('flex items-center gap-2', className)} {...props}>
            {children}
        </div>
    );
}

// =============================================================================
// TOOLBAR SEARCH
// =============================================================================

interface ToolbarSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
}

export function ToolbarSearch({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    className,
    ...props
}: ToolbarSearchProps) {
    const handleClear = () => {
        onChange('');
        onClear?.();
    };

    return (
        <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    'w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all',
                    className
                )}
                {...props}
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
            )}
        </div>
    );
}

// =============================================================================
// TOOLBAR SELECT (Dropdown)
// =============================================================================

interface ToolbarSelectOption<T> {
    value: T;
    label: string;
}

interface ToolbarSelectProps<T> {
    options: ToolbarSelectOption<T>[];
    value: T;
    onChange: (value: T) => void;
    icon?: LucideIcon;
    placeholder?: string;
    className?: string;
}

export function ToolbarSelect<T extends string | number | null>({
    options,
    value,
    onChange,
    icon: Icon,
    placeholder,
    className,
}: ToolbarSelectProps<T>) {
    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    // Close on outside click
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);
    const displayLabel = selectedOption?.label || placeholder || 'Select...';
    const isActive = value !== options[0]?.value; // First option is typically "all"

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-colors',
                    isActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500',
                    className
                )}
            >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{displayLabel}</span>
                <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-1 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[150px]">
                    {options.map((opt) => (
                        <button
                            key={String(opt.value)}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                'w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between',
                                value === opt.value
                                    ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                                    : 'text-slate-700 dark:text-slate-300'
                            )}
                        >
                            {opt.label}
                            {value === opt.value && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// =============================================================================
// TOOLBAR TABS (Segmented Control)
// =============================================================================

interface ToolbarTabOption {
    id: string;
    label: string;
    color?: string;
    count?: number;
}

interface ToolbarTabsProps {
    options: ToolbarTabOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ToolbarTabs({
    options,
    value,
    onChange,
    className,
}: ToolbarTabsProps) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onChange(option.id)}
                    className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5',
                        value === option.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    )}
                >
                    {option.color && (
                        <span className={cn('w-2 h-2 rounded-full', option.color)} />
                    )}
                    {option.label}
                    {option.count !== undefined && (
                        <span className={cn(
                            'px-1.5 py-0.5 text-xs rounded-full',
                            value === option.id
                                ? 'bg-white/20'
                                : 'bg-slate-200 dark:bg-slate-600'
                        )}>
                            {option.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

// =============================================================================
// TOOLBAR BUTTON
// =============================================================================

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: LucideIcon;
    loading?: boolean;
    variant?: 'default' | 'primary' | 'danger';
}

export function ToolbarButton({
    icon: Icon,
    loading = false,
    variant = 'default',
    children,
    className,
    disabled,
    ...props
}: ToolbarButtonProps) {
    const variantClasses = {
        default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700',
        primary: 'bg-indigo-600 border border-indigo-600 text-white hover:bg-indigo-700',
        danger: 'bg-rose-600 border border-rose-600 text-white hover:bg-rose-700',
    };

    return (
        <button
            disabled={disabled || loading}
            className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50',
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {Icon && (
                <Icon className={cn('w-4 h-4', loading && 'animate-spin')} />
            )}
            {children}
        </button>
    );
}

// =============================================================================
// TOOLBAR COUNT (Context indicator)
// =============================================================================

interface ToolbarCountProps {
    label: string;
    value: number;
    status?: string;
    onClick?: () => void;
    className?: string;
}

export function ToolbarCount({
    label,
    value,
    status,
    onClick,
    className,
}: ToolbarCountProps) {
    const token = status ? getSemanticToken(status) : 'neutral';
    const styles = getTokenStyles(token);

    const content = (
        <>
            <span className={cn('text-lg font-bold', styles.text)}>{value}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
        </>
    );

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={cn(
                    'flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors',
                    className
                )}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={cn('flex flex-col items-center px-3 py-1.5', className)}>
            {content}
        </div>
    );
}

// =============================================================================
// TOOLBAR DIVIDER
// =============================================================================

export function ToolbarDivider({ className }: { className?: string }) {
    return (
        <div className={cn('hidden lg:block w-px h-8 bg-slate-200 dark:bg-slate-700', className)} />
    );
}

// =============================================================================
// TOOLBAR CLEAR FILTERS
// =============================================================================

interface ToolbarClearFiltersProps {
    activeCount: number;
    onClear: () => void;
    className?: string;
}

export function ToolbarClearFilters({
    activeCount,
    onClear,
    className,
}: ToolbarClearFiltersProps) {
    if (activeCount === 0) return null;

    return (
        <button
            onClick={onClear}
            className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors',
                className
            )}
        >
            <X className="w-3.5 h-3.5" />
            Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
        </button>
    );
}
