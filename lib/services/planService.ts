/**
 * Plan Service
 * 
 * Abstracts all subscription plan-related API calls.
 */

import type { ServiceResponse } from './hotelService';
import { api } from '@/lib/api';

// Simulate network delay
// const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    limits: {
        kiosks: number;
        users: number;
        storage: string;
    };
    features: string[];
    status: 'active' | 'archived';
    popular?: boolean;
}

export const planService = {
    /**
     * Fetch all plans
     */
    async list(): Promise<Plan[]> {
        const response = await api.plans.list();
        if (!response.success) {
            console.error('Failed to fetch plans:', response.error);
            return [];
        }
        return (response.data as any[]).map(p => ({
            ...p,
            id: String(p.id)
        }));
    },

    /**
     * Get single plan by ID
     */
    async get(id: string): Promise<ServiceResponse<Plan | null>> {
        const response = await api.plans.get(id);
        if (!response.success) {
            return {
                success: false,
                data: null,
                error: response.error || 'Plan not found',
            };
        }
        const plan = response.data as any;
        return {
            success: true,
            data: { ...plan, id: String(plan.id) },
        };
    },

    /**
     * Create new plan
     */
    async create(data: Omit<Plan, 'id'>): Promise<ServiceResponse<Plan>> {
        const response = await api.plans.create(data);
        if (!response.success) {
            return { success: false, data: undefined as any, error: response.error };
        }
        const plan = response.data as any;
        return { success: true, data: { ...plan, id: String(plan.id) } };
    },

    /**
     * Update existing plan
     */
    async update(id: string, data: Partial<Plan>): Promise<ServiceResponse<Plan>> {
        const response = await api.plans.update(id, data);
        if (!response.success) {
            return { success: false, data: undefined as any, error: response.error };
        }
        const plan = response.data as any;
        return { success: true, data: { ...plan, id: String(plan.id) } };
    },

    /**
     * Archive plan
     */
    async archive(id: string): Promise<ServiceResponse<void>> {
        // We use the update endpoint to set status to archived, or delete endpoint if strict delete
        // Backend supports DELETE /plans/{id} which deletes it.
        // If we want archive (soft delete), we should use update.
        // But the current flow in frontend is 'archive'.
        // Backend 'delete' endpoint effectively removes it.
        // Let's use update to set status = 'archived' as per the UI expectation of "Archiving"

        const response = await api.plans.update(id, { status: 'archived' });
        if (!response.success) {
            return { success: false, data: undefined, error: response.error };
        }
        return { success: true, data: undefined };
    },
};
