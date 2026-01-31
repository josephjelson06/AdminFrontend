'use client';

/**
 * GuestQuickStats Component
 * 
 * Quick stats display with clickable filters.
 */

import { GlassCard } from '@/components/shared/ui/GlassCard';
import { cn } from '@/lib/utils';
import type { GuestStats, GuestStatusFilter } from '@/lib/services/hotelGuestService';

interface GuestQuickStatsProps {
    stats: GuestStats;
    activeFilter: GuestStatusFilter;
    onFilterChange: (status: GuestStatusFilter) => void;
}

const statItems = [
    { key: 'all' as const, label: 'Total', color: 'text-primary', activeBorder: 'border-indigo-500/50', activeBg: 'bg-indigo-500/10' },
    { key: 'verified' as const, label: 'Verified', color: 'text-success', activeBorder: 'border-emerald-500/50', activeBg: 'bg-emerald-500/10' },
    { key: 'manual' as const, label: 'Manual', color: 'text-warning', activeBorder: 'border-amber-500/50', activeBg: 'bg-amber-500/10' },
    { key: 'failed' as const, label: 'Failed', color: 'text-danger', activeBorder: 'border-rose-500/50', activeBg: 'bg-rose-500/10' },
];

export function GuestQuickStats({ stats, activeFilter, onFilterChange }: GuestQuickStatsProps) {
    return (
        <div className="grid grid-cols-4 gap-3 mb-6">
            {statItems.map((stat) => {
                const isActive = activeFilter === stat.key;
                const value = stat.key === 'all' ? stats.total :
                    stat.key === 'verified' ? stats.verified :
                        stat.key === 'manual' ? stats.manual :
                            stats.failed;

                return (
                    <GlassCard
                        key={stat.key}
                        onClick={() => onFilterChange(stat.key)}
                        className={cn(
                            "group p-4 flex flex-col items-center justify-center transition-all duration-normal ease-smooth",
                            "hover:scale-[1.02] hover:border-primary/30",
                            isActive && cn("border-2", stat.activeBorder, stat.activeBg)
                        )}
                        padding="none"
                        variant={isActive ? 'strong' : 'soft'}
                    >
                        <div className={cn(
                            "text-2xl sm:text-3xl font-bold transition-colors",
                            stat.color
                        )}>
                            {value}
                        </div>
                        <div className="text-xs font-medium text-muted uppercase tracking-wide mt-1">
                            {stat.label}
                        </div>
                    </GlassCard>
                );
            })}
        </div>
    );
}
