'use client';

/**
 * SubscriptionCard Component
 * 
 * Card-based display for individual subscription with status and payment info.
 */

import { CreditCard, Calendar, Building2, MoreVertical, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { SubscriptionStatusBadge } from './SubscriptionBadges';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import type { HotelSubscription } from '@/types/finance';

interface SubscriptionCardProps {
    subscription: HotelSubscription;
    onClick?: (subscription: HotelSubscription) => void;
}

// Get gradient based on plan
function getPlanGradient(plan: HotelSubscription['plan']) {
    switch (plan) {
        case 'standard':
            return 'from-blue-500 to-cyan-500';
        case 'advanced':
            return 'from-purple-500 to-pink-500';
        default:
            return 'from-indigo-500 to-purple-600';
    }
}

export function SubscriptionCard({ subscription, onClick }: SubscriptionCardProps) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

    const isAtRisk = subscription.paymentStatus === 'failed' || subscription.paymentStatus === 'grace_period';

    return (
        <GlassCard
            className="group relative overflow-hidden h-full flex flex-col cursor-pointer"
            hover
            padding="none"
            onClick={() => onClick?.(subscription)}
        >
            {/* Status Badge - Top Left */}
            <div className="absolute top-4 left-4 z-10">
                <SubscriptionStatusBadge status={subscription.status} />
            </div>

            {/* Actions Menu - Top Right */}
            <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                <Dropdown
                    trigger={
                        <button className="p-2 rounded-lg surface-glass-soft hover:surface-glass-strong transition-all">
                            <MoreVertical className="w-4 h-4 text-muted" />
                        </button>
                    }
                    align="right"
                >
                    <DropdownItem onClick={() => console.log('View Details')}>
                        <Building2 className="w-4 h-4" />
                        View Details
                    </DropdownItem>
                    <DropdownItem onClick={() => console.log('Manage Subscription')}>
                        <CreditCard className="w-4 h-4" />
                        Manage Subscription
                    </DropdownItem>
                </Dropdown>
            </div>

            {/* Card Content */}
            <div className="p-6 pt-14 flex flex-col items-center text-center flex-1">
                {/* Icon */}
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${getPlanGradient(subscription.plan)} shadow-lg mb-4`}>
                    <CreditCard className="w-7 h-7 text-white" />
                </div>

                {/* Hotel Name */}
                <h3 className="text-base font-semibold text-primary">
                    {subscription.hotelName}
                </h3>

                {/* Location */}
                <p className="text-sm text-muted mt-1">
                    {subscription.location}
                </p>

                {/* Plan Badge */}
                <div className="mt-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${subscription.plan === 'advanced'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        {subscription.plan}
                    </span>
                </div>

                {/* MRR */}
                <div className="mt-4">
                    <p className="text-xs text-muted uppercase tracking-wide">Monthly Revenue</p>
                    <p className="text-xl font-bold text-success mt-1">
                        {formatCurrency(subscription.mrr)}
                    </p>
                </div>

                {/* Payment Status Alert */}
                {isAtRisk && (
                    <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 text-danger text-xs">
                        <AlertCircle className="w-4 h-4" />
                        {subscription.paymentStatus === 'failed'
                            ? `Payment failed (${subscription.failedAttempts} attempts)`
                            : `Grace period: ${subscription.gracePeriodDaysRemaining} days left`
                        }
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex items-center justify-between text-xs text-muted border-t border-glass pt-4 mx-4">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Next: {formatDate(subscription.nextBillingDate)}
                </div>
                <div>
                    {subscription.kioskUsage}/{subscription.kioskLimit} kiosks
                </div>
            </div>

            {/* Bottom Border Accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getPlanGradient(subscription.plan)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </GlassCard>
    );
}
