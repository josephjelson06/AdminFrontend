'use client';

/**
 * useHotelRoles Hook
 * 
 * Manages hotel roles state and operations via API.
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/shared/ui/Toast';
import type { HotelRole, RoleFilters } from './types';
import { DEFAULT_PERMISSIONS } from '@/lib/hotel/permission-data';

export function useHotelRoles() {
    const { addToast } = useToast();
    const [roles, setRoles] = useState<HotelRole[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<RoleFilters>({});
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await api.roles.list({
                search: filters.search,
                role_type: 'hotel', // Only fetch hotel-type roles (custom + templates)
                skip: (currentPage - 1) * rowsPerPage,
                limit: rowsPerPage,
            });

            if (result.success && result.data) {
                const responseData = result.data as any;
                if (Array.isArray(responseData)) {
                    setRoles(responseData); // Old format
                    setTotalItems(responseData.length);
                } else if (responseData.data) {
                     setRoles(responseData.data);
                     setTotalItems(responseData.total || responseData.data.length);
                }
            } else {
                 addToast('error', 'Error', result.error || 'Failed to fetch roles');
            }
        } catch (err) {
            console.error(err);
            addToast('error', 'Error', 'Failed to load roles');
        } finally {
            setIsLoading(false);
        }
    }, [addToast, filters, currentPage, rowsPerPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addRole = async (data: any) => {
        try {
            const result = await api.roles.create({
                ...data,
                permissions: data.permissions || DEFAULT_PERMISSIONS,
                is_system_role: false
            });

            if (result.success) {
                addToast('success', 'Success', 'Role created successfully');
                fetchData();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to create role');
                return false;
            }
        } catch (err: any) {
            addToast('error', 'Error', err.message || 'Failed to create role');
            return false;
        }
    };

    const updateRole = async (id: number, data: any) => {
        try {
            const result = await api.roles.update(id, data);
            if (result.success) {
                addToast('success', 'Success', 'Role updated successfully');
                fetchData();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to update role');
                return false;
            }
        } catch (err: any) {
            addToast('error', 'Error', err.message || 'Failed to update role');
            return false;
        }
    };

    const deleteRole = async (id: number) => {
        try {
            const result = await api.roles.delete(id);
            if (result.success) {
                addToast('success', 'Success', 'Role deleted successfully');
                fetchData();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to delete role');
                return false;
            }
        } catch (err: any) {
            addToast('error', 'Error', err.message || 'Failed to delete role');
            return false;
        }
    };

    return {
        roles,
        totalItems,
        totalPages: Math.ceil(totalItems / rowsPerPage),
        currentPage,
        rowsPerPage,
        setCurrentPage,
        setRowsPerPage,
        filters,
        setFilters,
        isLoading,
        fetchData,
        addRole,
        updateRole,
        deleteRole,
    };
}
