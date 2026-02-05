'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/shared/ui/Toast';
import type { HotelUser, HotelRole, TeamFilters } from './types';

export function useHotelTeam() {
    const { addToast } = useToast();
    const [team, setTeam] = useState<HotelUser[]>([]);
    const [roles, setRoles] = useState<HotelRole[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<TeamFilters>({});
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch users with filters
            const usersResult = await api.users.list({
                search: filters.search,
                role: filters.role,
                is_active: filters.status === 'active' ? true : filters.status === 'inactive' ? false : undefined,
                skip: (currentPage - 1) * rowsPerPage,
                limit: rowsPerPage,
            });

            if (usersResult.success && usersResult.data) {
                // Handle response structure depending on if it's paginated or list
                const responseData = usersResult.data as any;
                if (Array.isArray(responseData)) {
                    setTeam(responseData);
                    setTotalItems(responseData.length);
                } else if (responseData.data) {
                     setTeam(responseData.data);
                     setTotalItems(responseData.total || responseData.data.length);
                }
            } else {
                 addToast('error', 'Error', usersResult.error || 'Failed to fetch team members');
            }

            // Fetch roles for dropdowns (only need to do once really, but simple here)
            const rolesResult = await api.roles.list();
            if (rolesResult.success) {
                 setRoles(rolesResult.data as any);
            }

        } catch (err) {
            console.error(err);
            addToast('error', 'Error', 'Failed to load data');
        } finally {
            setIsLoading(false);
        }
    }, [addToast, filters, currentPage, rowsPerPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addMember = async (data: any) => {
        try {
            // Validate required fields
            if (!data.email || !data.password || !data.full_name) {
                 addToast('error', 'Validation Error', 'Please fill in all required fields');
                 return false;
            }

            const result = await api.users.create({
                ...data,
                is_platform_user: false,
                is_active: true
            });

            if (result.success) {
                addToast('success', 'Success', 'Team member invited successfully');
                fetchData();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to create user');
                return false;
            }
        } catch (err: any) {
            addToast('error', 'Error', err.message || 'Failed to create user');
            return false;
        }
    };

    const updateMember = async (id: number, data: any) => {
        try {
            const result = await api.users.update(id, data);
            if (result.success) {
                addToast('success', 'Success', 'Member updated successfully');
                fetchData();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to update member');
                return false;
            }
        } catch (err: any) {
            addToast('error', 'Error', err.message || 'Failed to update member');
            return false;
        }
    };

    const deleteMember = async (id: number) => {
        try {
            const result = await api.users.delete(id);
            if (result.success) {
                addToast('success', 'Success', 'Member removed successfully');
                fetchData();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to delete member');
                return false;
            }
        } catch (err: any) {
            addToast('error', 'Error', err.message || 'Failed to delete member');
            return false;
        }
    };

     const toggleStatus = async (user: HotelUser) => {
        try {
            const action = user.is_active ? api.users.suspend : api.users.activate;
            const result = await action(user.id);
            if (result.success) {
                addToast('success', 'Success', `User ${user.is_active ? 'suspended' : 'activated'} successfully`);
                fetchData();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to update status');
                return false;
            }
        } catch (err: any) {
             addToast('error', 'Error', err.message || 'Failed to update status');
             return false;
        }
    };

    return {
        team,
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
        addMember,
        updateMember,
        deleteMember,
        toggleStatus,
    };
}
