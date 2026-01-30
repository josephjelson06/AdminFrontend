'use client';

/**
 * StatCard Component
 * 
 * KPI card with sparkline and optional click action.
 * Uses the BaseCard system for consistent styling.
 */

import { TinySparkline } from '@/components/shared/ui/TinySparkline';
import {
    BaseCard,
    CardHeader,
    CardBody,
    CardIcon,
    CardStat,
    CardBadge,
} from '@/components/hotel/shared';

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
        <BaseCard
            variant="default"
            density="comfortable"
            interactivity={onClick ? 'actionable' : 'readOnly'}
            onClick={onClick}
            className="p-5"
        >
            <CardHeader className="mb-3">
                <CardIcon color={color} size="sm" className="p-2.5">
                    <Icon className="w-5 h-5 text-white" />
                </CardIcon>
                {trend && (
                    <CardBadge variant="success" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        {trend}
                    </CardBadge>
                )}
            </CardHeader>

            <CardBody className="flex items-end justify-between">
                <CardStat value={value} label={title} isAlert={isAlert} />
                {sparklineData && (
                    <TinySparkline
                        data={sparklineData}
                        color={isAlert ? 'stroke-rose-500' : 'stroke-emerald-500'}
                    />
                )}
            </CardBody>
        </BaseCard>
    );
}
