'use client';

/**
 * RoomStatusSummary Component
 * 
 * Quick stats display with clickable filters.
 */

import { GlassCard } from '@/components/shared/ui/GlassCard';
import { cn } from '@/lib/utils';
import type { RoomStats } from '@/lib/services/hotelRoomService';

interface RoomStatusSummaryProps {
    stats: RoomStats;
    activeFilter: string;
    onFilterChange: (status: string) => void;
}

const statItems = [
    { key: 'ready', label: 'Ready', color: 'text-success', activeBorder: 'border-emerald-500/50', activeBg: 'bg-emerald-500/10' },
    { key: 'cleaning', label: 'Cleaning', color: 'text-warning', activeBorder: 'border-amber-500/50', activeBg: 'bg-amber-500/10' },
    { key: 'occupied', label: 'Occupied', color: 'text-blue-500', activeBorder: 'border-blue-500/50', activeBg: 'bg-blue-500/10' },
    { key: 'dirty', label: 'Dirty', color: 'text-danger', activeBorder: 'border-rose-500/50', activeBg: 'bg-rose-500/10' },
] as const;

export function RoomStatusSummary({ stats, activeFilter, onFilterChange }: RoomStatusSummaryProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {statItems.map((stat) => {
                const isActive = activeFilter === stat.key;
                return (
                    <GlassCard
                        key={stat.key}
                        onClick={() => onFilterChange(isActive ? 'all' : stat.key)}
                        className={cn(
                            "group p-4 flex flex-col items-center justify-center transition-all duration-normal ease-smooth",
                            "hover:scale-[1.02] hover:border-primary/30",
                            isActive && cn("border-2", stat.activeBorder, stat.activeBg)
                        )}
                        padding="none"
                        variant={isActive ? 'strong' : 'soft'}
                    >
                        <div className={cn(
                            "text-3xl font-bold transition-colors",
                            stat.color
                        )}>
                            {stats[stat.key]}
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
