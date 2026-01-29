/**
 * Hotel Billing Service
 * 
 * Abstracts billing and invoice operations.
 */

import {
    MOCK_HOTEL_PROFILE,
    MOCK_INVOICES,
    type Invoice,
    type HotelProfile,
} from '@/lib/hotel/hotel-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Plan feature configuration
export const PLAN_FEATURES: Record<string, { icon: string; features: string[] }> = {
    standard: {
        icon: 'Zap',
        features: ['Up to 50 rooms', '1 Kiosk', '2 Languages', 'Email support'],
    },
    advanced: {
        icon: 'Sparkles',
        features: ['Up to 200 rooms', '3 Kiosks', '4 Languages', 'Priority support'],
    },
    enterprise: {
        icon: 'Crown',
        features: ['Unlimited rooms', 'Unlimited Kiosks', 'All languages', '24/7 support'],
    },
};

export interface BillingData {
    profile: HotelProfile;
    invoices: Invoice[];
    daysUntilExpiry: number;
    planFeatures: string[];
}

export const hotelBillingService = {
    /**
     * Get billing overview data
     */
    async getBillingData(): Promise<BillingData> {
        await delay(200);
        const profile = MOCK_HOTEL_PROFILE;
        const expiryDate = new Date(profile.planExpiry);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const planFeatures = PLAN_FEATURES[profile.plan]?.features || PLAN_FEATURES.standard.features;

        return {
            profile,
            invoices: MOCK_INVOICES,
            daysUntilExpiry,
            planFeatures,
        };
    },

    /**
     * Get all invoices
     */
    async getInvoices(): Promise<Invoice[]> {
        await delay(100);
        return MOCK_INVOICES;
    },

    /**
     * Download invoice PDF (mock)
     */
    async downloadInvoice(invoiceId: string): Promise<ServiceResponse<Blob | undefined>> {
        await delay(1000);
        const invoice = MOCK_INVOICES.find(i => i.id === invoiceId);
        if (!invoice) {
            return { success: false, data: undefined, error: 'Invoice not found' };
        }
        // Mock PDF blob
        const blob = new Blob([`Invoice ${invoiceId} PDF content`], { type: 'application/pdf' });
        return { success: true, data: blob, error: undefined };
    },

    /**
     * Contact sales
     */
    async contactSales(): Promise<void> {
        await delay(500);
        // Mock action - would open support portal in real implementation
    },
};
