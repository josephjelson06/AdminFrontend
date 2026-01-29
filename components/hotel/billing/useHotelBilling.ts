'use client';

/**
 * useHotelBilling Hook
 * 
 * Manages hotel billing state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    hotelBillingService,
    type BillingData,
} from '@/lib/services/hotelBillingService';
import type { Invoice, HotelProfile } from '@/lib/hotel/hotel-data';

export interface UseHotelBillingReturn {
    // Data
    profile: HotelProfile | null;
    invoices: Invoice[];
    daysUntilExpiry: number;
    planFeatures: string[];

    // Actions
    downloadInvoice: (invoiceId: string) => Promise<boolean>;
    contactSales: () => Promise<void>;

    // State
    isLoading: boolean;
    downloadingId: string | null;
}

export function useHotelBilling(): UseHotelBillingReturn {
    const [billingData, setBillingData] = useState<BillingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await hotelBillingService.getBillingData();
                setBillingData(data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const downloadInvoice = useCallback(async (invoiceId: string): Promise<boolean> => {
        setDownloadingId(invoiceId);
        try {
            const result = await hotelBillingService.downloadInvoice(invoiceId);
            return result.success;
        } finally {
            setDownloadingId(null);
        }
    }, []);

    const contactSales = useCallback(async () => {
        await hotelBillingService.contactSales();
    }, []);

    return {
        profile: billingData?.profile || null,
        invoices: billingData?.invoices || [],
        daysUntilExpiry: billingData?.daysUntilExpiry || 0,
        planFeatures: billingData?.planFeatures || [],
        downloadInvoice,
        contactSales,
        isLoading,
        downloadingId,
    };
}
