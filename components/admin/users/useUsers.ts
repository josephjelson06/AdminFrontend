'use client';

/**
 * useUsers Hook
 * 
 * Manages admin user list fetching with filtering.
 */

import { useState, useEffect, useCallback } from 'react';
import { userService, type AdminUser } from '@/lib/services/userService';
import { useFilters, useDebounce } from '@/lib/hooks';

export interface UserFilters {
    search: string;
    role: string;
    status: AdminUser['status'] | '';
    [key: string]: string;
}

export interface UseUsersReturn {
    // Data
    users: AdminUser[];
    isLoading: boolean;
    error: Error | null;

    // Filtering
    filters: UserFilters;
    setFilter: <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => void;
    clearFilters: () => void;

    // Actions
    refresh: () => void;
}

const defaultFilters: UserFilters = {
    search: '',
    role: '',
    status: '',
};

export function useUsers(): UseUsersReturn {
    // State
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Hooks
    const { filters, setFilter, clearAllFilters } = useFilters<UserFilters>({
        initialFilters: defaultFilters,
    });

    // Debounce search
    const debouncedSearch = useDebounce(filters.search, 300);

    // Fetch data
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await userService.list({
                search: debouncedSearch || undefined,
                filters: {
                    ...(filters.role && { role: filters.role }),
                    ...(filters.status && { status: filters.status as AdminUser['status'] }),
                },
            });

            setUsers(response.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch users'));
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, filters.role, filters.status]);

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        isLoading,
        error,
        filters,
        setFilter,
        clearFilters: clearAllFilters,
        refresh: fetchUsers,
    };
}
