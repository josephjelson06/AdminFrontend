'use client';

/**
 * Hotel Billing Page
 * 
 * Subscription and invoice management for hotel.
 * Uses HotelBillingManager from components/hotel/billing.
 */

import { HotelBillingManager } from '@/components/hotel/billing';

export default function BillingPage() {
    return <HotelBillingManager />;
}
