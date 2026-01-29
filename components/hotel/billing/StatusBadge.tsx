'use client';

/**
 * Status Badge Component
 * 
 * Displays invoice payment status.
 */

import { Check, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
}

const statusConfig = {
    paid: { icon: Check, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    pending: { icon: Clock, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    overdue: { icon: AlertCircle, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
