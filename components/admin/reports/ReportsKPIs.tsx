'use client';

/**
 * ReportsKPIs Component
 * 
 * KPI cards for reports page.
 */

import { TrendingUp } from 'lucide-react';
import type { ReportsMetrics } from '@/lib/services/reportsService';

interface ReportsKPIsProps {
    metrics: ReportsMetrics;
}

export function ReportsKPIs({ metrics }: ReportsKPIsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="surface-glass-strong rounded-2xl border border-glass p-5">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Total Check-ins</p>
                <p className="text-2xl font-bold text-primary mt-2">{metrics.totalCheckins.toLocaleString()}</p>
                <p className="text-xs text-success mt-1.5 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> +23% vs prev period
                </p>
            </div>
            <div className="surface-glass-strong rounded-2xl border border-glass p-5">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Deployed Kiosks</p>
                <p className="text-2xl font-bold text-success mt-2">{metrics.deployedKiosks}</p>
                <p className="text-xs text-muted mt-1.5">Across {metrics.statesCount} states</p>
            </div>
            <div className="surface-glass-strong rounded-2xl border border-glass p-5">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Avg Self Check-in Rate</p>
                <p className="text-2xl font-bold text-primary mt-2">{metrics.avgSelfCheckInRate}%</p>
                <p className="text-xs text-muted mt-1.5">Guests using kiosk vs front desk</p>
            </div>
            <div className="surface-glass-strong rounded-2xl border border-glass p-5">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">Non-English Usage</p>
                <p className="text-2xl font-bold text-info mt-2">{metrics.nonEnglishUsage}%</p>
                <p className="text-xs text-muted mt-1.5">Regional language interactions</p>
            </div>
        </div>
    );
}
