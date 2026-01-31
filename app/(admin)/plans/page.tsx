'use client';

/**
 * Plans Page
 * 
 * Admin page for managing subscription plans.
 * Uses the PlanList component from admin/plans.
 */

import { PlanList } from '@/components/admin/plans';

export default function PlansPage() {
    return (
        <div className="animate-in fade-in duration-normal">
            <PlanList />
        </div>
    );
}
