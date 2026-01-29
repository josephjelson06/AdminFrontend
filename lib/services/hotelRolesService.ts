/**
 * Hotel Roles Service
 * 
 * Abstracts role management operations.
 */

import {
    MOCK_HOTEL_ROLES,
    type HotelRoleDefinition,
    type HotelPageAccess,
} from '@/lib/hotel/rbac-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface RolesData {
    roles: HotelRoleDefinition[];
    totalRoles: number;
    totalUsers: number;
}

export const hotelRolesService = {
    /**
     * Get roles data
     */
    async getRolesData(): Promise<RolesData> {
        await delay(100);
        const roles = MOCK_HOTEL_ROLES;
        const totalUsers = roles.reduce((sum, r) => sum + r.userCount, 0);
        return {
            roles,
            totalRoles: roles.length,
            totalUsers,
        };
    },

    /**
     * Update role permissions
     */
    async updateRolePermissions(
        roleId: string,
        pageAccess: HotelPageAccess[]
    ): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Filter roles by search
     */
    filterRoles(roles: HotelRoleDefinition[], query: string): HotelRoleDefinition[] {
        if (!query.trim()) return roles;
        const lowerQuery = query.toLowerCase();
        return roles.filter(role =>
            role.name.toLowerCase().includes(lowerQuery) ||
            role.description.toLowerCase().includes(lowerQuery)
        );
    },
};
