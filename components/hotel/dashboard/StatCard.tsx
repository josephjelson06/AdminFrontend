'use client';

/**
 * StatCard Component
 * 
 * KPI card with sparkline and optional click action.
 */

import { TinySparkline } from '@/components/shared/ui/TinySparkline';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color: string;
    sparklineData?: number[];
    onClick?: () => void;
    isAlert?: boolean;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    color,
    sparklineData,
    onClick,
    isAlert,
}: StatCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900' : ''
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {trend && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className={`text-2xl font-bold ${isAlert ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                        {value}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
                </div>
                {sparklineData && (
                    <TinySparkline data={sparklineData} color={isAlert ? 'stroke-rose-500' : 'stroke-emerald-500'} />
                )}
            </div>
        </div>
    );
}
