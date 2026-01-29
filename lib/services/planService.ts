/**
 * Plan Service
 * 
 * Abstracts all subscription plan-related API calls.
 */

import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

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

// Initial mock data
const INITIAL_PLANS: Plan[] = [
    {
        id: 'plan-001',
        name: 'Starter',
        description: 'Perfect for small boutique hotels starting with automation.',
        price: 4999,
        currency: 'INR',
        billingCycle: 'monthly',
        limits: { kiosks: 2, users: 3, storage: '10GB' },
        features: ['Basic Kiosk Mode', 'Email Support', '7-Day Data Retention'],
        status: 'active'
    },
    {
        id: 'plan-002',
        name: 'Professional',
        description: 'Advanced features for scaling hotel chains.',
        price: 12999,
        currency: 'INR',
        billingCycle: 'monthly',
        limits: { kiosks: 10, users: 15, storage: '100GB' },
        features: ['Voice AI Enabled', 'Priority 24/7 Support', '90-Day Data Retention', 'Custom Branding'],
        status: 'active',
        popular: true
    },
    {
        id: 'plan-003',
        name: 'Enterprise',
        description: 'Full-scale solution for luxury properties.',
        price: 24999,
        currency: 'INR',
        billingCycle: 'monthly',
        limits: { kiosks: 50, users: 999, storage: 'Unlimited' },
        features: ['Dedicated Account Manager', 'SLA Guarantee', 'Unlimited History', 'API Access', 'On-premise Deployment'],
        status: 'active'
    }
];

// In-memory state for mock
let plans = [...INITIAL_PLANS];

export const planService = {
    /**
     * Fetch all plans
     */
    async list(): Promise<Plan[]> {
        await delay();
        return [...plans];
    },

    /**
     * Get single plan by ID
     */
    async get(id: string): Promise<ServiceResponse<Plan | null>> {
        await delay();
        const plan = plans.find(p => p.id === id);
        return {
            success: !!plan,
            data: plan || null,
            error: plan ? undefined : 'Plan not found',
        };
    },

    /**
     * Create new plan
     */
    async create(data: Omit<Plan, 'id'>): Promise<ServiceResponse<Plan>> {
        await delay(500);
        const newPlan: Plan = {
            ...data,
            id: `plan-${Date.now()}`,
        };
        plans.push(newPlan);
        return { success: true, data: newPlan, error: undefined };
    },

    /**
     * Update existing plan
     */
    async update(id: string, data: Partial<Plan>): Promise<ServiceResponse<Plan>> {
        await delay(500);
        const index = plans.findIndex(p => p.id === id);
        if (index === -1) {
            return { success: false, data: undefined as any, error: 'Plan not found' };
        }
        plans[index] = { ...plans[index], ...data };
        return { success: true, data: plans[index], error: undefined };
    },

    /**
     * Archive plan
     */
    async archive(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        const index = plans.findIndex(p => p.id === id);
        if (index === -1) {
            return { success: false, data: undefined, error: 'Plan not found' };
        }
        plans[index].status = 'archived';
        return { success: true, data: undefined, error: undefined };
    },
};
