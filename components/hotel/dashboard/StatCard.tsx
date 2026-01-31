'use client';

/**
 * StatCard Component
 * 
 * KPI card with sparkline and optional click action.
 * Uses GlassCard for consistent styling.
 */

import { TinySparkline } from '@/components/shared/ui/TinySparkline';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconBg?: string; // e.g. "bg-indigo-500/10"
    iconColor?: string; // e.g. "text-indigo-500"
    trend?: string;
    sparklineData?: number[];
    onClick?: () => void;
    isAlert?: boolean;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    iconBg = "bg-primary/10",
    iconColor = "text-primary",
    trend,
    sparklineData,
    onClick,
    isAlert,
}: StatCardProps) {
    return (
        <GlassCard
            className={cn(
                "p-4 h-full relative group transition-all duration-normal ease-smooth",
                onClick && "cursor-pointer hover:border-primary/50"
            )}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">{title}</p>
                    <h3 className={cn(
                        "text-2xl font-bold mt-1",
                        isAlert ? "text-danger" : "text-primary"
                    )}>
                        {value}
                    </h3>
                </div>
                <div className={cn("p-2 rounded-lg transition-transform duration-fast group-hover:scale-110", iconBg)}>
                    <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
            </div>

            <div className="mt-4 flex items-end justify-between min-h-[24px]">
                <div className="flex items-center">
                    {trend && (
                        <span className="text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                            {trend}
                        </span>
                    )}
                </div>

                {sparklineData ? (
                    <div className="w-20 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                        <TinySparkline
                            data={sparklineData}
                            color={isAlert ? 'stroke-rose-500' : 'stroke-emerald-500'}
                        />
                    </div>
                ) : onClick ? (
                    <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : null}
            </div>
        </GlassCard>
    );
}
