'use client';

/**
 * Semantic Status System
 * 
 * A unified system for status, state, priority, and time indicators.
 * Status meaning determines appearance — not the page.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    AlertTriangle,
    Info,
    type LucideIcon,
} from 'lucide-react';

// =============================================================================
// SEMANTIC TOKENS
// =============================================================================

export type SemanticToken = 'success' | 'warning' | 'error' | 'info' | 'neutral';

// =============================================================================
// TOKEN STYLES
// =============================================================================

const tokenStyles: Record<SemanticToken, {
    badge: string;
    badgeSolid: string;
    dot: string;
    text: string;
    icon: LucideIcon;
}> = {
    success: {
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        badgeSolid: 'bg-emerald-500 text-white',
        dot: 'bg-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
        icon: CheckCircle2,
    },
    warning: {
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        badgeSolid: 'bg-amber-500 text-white',
        dot: 'bg-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
        icon: AlertCircle,
    },
    error: {
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        badgeSolid: 'bg-rose-500 text-white',
        dot: 'bg-rose-500',
        text: 'text-rose-600 dark:text-rose-400',
        icon: XCircle,
    },
    info: {
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        badgeSolid: 'bg-blue-500 text-white',
        dot: 'bg-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        icon: Info,
    },
    neutral: {
        badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        badgeSolid: 'bg-slate-500 text-white',
        dot: 'bg-slate-500',
        text: 'text-slate-600 dark:text-slate-400',
        icon: Info,
    },
};

// =============================================================================
// STATUS REGISTRY - Centralized meaning-to-token mapping
// =============================================================================

const STATUS_SEMANTICS: Record<string, SemanticToken> = {
    // Verification statuses
    verified: 'success',
    manual: 'warning',
    failed: 'error',

    // Room statuses
    ready: 'success',
    cleaning: 'warning',
    occupied: 'info',
    dirty: 'error',

    // Kiosk statuses
    online: 'success',
    offline: 'error',
    maintenance: 'warning',

    // Incident statuses
    Resolved: 'success',
    Assigned: 'warning',
    'In Progress': 'info',
    Reported: 'info',

    // Incident priorities
    'Immediate Fix': 'error',
    Critical: 'error',
    High: 'warning',
    Medium: 'warning',
    Low: 'neutral',

    // Account statuses
    active: 'success',
    inactive: 'neutral',

    // Financial statuses
    paid: 'success',
    pending: 'warning',
    overdue: 'error',
};

/**
 * Get semantic token for any status value
 */
export function getSemanticToken(status: string | null | undefined): SemanticToken {
    if (!status) return 'neutral';
    return STATUS_SEMANTICS[status] || STATUS_SEMANTICS[status.toLowerCase()] || 'neutral';
}

/**
 * Get styles for a semantic token
 */
export function getTokenStyles(token: SemanticToken) {
    return tokenStyles[token];
}

// =============================================================================
// STATUS BADGE
// =============================================================================

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: string;
    variant?: 'default' | 'solid' | 'outline';
    size?: 'sm' | 'md';
    showIcon?: boolean;
    icon?: LucideIcon;
    label?: string;
}

export function StatusBadge({
    status,
    variant = 'default',
    size = 'sm',
    showIcon = false,
    icon: CustomIcon,
    label,
    className,
    ...props
}: StatusBadgeProps) {
    const token = getSemanticToken(status);
    const styles = tokenStyles[token];
    const Icon = CustomIcon || styles.icon;
    const displayLabel = label || status;

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-xs'
        : 'px-2.5 py-1 text-xs';

    const variantClasses = {
        default: styles.badge,
        solid: styles.badgeSolid,
        outline: `border ${styles.text} bg-transparent`,
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 font-semibold rounded-full',
                sizeClasses,
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {showIcon && <Icon className="w-3 h-3" />}
            {displayLabel}
        </span>
    );
}

// =============================================================================
// PRIORITY BADGE
// =============================================================================

interface PriorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    priority: string | null;
    showIcon?: boolean;
}

export function PriorityBadge({
    priority,
    showIcon = true,
    className,
    ...props
}: PriorityBadgeProps) {
    const token = getSemanticToken(priority);
    const styles = tokenStyles[token];
    const displayLabel = priority || 'Unset';

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full',
                styles.badge,
                className
            )}
            {...props}
        >
            {showIcon && <AlertTriangle className="w-3 h-3" />}
            {displayLabel}
        </span>
    );
}

// =============================================================================
// STATE DOT
// =============================================================================

interface StateDotProps extends React.HTMLAttributes<HTMLDivElement> {
    status: string;
    size?: 'sm' | 'md' | 'lg';
    pulse?: boolean;
}

export function StateDot({
    status,
    size = 'md',
    pulse = false,
    className,
    ...props
}: StateDotProps) {
    const token = getSemanticToken(status);
    const styles = tokenStyles[token];

    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
    };

    return (
        <div
            className={cn(
                'rounded-full',
                sizeClasses[size],
                styles.dot,
                pulse && 'animate-pulse',
                className
            )}
            {...props}
        />
    );
}

// =============================================================================
// TIME META
// =============================================================================

interface TimeMetaProps extends React.HTMLAttributes<HTMLDivElement> {
    time: string;
    variant?: 'relative' | 'countdown' | 'date';
    showIcon?: boolean;
    alertThreshold?: number; // Days remaining to trigger warning
}

export function TimeMeta({
    time,
    variant = 'relative',
    showIcon = true,
    alertThreshold = 30,
    className,
    ...props
}: TimeMetaProps) {
    // Parse countdown variant for styling
    let tokenClass = 'text-slate-500 dark:text-slate-400';

    if (variant === 'countdown') {
        const daysMatch = time.match(/(\d+)\s*days?/i);
        if (daysMatch) {
            const days = parseInt(daysMatch[1], 10);
            if (days <= 7) {
                tokenClass = tokenStyles.error.text;
            } else if (days <= alertThreshold) {
                tokenClass = tokenStyles.warning.text;
            }
        }
    }

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 text-xs',
                tokenClass,
                className
            )}
            {...props}
        >
            {showIcon && <Clock className="w-3 h-3" />}
            {time}
        </div>
    );
}

// =============================================================================
// STATUS ICON
// =============================================================================

interface StatusIconProps extends React.HTMLAttributes<HTMLDivElement> {
    status: string;
    size?: 'sm' | 'md' | 'lg';
}

export function StatusIcon({
    status,
    size = 'md',
    className,
    ...props
}: StatusIconProps) {
    const token = getSemanticToken(status);
    const styles = tokenStyles[token];
    const Icon = styles.icon;

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <div className={cn(styles.text, className)} {...props}>
            <Icon className={sizeClasses[size]} />
        </div>
    );
}

// =============================================================================
// LEGACY COMPATIBILITY - Wrapper functions for existing helper signatures
// =============================================================================

export function getStatusBadgeClasses(status: string): string {
    const token = getSemanticToken(status);
    return tokenStyles[token].badge;
}

export function getStatusDotClasses(status: string): string {
    const token = getSemanticToken(status);
    return tokenStyles[token].dot;
}

export function getStatusSolidClasses(status: string): string {
    const token = getSemanticToken(status);
    return tokenStyles[token].badgeSolid;
}
