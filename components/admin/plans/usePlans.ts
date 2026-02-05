'use client';

/**
 * usePlans Hook
 * 
 * Manages subscription plans state and actions.
 */

import { useState, useEffect, useCallback } from 'react';
import { planService, type Plan } from '@/lib/services/planService';
import { api } from '@/lib/api';

export interface UsePlansReturn {
    plans: Plan[];
    isLoading: boolean;
    error: Error | null;
    editingPlan: Plan | null;
    isEditorOpen: boolean;
    openEditor: (plan?: Plan) => void;
    closeEditor: () => void;
    savePlan: (plan: Plan | Omit<Plan, 'id'>) => Promise<void>;
    archivePlan: (id: string) => Promise<void>;
    unarchivePlan: (id: string) => Promise<void>;
    deletePlan: (id: string) => Promise<void>;
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

    const savePlan = useCallback(async (plan: Plan | Omit<Plan, 'id'>) => {
        if (editingPlan && 'id' in plan) {
            await planService.update(plan.id, plan as Plan);
            setPlans(prev => prev.map(p => p.id === (plan as Plan).id ? (plan as Plan) : p));
        } else {
            const result = await planService.create(plan);
            if (result.success && result.data) {
                const newPlan = result.data as Plan;
                setPlans(prev => [...prev, newPlan]);
            }
        }
        closeEditor();
    }, [editingPlan, closeEditor]);

    const archivePlan = useCallback(async (id: string) => {
        await planService.archive(id);
        setPlans(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' as const } : p));
    }, []);

    const unarchivePlan = useCallback(async (id: string) => {
        await planService.update(id, { status: 'active' });
        setPlans(prev => prev.map(p => p.id === id ? { ...p, status: 'active' as const } : p));
    }, []);
    
    const deletePlan = useCallback(async (id: string) => {
        try {
            // Check if planService has delete, if not fallback to archive or implement it
            // Assuming planService has delete as per checking earlier
             await api.plans.delete(id); 
             // Ideally planService.delete(id)
             setPlans(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete plan", error);
            setError(error instanceof Error ? error : new Error('Failed to delete plan'));
        }
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
        unarchivePlan,
        deletePlan,
        refresh: fetchPlans,
    };
}
