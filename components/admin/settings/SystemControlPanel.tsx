'use client';

/**
 * SystemControlPanel Component
 * 
 * System metrics and feature management.
 */

import { Activity } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { FeatureManager } from './FeatureManager';
import type { SystemMetric } from '@/lib/services/settingsService';

interface SystemControlPanelProps {
    metrics: SystemMetric[];
}

export function SystemControlPanel({ metrics }: SystemControlPanelProps) {
    return (
        <div className="space-y-6">
            {/* Health Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                    <GlassCard key={i} className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-3.5 h-3.5 text-success" />
                            <span className="text-xs font-medium text-muted">{metric.label}</span>
                        </div>
                        <div className="text-lg font-bold text-primary">{metric.value}</div>
                        <div className="text-[10px] text-success mt-1">{metric.trend}</div>
                    </GlassCard>
                ))}
            </div>

            {/* Feature Flags */}
            <FeatureManager />
        </div>
    );
}
