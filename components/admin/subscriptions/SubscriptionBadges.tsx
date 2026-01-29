'use client';

/**
 * SubscriptionBadges
 * 
 * Status, plan, and payment-related badges for subscriptions.
 */

import { CreditCard, Wallet, Building2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge, getStatusVariant } from '@/components/shared/ui/Badge';
import type { HotelSubscription } from '@/types/finance';

// Status Badge
interface SubscriptionStatusBadgeProps {
    status: HotelSubscription['status'];
}

const statusLabels: Record<HotelSubscription['status'], string> = {
    active: 'Active',
    suspended: 'Suspended',
    grace_period: 'Grace Period',
    cancelled: 'Cancelled',
};

export function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
    return (
        <Badge variant={getStatusVariant(status)}>
            {statusLabels[status]}
        </Badge>
    );
}

// Plan Badge
interface PlanBadgeProps {
    plan: 'standard' | 'advanced';
}

export function PlanBadge({ plan }: PlanBadgeProps) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${plan === 'advanced'
                ? 'bg-gradient-to-r from-warning to-warning/80 text-inverse'
                : 'surface-glass-soft text-secondary-text'
            }`}>
            {plan}
        </span>
    );
}

// Payment Method Icon
interface PaymentMethodIconProps {
    method: HotelSubscription['paymentMethod'];
}

const paymentMethodConfig = {
    auto: { icon: CreditCard, color: 'text-success', label: 'Auto-pay' },
    manual: { icon: Wallet, color: 'text-info', label: 'Manual' },
    bank_transfer: { icon: Building2, color: 'text-info', label: 'Bank' },
    upi: { icon: Wallet, color: 'text-warning', label: 'UPI' },
    cheque: { icon: Wallet, color: 'text-muted', label: 'Cheque' },
};

export function PaymentMethodIcon({ method }: PaymentMethodIconProps) {
    const { icon: Icon, color, label } = paymentMethodConfig[method];
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-secondary-text">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            {label}
        </span>
    );
}

// Payment Status Indicator
interface PaymentStatusIndicatorProps {
    status: HotelSubscription['paymentStatus'];
}

const paymentStatusConfig = {
    active: { icon: CheckCircle, color: 'text-success' },
    failed: { icon: XCircle, color: 'text-danger' },
    grace_period: { icon: Clock, color: 'text-warning' },
    paused: { icon: Clock, color: 'text-muted' },
};

export function PaymentStatusIndicator({ status }: PaymentStatusIndicatorProps) {
    const { icon: Icon, color } = paymentStatusConfig[status];
    return <Icon className={`w-4 h-4 ${color}`} />;
}
