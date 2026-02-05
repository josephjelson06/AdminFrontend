'use client';

/**
 * DashboardHeader Component
 * 
 * Header with greeting and time filter.
 */

import { useAuth } from '@/lib/auth';
import { DashboardFilter } from './DashboardFilter';
import type { Alert } from '@/lib/services/dashboardService';

interface DashboardHeaderProps {
    alerts: Alert[];
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function formatDate(): string {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

export function DashboardHeader({ alerts }: DashboardHeaderProps) {
    const { user } = useAuth();
    const criticalCount = alerts.filter(a => a.severity === 'critical').length;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-xl font-semibold text-primary">
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}
                </h1>
                <p className="text-sm text-muted">
                    {formatDate()} • {criticalCount} items need attention
                </p>
            </div>
            <div className="flex items-center gap-3">
                <DashboardFilter />
            </div>
        </div>
    );
}
