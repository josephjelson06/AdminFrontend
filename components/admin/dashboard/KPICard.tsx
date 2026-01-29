'use client';

import Link from 'next/link';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle: React.ReactNode;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    href: string;
    trend?: { value: string; positive: boolean };
}

export function KPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor,
    href,
    trend
}: KPICardProps) {
    return (
        <Link href={href} className="block group">
            <GlassCard className="p-4 h-full hover:border-primary/50 transition-all duration-normal ease-smooth">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">{title}</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary mt-1">{value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${iconBg} group-hover:scale-110 transition-transform duration-fast`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-muted">
                        {subtitle}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {trend && (
                    <div className={`mt-1 text-xs flex items-center gap-1 ${trend.positive ? 'text-success' : 'text-danger'}`}>
                        <TrendingUp className={`w-3 h-3 ${!trend.positive && 'rotate-180'}`} />
                        {trend.value}
                    </div>
                )}
            </GlassCard>
        </Link>
    );
}
