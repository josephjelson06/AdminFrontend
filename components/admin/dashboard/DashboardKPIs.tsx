'use client';

/**
 * DashboardKPIs Component
 * 
 * KPI cards row for dashboard.
 */

import { Building2, Cpu, Zap, BarChart3, Wifi, WifiOff } from 'lucide-react';
import { KPICard } from './KPICard';
import type { DashboardMetrics } from '@/lib/services/dashboardService';

interface DashboardKPIsProps {
    metrics: DashboardMetrics;
}

export function DashboardKPIs({ metrics }: DashboardKPIsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <KPICard
                title="Total Hotels"
                value={metrics.totalHotels}
                subtitle={<span>{metrics.activeHotels} active</span>}
                icon={Building2}
                iconBg="bg-info/10"
                iconColor="text-info"
                href="/hotels"
            />
            <KPICard
                title="Active Kiosks"
                value={metrics.activeKiosks}
                subtitle={
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-success">
                            <Wifi className="w-3 h-3" /> {metrics.onlineKiosks}
                        </span>
                        {metrics.offlineKiosks > 0 && (
                            <span className="flex items-center gap-1 text-danger">
                                <WifiOff className="w-3 h-3" /> {metrics.offlineKiosks}
                            </span>
                        )}
                    </div>
                }
                icon={Cpu}
                iconBg="bg-success/10"
                iconColor="text-success"
                href="/fleet"
            />
            <KPICard
                title="AI Adoption"
                value={`${metrics.aiAdoptionRate}%`}
                subtitle={<span className="text-success">Guests using AI kiosk</span>}
                icon={Zap}
                iconBg="bg-warning/10"
                iconColor="text-warning"
                href="/reports"
                trend={{ value: '+5% vs last period', positive: true }}
            />
            <KPICard
                title="Check-ins Today"
                value={metrics.todayCheckins}
                subtitle={<span className="text-secondary">+8% vs yesterday</span>}
                icon={BarChart3}
                iconBg="bg-secondary/10"
                iconColor="text-secondary"
                href="/reports"
                trend={{ value: '+8% vs yesterday', positive: true }}
            />
        </div>
    );
}
