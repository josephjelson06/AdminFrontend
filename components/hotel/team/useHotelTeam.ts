'use client';

/**
 * useHotelTeam Hook
 * 
 * Manages hotel team state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { hotelTeamService, type TeamData } from '@/lib/services/hotelTeamService';
import type { HotelUser } from '@/lib/hotel/hotel-data';
import type { RoleConfig } from '@/lib/hotel/rbac-data';

export interface UseHotelTeamReturn {
    // Data
    team: HotelUser[];
    roles: RoleConfig[];
    paginatedTeam: HotelUser[];
    totalPages: number;

    // Pagination
    currentPage: number;
    rowsPerPage: number;
    setCurrentPage: (page: number) => void;
    setRowsPerPage: (rows: number) => void;

    // Actions
    addMember: (member: Partial<HotelUser>) => Promise<boolean>;
    updateRoleAccess: (roleId: string, access: string[]) => Promise<boolean>;

    // State
    isLoading: boolean;
    editingRole: RoleConfig | null;
    setEditingRole: (role: RoleConfig | null) => void;
}

export function useHotelTeam(): UseHotelTeamReturn {
    const [team, setTeam] = useState<HotelUser[]>([]);
    const [roles, setRoles] = useState<RoleConfig[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPageState] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [editingRole, setEditingRole] = useState<RoleConfig | null>(null);

    const totalPages = Math.max(1, Math.ceil(team.length / rowsPerPage));
    const paginatedTeam = hotelTeamService.paginateTeam(team, currentPage, rowsPerPage);

    useEffect(() => {
        const fetchTeamData = async () => {
            setIsLoading(true);
            try {
                const data = await hotelTeamService.getTeamData();
                setTeam(data.team);
                setRoles(data.roles);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeamData();
    }, []);

    // Reset page when rowsPerPage changes
    const setRowsPerPage = useCallback((rows: number) => {
        setRowsPerPageState(rows);
        setCurrentPage(1);
    }, []);

    const addMember = useCallback(async (member: Partial<HotelUser>): Promise<boolean> => {
        const result = await hotelTeamService.addMember(member);
        if (result.success && result.data) {
            setTeam(prev => [...prev, result.data!]);
        }
        return result.success;
    }, []);

    const updateRoleAccess = useCallback(async (roleId: string, access: string[]): Promise<boolean> => {
        const result = await hotelTeamService.updateRoleAccess(roleId, access);
        if (result.success) {
            setRoles(prev => prev.map(r =>
                r.id === roleId ? { ...r, access } : r
            ));
        }
        return result.success;
    }, []);

    return {
        team,
        roles,
        paginatedTeam,
        totalPages,
        currentPage,
        rowsPerPage,
        setCurrentPage,
        setRowsPerPage,
        addMember,
        updateRoleAccess,
        isLoading,
        editingRole,
        setEditingRole,
    };
}
