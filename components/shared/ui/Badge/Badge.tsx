'use client';

import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
    dot?: boolean;
}

export function Badge({
    variant = 'neutral',
    children,
    className = '',
    dot = false,
}: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[variant]} ${className}`}>
            {dot && <span className={styles.dot} />}
            {children}
        </span>
    );
}

// Utility function to get badge variant from status strings
export function getStatusVariant(status: string): BadgeVariant {
    const statusLower = status.toLowerCase();

    if (['active', 'paid', 'success', 'approved', 'completed', 'online'].includes(statusLower)) {
        return 'success';
    }
    if (['pending', 'processing', 'in_progress', 'onboarding', 'warning'].includes(statusLower)) {
        return 'warning';
    }
    if (['inactive', 'cancelled', 'failed', 'expired', 'overdue', 'suspended', 'offline'].includes(statusLower)) {
        return 'danger';
    }
    if (['info', 'new'].includes(statusLower)) {
        return 'info';
    }
    return 'neutral';
}
