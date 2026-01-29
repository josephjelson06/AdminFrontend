/**
 * Formatting Utilities
 * 
 * Centralized formatters for consistent data display across the app.
 * These replace inline formatters scattered throughout page components.
 */

// ============================================
// CURRENCY FORMATTING
// ============================================

const currencyFormatters: Record<string, Intl.NumberFormat> = {};

/**
 * Format a number as currency
 * @param amount - The numeric amount
 * @param currency - Currency code (USD, INR, EUR, etc.)
 * @param locale - Locale for formatting (default: en-US)
 */
export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    const key = `${currency}-${locale}`;

    if (!currencyFormatters[key]) {
        currencyFormatters[key] = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    }

    return currencyFormatters[key].format(amount);
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatCompactNumber(value: number): string {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toString();
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format an ISO date string to a readable format
 */
export function formatDate(
    dateString: string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }
): string {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleDateString('en-US', options);
    } catch {
        return 'Invalid date';
    }
}

/**
 * Format an ISO date string to date and time
 */
export function formatDateTime(dateString: string): string {
    return formatDate(dateString, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

/**
 * Format relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(dateString: string): string {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSeconds < 60) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return formatDate(dateString);
    } catch {
        return 'Invalid date';
    }
}

/**
 * Format time only
 */
export function formatTime(dateString: string): string {
    return formatDate(dateString, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

// ============================================
// TEXT FORMATTING
// ============================================

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert to title case
 */
export function titleCase(text: string): string {
    return text
        .split(/[\s_-]+/)
        .map(word => capitalize(word))
        .join(' ');
}

/**
 * Convert snake_case or kebab-case to readable label
 */
export function toLabel(key: string): string {
    return titleCase(key.replace(/[_-]/g, ' '));
}

// ============================================
// STATUS FORMATTING
// ============================================

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * Get status badge variant based on status value
 */
export function getStatusVariant(status: string): StatusVariant {
    const statusLower = status.toLowerCase();

    // Success states
    if (['active', 'online', 'paid', 'resolved', 'completed', 'success'].includes(statusLower)) {
        return 'success';
    }

    // Warning states
    if (['pending', 'trial', 'in_progress', 'maintenance', 'warning'].includes(statusLower)) {
        return 'warning';
    }

    // Danger states
    if (['inactive', 'offline', 'overdue', 'cancelled', 'suspended', 'critical', 'error'].includes(statusLower)) {
        return 'danger';
    }

    // Info states
    if (['open', 'new', 'unassigned'].includes(statusLower)) {
        return 'info';
    }

    return 'neutral';
}

/**
 * Get priority badge variant
 */
export function getPriorityVariant(priority: string): StatusVariant {
    const priorityLower = priority.toLowerCase();

    if (priorityLower === 'critical') return 'danger';
    if (priorityLower === 'high') return 'warning';
    if (priorityLower === 'medium') return 'info';
    return 'neutral';
}
