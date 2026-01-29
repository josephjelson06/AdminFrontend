/**
 * Hotel Team Service
 * 
 * Abstracts team member and role management operations.
 */

import {
    MOCK_HOTEL_TEAM,
    type HotelUser,
    type HotelUserRole,
} from '@/lib/hotel/hotel-data';
import { INITIAL_ROLES, type RoleConfig } from '@/lib/hotel/rbac-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface TeamData {
    team: HotelUser[];
    roles: RoleConfig[];
}

export const hotelTeamService = {
    /**
     * Get team data
     */
    async getTeamData(): Promise<TeamData> {
        await delay(100);
        return {
            team: MOCK_HOTEL_TEAM,
            roles: INITIAL_ROLES,
        };
    },

    /**
     * Add team member
     */
    async addMember(member: Partial<HotelUser>): Promise<ServiceResponse<HotelUser>> {
        await delay(500);
        const newMember: HotelUser = {
            id: `u${Date.now()}`,
            name: member.name || '',
            email: member.email || '',
            role: member.role || 'front_desk',
            hotelId: member.hotelId || 'hotel-001',
            status: 'active',
            lastLogin: new Date().toISOString(),
        };
        return { success: true, data: newMember, error: undefined };
    },

    /**
     * Update role access
     */
    async updateRoleAccess(roleId: string, access: string[]): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Paginate team members
     */
    paginateTeam(team: HotelUser[], page: number, rowsPerPage: number): HotelUser[] {
        const start = (page - 1) * rowsPerPage;
        return team.slice(start, start + rowsPerPage);
    },
};
