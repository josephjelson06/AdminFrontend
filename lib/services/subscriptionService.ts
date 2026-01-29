/**
 * Subscription Service
 * 
 * Abstracts all subscription-related API calls.
 */

import type { HotelSubscription } from '@/types/finance';
import { MOCK_SUBSCRIPTIONS, MOCK_FINANCIAL_METRICS } from '@/lib/admin/finance-data';
import type { ServiceResponse, PaginatedResult } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface SubscriptionQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    plan?: 'all' | 'standard' | 'advanced';
    status?: 'all' | HotelSubscription['status'];
    tab?: 'all' | 'auto_pay' | 'manual' | 'failed' | 'grace_period';
}

export interface SubscriptionMetrics {
    activeSubscriptions: number;
    newSubscriptionsThisMonth: number;
    churnedThisMonth: number;
}

export interface TabCounts {
    all: number;
    auto_pay: number;
    manual: number;
    failed: number;
    grace_period: number;
}

// Pagination helper
function paginate<T>(data: T[], page: number = 1, pageSize: number = 10): PaginatedResult<T> {
    const start = (page - 1) * pageSize;
    return {
        data: data.slice(start, start + pageSize),
        pagination: {
            page,
            pageSize,
            totalPages: Math.ceil(data.length / pageSize),
            totalItems: data.length,
        },
    };
}

export const subscriptionService = {
    /**
     * Fetch paginated list of subscriptions with optional filters
     */
    async list(params?: SubscriptionQueryParams): Promise<PaginatedResult<HotelSubscription>> {
        await delay();

        let data = [...MOCK_SUBSCRIPTIONS];

        // Apply tab filter
        if (params?.tab && params.tab !== 'all') {
            switch (params.tab) {
                case 'auto_pay':
                    data = data.filter(s => s.paymentMethod === 'auto');
                    break;
                case 'manual':
                    data = data.filter(s => s.paymentMethod !== 'auto');
                    break;
                case 'failed':
                    data = data.filter(s => s.paymentStatus === 'failed');
                    break;
                case 'grace_period':
                    data = data.filter(s => s.paymentStatus === 'grace_period');
                    break;
            }
        }

        // Apply search
        if (params?.search) {
            const search = params.search.toLowerCase();
            data = data.filter(s =>
                s.hotelName.toLowerCase().includes(search) ||
                s.location.toLowerCase().includes(search)
            );
        }

        // Apply plan filter
        if (params?.plan && params.plan !== 'all') {
            data = data.filter(s => s.plan === params.plan);
        }

        // Apply status filter
        if (params?.status && params.status !== 'all') {
            data = data.filter(s => s.status === params.status);
        }

        return paginate(data, params?.page, params?.pageSize);
    },

    /**
     * Get subscription metrics
     */
    async getMetrics(): Promise<SubscriptionMetrics> {
        await delay(100);
        return MOCK_FINANCIAL_METRICS;
    },

    /**
     * Get tab counts for the subscription list
     */
    async getTabCounts(): Promise<TabCounts> {
        await delay(100);
        const subs = MOCK_SUBSCRIPTIONS;
        return {
            all: subs.length,
            auto_pay: subs.filter(s => s.paymentMethod === 'auto').length,
            manual: subs.filter(s => s.paymentMethod !== 'auto').length,
            failed: subs.filter(s => s.paymentStatus === 'failed').length,
            grace_period: subs.filter(s => s.paymentStatus === 'grace_period').length,
        };
    },

    /**
     * Get single subscription by hotel ID
     */
    async get(hotelId: string): Promise<ServiceResponse<HotelSubscription | null>> {
        await delay();
        const sub = MOCK_SUBSCRIPTIONS.find(s => s.hotelId === hotelId);
        return {
            success: !!sub,
            data: sub || null,
            error: sub ? undefined : 'Subscription not found',
        };
    },
};
