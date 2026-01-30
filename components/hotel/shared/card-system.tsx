'use client';

/**
 * Card System
 * 
 * A unified card component system for the hotel module.
 * All cards should be expressed using BaseCard with configuration,
 * not page-specific card implementations.
 */

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export type CardVariant = 'default' | 'featured' | 'gradient';
export type CardDensity = 'compact' | 'comfortable' | 'spacious';
export type CardInteractivity = 'readOnly' | 'actionable' | 'stateful';

export interface CardStatus {
    color: string;
    pulse?: boolean;
}

export interface BaseCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    variant?: CardVariant;
    density?: CardDensity;
    interactivity?: CardInteractivity;
    status?: CardStatus;
    statusPosition?: 'top-left' | 'top-right';
    elevated?: boolean;
    children: React.ReactNode;
}

// =============================================================================
// STYLE MAPS
// =============================================================================

const densityStyles: Record<CardDensity, string> = {
    compact: 'p-3',
    comfortable: 'p-4',
    spacious: 'p-6',
};

const variantStyles: Record<CardVariant, string> = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    featured: 'bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800',
    gradient: 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white border-0',
};

const interactivityStyles: Record<CardInteractivity, string> = {
    readOnly: '',
    actionable: 'cursor-pointer hover:shadow-md transition-all',
    stateful: 'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200',
};

// =============================================================================
// BASE CARD
// =============================================================================

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
    (
        {
            variant = 'default',
            density = 'comfortable',
            interactivity = 'readOnly',
            status,
            statusPosition = 'top-right',
            elevated = false,
            className,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    'relative rounded-2xl',
                    variantStyles[variant],
                    densityStyles[density],
                    interactivityStyles[interactivity],
                    elevated && 'shadow-lg',
                    className
                )}
                {...props}
            >
                {/* Status Indicator */}
                {status && (
                    <div
                        className={cn(
                            'absolute w-7 h-7 rounded-full flex items-center justify-center shadow-lg',
                            status.color,
                            statusPosition === 'top-right' ? '-top-2 -right-2' : '-top-2 -left-2',
                            status.pulse && 'animate-pulse'
                        )}
                    />
                )}
                {children}
            </motion.div>
        );
    }
);
BaseCard.displayName = 'BaseCard';

// =============================================================================
// CARD HEADER
// =============================================================================

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
    return (
        <div
            className={cn('flex items-center justify-between', className)}
            {...props}
        >
            {children}
        </div>
    );
}

// =============================================================================
// CARD BODY
// =============================================================================

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    );
}

// =============================================================================
// CARD FOOTER
// =============================================================================

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
    return (
        <div
            className={cn('flex items-center', className)}
            {...props}
        >
            {children}
        </div>
    );
}

// =============================================================================
// CARD MEDIA
// =============================================================================

interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    height?: string;
    children?: React.ReactNode;
}

export function CardMedia({
    src,
    alt = '',
    height = 'h-40',
    className,
    children,
    ...props
}: CardMediaProps) {
    return (
        <div
            className={cn('relative overflow-hidden rounded-t-2xl', height, className)}
            {...props}
        >
            {src && (
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                />
            )}
            {children}
        </div>
    );
}

// =============================================================================
// CARD BADGE
// =============================================================================

interface CardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const badgeVariantStyles: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function CardBadge({
    variant = 'default',
    icon,
    className,
    children,
    ...props
}: CardBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full',
                badgeVariantStyles[variant],
                className
            )}
            {...props}
        >
            {icon}
            {children}
        </span>
    );
}

// =============================================================================
// CARD TIMESTAMP
// =============================================================================

interface CardTimestampProps extends React.HTMLAttributes<HTMLDivElement> {
    time: string;
    showIcon?: boolean;
}

export function CardTimestamp({
    time,
    showIcon = true,
    className,
    ...props
}: CardTimestampProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500',
                className
            )}
            {...props}
        >
            {showIcon && <Clock className="w-3 h-3" />}
            {time}
        </div>
    );
}

// =============================================================================
// CARD TITLE
// =============================================================================

interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
}

const titleSizes: Record<string, string> = {
    sm: 'text-sm font-medium',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-3xl font-bold',
};

export function CardTitle({
    size = 'md',
    className,
    children,
    ...props
}: CardTitleProps) {
    return (
        <div
            className={cn(
                'text-slate-900 dark:text-white',
                titleSizes[size],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// =============================================================================
// CARD DESCRIPTION
// =============================================================================

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export function CardDescription({
    className,
    children,
    ...props
}: CardDescriptionProps) {
    return (
        <p
            className={cn(
                'text-sm text-slate-500 dark:text-slate-400',
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
}

// =============================================================================
// CARD ICON CONTAINER
// =============================================================================

interface CardIconProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const iconSizes: Record<string, string> = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
};

export function CardIcon({
    color = 'bg-indigo-500',
    size = 'md',
    className,
    children,
    ...props
}: CardIconProps) {
    return (
        <div
            className={cn(
                'rounded-xl flex items-center justify-center',
                color,
                iconSizes[size],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// =============================================================================
// CARD STAT (for metric cards)
// =============================================================================

interface CardStatProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string | number;
    label: string;
    isAlert?: boolean;
}

export function CardStat({
    value,
    label,
    isAlert = false,
    className,
    ...props
}: CardStatProps) {
    return (
        <div className={cn('', className)} {...props}>
            <p
                className={cn(
                    'text-2xl font-bold',
                    isAlert
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-900 dark:text-white'
                )}
            >
                {value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    );
}

// =============================================================================
// CARD ACTIONS
// =============================================================================

interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function CardActions({ className, children, ...props }: CardActionsProps) {
    return (
        <div
            className={cn('flex flex-col gap-2', className)}
            {...props}
        >
            {children}
        </div>
    );
}
