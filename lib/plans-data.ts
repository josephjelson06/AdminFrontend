// Plans Data - Commercial Configuration
import type { Plan } from '@/types/finance';

export const MOCK_PLANS: Plan[] = [
    {
        id: 'plan-standard',
        name: 'Standard',
        description: 'Essential features for small to medium hotels',
        pricingModel: 'flat',
        basePrice: 15000,
        includedKiosks: 2,
        overageRate: 8000,
        billingFrequency: ['monthly', 'quarterly', 'annual'],
        status: 'active',
        features: [
            'Up to 2 kiosks included',
            'Basic check-in/check-out',
            '2 supported languages',
            'Email support',
            'Standard reports',
            'Guest ID verification',
        ],
        effectiveDate: '2024-01-01',
        version: 1,
        subscriberCount: 7,
    },
    {
        id: 'plan-advanced',
        name: 'Advanced',
        description: 'Full-featured solution for growing hotel chains',
        pricingModel: 'flat',
        basePrice: 50000,
        includedKiosks: 5,
        overageRate: 7000,
        billingFrequency: ['monthly', 'quarterly', 'annual'],
        status: 'active',
        features: [
            'Up to 5 kiosks included',
            'Advanced check-in with upselling',
            'All 8 supported languages',
            'Priority phone & email support',
            'Advanced analytics & reports',
            'Guest ID verification',
            'Room upgrade suggestions',
            'Late checkout handling',
            'API access',
        ],
        effectiveDate: '2024-01-01',
        version: 1,
        subscriberCount: 5,
    },
    {
        id: 'plan-enterprise',
        name: 'Enterprise',
        description: 'Custom solution for large hotel groups',
        pricingModel: 'tiered',
        basePrice: 150000,
        includedKiosks: 20,
        overageRate: 5000,
        billingFrequency: ['quarterly', 'annual'],
        status: 'active',
        features: [
            'Up to 20 kiosks included',
            'White-label branding',
            'All languages supported',
            'Dedicated account manager',
            'Custom integrations',
            'Real-time analytics',
            'SLA guarantees',
            'On-site installation support',
            'Staff training included',
            'Multi-property dashboard',
        ],
        effectiveDate: '2024-06-01',
        version: 1,
        subscriberCount: 0,
    },
    {
        id: 'plan-basic-legacy',
        name: 'Basic (Legacy)',
        description: 'Original basic plan - no longer offered',
        pricingModel: 'flat',
        basePrice: 10000,
        includedKiosks: 1,
        overageRate: 10000,
        billingFrequency: ['monthly'],
        status: 'deprecated',
        features: [
            '1 kiosk included',
            'Basic check-in only',
            'English only',
            'Email support',
        ],
        effectiveDate: '2023-01-01',
        version: 1,
        subscriberCount: 0,
    },
];

// Helper functions
export function formatPlanPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
}

export function getPlanById(id: string): Plan | undefined {
    return MOCK_PLANS.find(plan => plan.id === id);
}

export function getActivePlans(): Plan[] {
    return MOCK_PLANS.filter(plan => plan.status === 'active');
}
