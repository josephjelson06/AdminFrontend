'use client';

/**
 * SubscriptionTable Component
 * 
 * Table display for subscriptions.
 */

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Building2, MoreVertical } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import {
    SubscriptionStatusBadge,
    PlanBadge,
    PaymentMethodIcon,
    PaymentStatusIndicator,
} from './SubscriptionBadges';
import type { HotelSubscription } from '@/types/finance';

interface SubscriptionTableProps {
    subscriptions: HotelSubscription[];
    isLoading: boolean;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

// Row Actions Menu
function RowActionsMenu({ hotelId }: { hotelId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md glass-hover transition-colors"
            >
                <MoreVertical className="w-4 h-4 text-muted" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-36 surface-glass-strong border border-glass rounded-md shadow-lg z-50">
                    <Link
                        href={`/subscriptions/${hotelId}`}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary glass-hover transition-colors rounded-md"
                    >
                        More Details
                    </Link>
                </div>
            )}
        </div>
    );
}

export function SubscriptionTable({ subscriptions, isLoading }: SubscriptionTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-glass">
                <thead>
                    <tr className="surface-glass-soft border-b border-glass">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Hotel</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Plan</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Payment</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Kiosk Usage</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Next Billing</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-glass">
                    {subscriptions.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                                No subscriptions found matching your filters.
                            </td>
                        </tr>
                    ) : (
                        subscriptions.map((sub) => (
                            <tr key={sub.hotelId} className="glass-hover transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg surface-glass-soft">
                                            <Building2 className="w-4 h-4 text-muted" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-primary">{sub.hotelName}</p>
                                            <p className="text-xs text-muted">{sub.location}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <PlanBadge plan={sub.plan} />
                                </td>
                                <td className="px-4 py-3">
                                    <SubscriptionStatusBadge status={sub.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <PaymentStatusIndicator status={sub.paymentStatus} />
                                        <div>
                                            <PaymentMethodIcon method={sub.paymentMethod} />
                                            {sub.cardLast4 && (
                                                <p className="text-xs text-muted">•••• {sub.cardLast4}</p>
                                            )}
                                            {sub.failedAttempts && sub.failedAttempts > 0 && (
                                                <p className="text-xs text-danger">{sub.failedAttempts} failed</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 surface-glass-soft rounded-full h-1.5">
                                            <div
                                                className="bg-success h-1.5 rounded-full"
                                                style={{ width: `${(sub.kioskUsage / sub.kioskLimit) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-secondary-text">
                                            {sub.kioskUsage}/{sub.kioskLimit}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm text-secondary-text">
                                        {formatDate(sub.nextBillingDate)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <RowActionsMenu hotelId={sub.hotelId} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
