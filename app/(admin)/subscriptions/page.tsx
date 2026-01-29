'use client';

/**
 * Subscriptions Page
 * 
 * Admin page for managing subscriptions.
 * Uses the SubscriptionList component from admin/subscriptions.
 */

import { SubscriptionList } from '@/components/admin/subscriptions';

export default function SubscriptionsPage() {
    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            <SubscriptionList />
        </div>
    );
}
