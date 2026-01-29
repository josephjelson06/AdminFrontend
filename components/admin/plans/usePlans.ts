'use client';

/**
 * usePlans Hook
 * 
 * Manages subscription plans state and actions.
 */

import { useState, useEffect, useCallback } from 'react';
import { planService, type Plan } from '@/lib/services/planService';

export interface UsePlansReturn {
    plans: Plan[];
    isLoading: boolean;
    error: Error | null;
    editingPlan: Plan | null;
    isEditorOpen: boolean;
    openEditor: (plan?: Plan) => void;
    closeEditor: () => void;
    savePlan: (plan: Plan) => Promise<void>;
    archivePlan: (id: string) => Promise<void>;
    refresh: () => void;
}

export function usePlans(): UsePlansReturn {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await planService.list();
            setPlans(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch plans'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const openEditor = useCallback((plan?: Plan) => {
        setEditingPlan(plan || null);
        setIsEditorOpen(true);
    }, []);

    const closeEditor = useCallback(() => {
        setEditingPlan(null);
        setIsEditorOpen(false);
    }, []);

    const savePlan = useCallback(async (plan: Plan) => {
        if (editingPlan) {
            await planService.update(plan.id, plan);
            setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
        } else {
            const result = await planService.create(plan);
            if (result.success && result.data) {
                setPlans(prev => [...prev, result.data]);
            }
        }
        closeEditor();
    }, [editingPlan, closeEditor]);

    const archivePlan = useCallback(async (id: string) => {
        await planService.archive(id);
        setPlans(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' as const } : p));
    }, []);

    return {
        plans,
        isLoading,
        error,
        editingPlan,
        isEditorOpen,
        openEditor,
        closeEditor,
        savePlan,
        archivePlan,
        refresh: fetchPlans,
    };
}
