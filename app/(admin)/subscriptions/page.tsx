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
        <div className="animate-in fade-in duration-normal">
            <SubscriptionList />
        </div>
    );
}
