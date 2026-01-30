'use client';

/**
 * SubscriptionCard Component
 * 
 * Card-based display for individual subscription using BaseCard system.
 */

import { CreditCard, Calendar, Building2, MoreVertical, AlertCircle } from 'lucide-react';
import {
    BaseCard,
    CardStat,
    CardAlert,
} from '@/components/shared/ui/BaseCard';
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
    const planGradient = getPlanGradient(subscription.plan);

    return (
        <BaseCard
            variant="financial"
            onClick={() => onClick?.(subscription)}
            header={{
                icon: <CreditCard className="w-7 h-7 text-white" />,
                iconGradient: planGradient,
                title: subscription.hotelName,
                subtitle: subscription.location,
                badge: <SubscriptionStatusBadge status={subscription.status} />,
                actionsMenu: (
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
                ),
            }}
            body={
                <div className="flex flex-col items-center text-center">
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
                    <CardStat
                        label="Monthly Revenue"
                        value={formatCurrency(subscription.mrr)}
                    />

                    {/* Payment Status Alert */}
                    {isAtRisk && (
                        <CardAlert
                            icon={<AlertCircle className="w-4 h-4" />}
                            message={subscription.paymentStatus === 'failed'
                                ? `Payment failed (${subscription.failedAttempts} attempts)`
                                : `Grace period: ${subscription.gracePeriodDaysRemaining} days left`
                            }
                            variant="danger"
                        />
                    )}
                </div>
            }
            footer={
                <div className="px-6 pb-5 flex items-center justify-between text-xs text-muted border-t border-glass pt-4 mx-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Next: {formatDate(subscription.nextBillingDate)}
                    </div>
                    <div>
                        {subscription.kioskUsage}/{subscription.kioskLimit} kiosks
                    </div>
                </div>
            }
            accentGradient={planGradient}
        />
    );
}
