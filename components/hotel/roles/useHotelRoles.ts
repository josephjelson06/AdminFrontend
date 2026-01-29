'use client';

/**
 * useHotelRoles Hook
 * 
 * Manages roles page state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    hotelRolesService,
    type RolesData,
} from '@/lib/services/hotelRolesService';
import type { HotelRoleDefinition, HotelPageAccess } from '@/lib/hotel/rbac-data';

export interface UseHotelRolesReturn {
    // Data
    roles: HotelRoleDefinition[];
    filteredRoles: HotelRoleDefinition[];
    totalRoles: number;
    totalUsers: number;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // Editing
    editingRole: HotelRoleDefinition | null;
    setEditingRole: (role: HotelRoleDefinition | null) => void;

    // Actions
    updateRolePermissions: (roleId: string, pageAccess: HotelPageAccess[]) => Promise<boolean>;

    // State
    isLoading: boolean;
}

export function useHotelRoles(): UseHotelRolesReturn {
    const [roles, setRoles] = useState<HotelRoleDefinition[]>([]);
    const [totalRoles, setTotalRoles] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingRole, setEditingRole] = useState<HotelRoleDefinition | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const filteredRoles = hotelRolesService.filterRoles(roles, searchQuery);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await hotelRolesService.getRolesData();
                setRoles(data.roles);
                setTotalRoles(data.totalRoles);
                setTotalUsers(data.totalUsers);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const updateRolePermissions = useCallback(async (
        roleId: string,
        pageAccess: HotelPageAccess[]
    ): Promise<boolean> => {
        const result = await hotelRolesService.updateRolePermissions(roleId, pageAccess);
        if (result.success) {
            setRoles(prev => prev.map(r =>
                r.id === roleId
                    ? { ...r, pageAccess, updatedAt: new Date().toISOString().split('T')[0] }
                    : r
            ));
            setEditingRole(null);
        }
        return result.success;
    }, []);

    return {
        roles,
        filteredRoles,
        totalRoles,
        totalUsers,
        searchQuery,
        setSearchQuery,
        editingRole,
        setEditingRole,
        updateRolePermissions,
        isLoading,
    };
}
