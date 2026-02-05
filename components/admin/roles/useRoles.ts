'use client';

/**
 * useRoles Hook
 * 
 * Manages roles listing and actions.
 */

import { useState, useEffect, useCallback } from 'react';
import { rolesService } from '@/lib/services/rolesService';
import type { RoleDefinition } from '@/lib/admin/rbac-data';

export interface UseRolesReturn {
    roles: RoleDefinition[];
    isLoading: boolean;
    error: Error | null;
    deleteRole: (id: string) => Promise<boolean>;
    refresh: () => void;
}

export function useRoles(): UseRolesReturn {
    const [roles, setRoles] = useState<RoleDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Admin panel should only show platform/system roles
            const data = await rolesService.list('platform');
            setRoles(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load roles'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const deleteRole = useCallback(async (id: string): Promise<boolean> => {
        const result = await rolesService.delete(id);
        if (result.success) {
            setRoles(prev => prev.filter(r => r.id !== id));
        }
        return result.success;
    }, []);

    return {
        roles,
        isLoading,
        error,
        deleteRole,
        refresh: fetchRoles,
    };
}
