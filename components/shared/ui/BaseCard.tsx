'use client';

/**
 * BaseCard Component
 * 
 * Unified card system with compositional zones for header, body, and footer.
 * Supports variants for different card types while maintaining consistent styling.
 */

import { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Dropdown } from './Dropdown';

// ============================================================================
// TYPES
// ============================================================================

export type CardVariant = 'entity' | 'financial' | 'metric' | 'report';

export interface CardHeaderProps {
    /** Icon element (typically with gradient background) */
    icon?: ReactNode;
    /** Icon gradient classes (e.g., "from-indigo-500 to-purple-600") */
    iconGradient?: string;
    /** Primary title */
    title: string;
    /** Secondary subtitle text */
    subtitle?: string;
    /** Status badge component */
    badge?: ReactNode;
    /** Actions menu content */
    actionsMenu?: ReactNode;
}

export interface BaseCardProps {
    /** Card variant for layout adjustments */
    variant?: CardVariant;
    /** Header configuration */
    header: CardHeaderProps;
    /** Body content slot */
    body?: ReactNode;
    /** Footer content slot */
    footer?: ReactNode;
    /** Accent gradient for hover effect */
    accentGradient?: string;
    /** Click handler for the card */
    onClick?: () => void;
    /** Additional className */
    className?: string;
    /** Children for backward compatibility */
    children?: ReactNode;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/** Card Icon with gradient background */
export function CardIcon({
    icon,
    gradient = 'from-indigo-500 to-purple-600',
    size = 'md',
}: {
    icon: ReactNode;
    gradient?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClasses = {
        sm: 'p-2 rounded-lg',
        md: 'p-3.5 rounded-xl',
        lg: 'p-4 rounded-2xl',
    };

    return (
        <div className={`shrink-0 ${sizeClasses[size]} bg-gradient-to-br ${gradient} shadow-lg`}>
            {icon}
        </div>
    );
}

/** Card Header - Entity variant (horizontal layout) */
function EntityHeader({ header }: { header: CardHeaderProps }) {
    return (
        <div className="flex items-start gap-4">
            {header.icon && (
                <CardIcon
                    icon={header.icon}
                    gradient={header.iconGradient}
                    size="md"
                />
            )}
            <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="text-lg font-semibold text-primary truncate leading-tight">
                    {header.title}
                </h3>
                {header.subtitle && (
                    <p className="text-sm text-muted truncate">{header.subtitle}</p>
                )}
            </div>
        </div>
    );
}

/** Card Header - Financial variant (centered layout) */
function FinancialHeader({ header }: { header: CardHeaderProps }) {
    return (
        <div className="flex flex-col items-center text-center">
            {header.icon && (
                <CardIcon
                    icon={header.icon}
                    gradient={header.iconGradient}
                    size="lg"
                />
            )}
            <h3 className="text-base font-semibold text-primary mt-4">
                {header.title}
            </h3>
            {header.subtitle && (
                <p className="text-sm text-muted mt-1">{header.subtitle}</p>
            )}
        </div>
    );
}

/** Card Actions Menu Wrapper */
function CardActionsMenu({
    children,
    position = 'top-right',
}: {
    children: ReactNode;
    position?: 'top-right' | 'top-left';
}) {
    const positionClasses = position === 'top-right' ? 'top-4 right-4' : 'top-4 left-4';

    return (
        <div
            className={`absolute ${positionClasses} z-10`}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
}

/** Card footer with border separator */
export function CardFooter({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`px-6 pb-5 pt-4 border-t border-glass mx-4 ${className}`}>
            {children}
        </div>
    );
}

/** Info row for metadata display */
export function CardInfoRow({
    label,
    value,
    valueClassName = 'text-secondary-text',
}: {
    label: string;
    value: ReactNode;
    valueClassName?: string;
}) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{label}</span>
            <span className={valueClassName}>{value}</span>
        </div>
    );
}

/** Stat block for financial cards */
export function CardStat({
    label,
    value,
    valueClassName = 'text-xl font-bold text-success',
}: {
    label: string;
    value: ReactNode;
    valueClassName?: string;
}) {
    return (
        <div className="mt-4">
            <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
            <p className={`${valueClassName} mt-1`}>{value}</p>
        </div>
    );
}

/** Info grid for entity cards */
export function CardInfoGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {children}
        </div>
    );
}

/** Info cell for grid layout */
export function CardInfoCell({
    label,
    value,
    icon,
}: {
    label: string;
    value: ReactNode;
    icon?: ReactNode;
}) {
    return (
        <div className="p-4 rounded-xl surface-glass-soft space-y-2">
            <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-base font-semibold text-primary">{value}</span>
            </div>
        </div>
    );
}

/** Alert box for warnings/errors */
export function CardAlert({
    icon,
    message,
    variant = 'danger',
}: {
    icon: ReactNode;
    message: string;
    variant?: 'danger' | 'warning' | 'info';
}) {
    const variantClasses = {
        danger: 'bg-danger/10 text-danger',
        warning: 'bg-warning/10 text-warning',
        info: 'bg-info/10 text-info',
    };

    return (
        <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg ${variantClasses[variant]} text-xs`}>
            {icon}
            {message}
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BaseCard({
    variant = 'entity',
    header,
    body,
    footer,
    accentGradient = 'from-indigo-500 via-purple-500 to-pink-500',
    onClick,
    className = '',
    children,
}: BaseCardProps) {
    const isClickable = Boolean(onClick);

    // Determine header component based on variant
    const HeaderComponent = variant === 'financial' ? FinancialHeader : EntityHeader;

    // Determine padding based on variant
    const contentPadding = variant === 'financial' ? 'p-6 pt-14' : 'p-6';

    return (
        <GlassCard
            className={`group relative overflow-hidden h-full flex flex-col ${isClickable ? 'cursor-pointer' : ''} ${className}`}
            hover
            padding="none"
            onClick={onClick}
        >
            {/* Status Badge - Position varies by variant */}
            {header.badge && (
                <div className={`absolute top-5 ${variant === 'financial' ? 'left-4' : 'right-5'} z-10`}>
                    {header.badge}
                </div>
            )}

            {/* Actions Menu */}
            {header.actionsMenu && (
                <CardActionsMenu position="top-right">
                    {header.actionsMenu}
                </CardActionsMenu>
            )}

            {/* Card Content */}
            <div className={`${contentPadding} flex flex-col flex-1 space-y-6`}>
                {/* Header */}
                <div className={variant === 'entity' ? 'pr-24' : ''}>
                    <HeaderComponent header={header} />
                </div>

                {/* Body */}
                {body && <div className="flex-1">{body}</div>}

                {/* Children for backward compat */}
                {children}
            </div>

            {/* Footer */}
            {footer}

            {/* Bottom Border Accent */}
            <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
        </GlassCard>
    );
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export { CardActionsMenu };
