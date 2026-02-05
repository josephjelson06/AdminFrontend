/**
 * Subscription Service
 * 
 * Abstracts all subscription-related API calls.
 */

import type { HotelSubscription } from '@/types/finance';
import { MOCK_SUBSCRIPTIONS, MOCK_FINANCIAL_METRICS } from '@/lib/admin/finance-data';
import type { ServiceResponse, PaginatedResult } from './hotelService';
import { api } from '@/lib/api';

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
        const response = await api.subscriptions.list(params);
        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch subscriptions');
        }
        return response.data as PaginatedResult<HotelSubscription>;
    },

    /**
     * Get subscription metrics
     */
    async getMetrics(): Promise<SubscriptionMetrics> {
         // Should be real API, mocking for now as we focused on List/CRUD
        await delay(100);
        return MOCK_FINANCIAL_METRICS;
    },

    /**
     * Get tab counts for the subscription list
     */
    async getTabCounts(): Promise<TabCounts> {
        // Should be real API, mocking for now
        await delay(100);
        return {
            all: 0,
            auto_pay: 0,
            manual: 0,
            failed: 0,
            grace_period: 0,
        };
    },

    /**
     * Get single subscription by hotel ID
     */
    async get(hotelId: string): Promise<ServiceResponse<HotelSubscription | null>> {
        const response = await api.subscriptions.get(hotelId);
        return {
            success: response.success,
            data: response.data as HotelSubscription,
            error: response.error,
        };
    },
    
    /**
     * Update subscription
     */
    async update(hotelId: string, data: Partial<HotelSubscription>): Promise<ServiceResponse<HotelSubscription>> {
        const response = await api.subscriptions.update(hotelId, data);
        return {
            success: response.success,
            data: response.data as HotelSubscription,
            error: response.error,
        };
    }
};
