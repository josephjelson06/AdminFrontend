/**
 * Unit Tests for Formatters
 */

import { describe, it, expect } from 'vitest';
import {
    formatCurrency,
    formatCompactNumber,
    formatNumber,
    formatPercent,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    truncate,
    capitalize,
    titleCase,
    toLabel,
    getStatusVariant,
    getPriorityVariant,
} from '@/lib/utils/formatters';

describe('Currency Formatting', () => {
    it('formats USD correctly', () => {
        expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });

    it('formats INR correctly', () => {
        expect(formatCurrency(1234, 'INR', 'en-IN')).toMatch(/₹/);
    });

    it('handles zero', () => {
        expect(formatCurrency(0, 'USD')).toBe('$0');
    });

    it('handles negative numbers', () => {
        expect(formatCurrency(-500, 'USD')).toBe('-$500');
    });
});

describe('Compact Number Formatting', () => {
    it('formats thousands', () => {
        expect(formatCompactNumber(1500)).toBe('1.5K');
    });

    it('formats millions', () => {
        expect(formatCompactNumber(2500000)).toBe('2.5M');
    });

    it('formats billions', () => {
        expect(formatCompactNumber(1200000000)).toBe('1.2B');
    });

    it('keeps small numbers as-is', () => {
        expect(formatCompactNumber(999)).toBe('999');
    });
});

describe('Date Formatting', () => {
    it('formats ISO date correctly', () => {
        const result = formatDate('2024-01-15T10:30:00Z');
        expect(result).toMatch(/Jan 15, 2024/);
    });

    it('handles invalid date', () => {
        expect(formatDate('not-a-date')).toBe('Invalid date');
    });

    it('formats datetime correctly', () => {
        const result = formatDateTime('2024-01-15T10:30:00Z');
        expect(result).toMatch(/Jan 15, 2024/);
    });
});

describe('Text Formatting', () => {
    it('truncates long text', () => {
        expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('keeps short text unchanged', () => {
        expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('capitalizes correctly', () => {
        expect(capitalize('hello')).toBe('Hello');
        expect(capitalize('HELLO')).toBe('Hello');
    });

    it('converts to title case', () => {
        expect(titleCase('hello world')).toBe('Hello World');
        expect(titleCase('hello_world')).toBe('Hello World');
    });

    it('converts snake_case to label', () => {
        expect(toLabel('user_name')).toBe('User Name');
    });
});

describe('Status Variant', () => {
    it('returns success for active', () => {
        expect(getStatusVariant('active')).toBe('success');
        expect(getStatusVariant('online')).toBe('success');
        expect(getStatusVariant('paid')).toBe('success');
    });

    it('returns warning for pending', () => {
        expect(getStatusVariant('pending')).toBe('warning');
        expect(getStatusVariant('trial')).toBe('warning');
    });

    it('returns danger for inactive', () => {
        expect(getStatusVariant('inactive')).toBe('danger');
        expect(getStatusVariant('overdue')).toBe('danger');
    });

    it('returns neutral for unknown', () => {
        expect(getStatusVariant('unknown')).toBe('neutral');
    });
});

describe('Priority Variant', () => {
    it('returns correct variants', () => {
        expect(getPriorityVariant('critical')).toBe('danger');
        expect(getPriorityVariant('high')).toBe('warning');
        expect(getPriorityVariant('medium')).toBe('info');
        expect(getPriorityVariant('low')).toBe('neutral');
    });
});
