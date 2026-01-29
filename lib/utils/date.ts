import { formatDistanceToNow, format, parseISO, isValid } from 'date-fns';

/**
 * Date utility functions for consistent date handling across the app
 */

/**
 * Format an ISO date string to relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(isoDate: string): string {
    try {
        const date = parseISO(isoDate);
        if (!isValid(date)) return 'Invalid date';
        return formatDistanceToNow(date, { addSuffix: true });
    } catch {
        return 'Invalid date';
    }
}

/**
 * Format an ISO date string to a readable format
 */
export function formatDate(isoDate: string, formatStr: string = 'MMM d, yyyy'): string {
    try {
        const date = parseISO(isoDate);
        if (!isValid(date)) return 'Invalid date';
        return format(date, formatStr);
    } catch {
        return 'Invalid date';
    }
}

/**
 * Format an ISO date string to date and time
 */
export function formatDateTime(isoDate: string): string {
    return formatDate(isoDate, 'MMM d, yyyy h:mm a');
}

/**
 * Get ISO string for N minutes ago (for generating mock data)
 */
export function minutesAgo(minutes: number): string {
    return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

/**
 * Get ISO string for N hours ago
 */
export function hoursAgo(hours: number): string {
    return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/**
 * Get ISO string for N days ago
 */
export function daysAgo(days: number): string {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Check if a date is within the last N days
 */
export function isWithinDays(isoDate: string, days: number): boolean {
    try {
        const date = parseISO(isoDate);
        if (!isValid(date)) return false;
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return date >= cutoff;
    } catch {
        return false;
    }
}
