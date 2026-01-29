'use client';

/**
 * SubscriptionMetricsCards Component
 * 
 * KPI cards for subscription metrics.
 */

import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import type { SubscriptionMetrics } from '@/lib/services/subscriptionService';

interface SubscriptionMetricsCardsProps {
    metrics: SubscriptionMetrics;
}

export function SubscriptionMetricsCards({ metrics }: SubscriptionMetricsCardsProps) {
    const netGrowth = metrics.newSubscriptionsThisMonth - metrics.churnedThisMonth;
    const growthPercentage = metrics.activeSubscriptions > 0
        ? ((metrics.newSubscriptionsThisMonth / metrics.activeSubscriptions) * 100).toFixed(1)
        : '0';

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Active</p>
                <p className="text-2xl font-bold text-primary mt-1">{metrics.activeSubscriptions}</p>
                <p className="text-xs text-muted mt-1">subscriptions</p>
            </Card>

            <Card>
                <p className="text-xs font-medium text-muted uppercase tracking-wide">New</p>
                <p className="text-2xl font-bold text-success mt-1">+{metrics.newSubscriptionsThisMonth}</p>
                <p className="text-xs text-muted mt-1">this month</p>
            </Card>

            <Card>
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Churned</p>
                <p className="text-2xl font-bold text-primary mt-1">{metrics.churnedThisMonth}</p>
                <p className="text-xs text-muted mt-1">this month</p>
            </Card>

            <Card>
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Net Growth</p>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-success">+{netGrowth}</p>
                    <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <p className="text-xs text-success mt-1">+{growthPercentage}%</p>
            </Card>
        </div>
    );
}
