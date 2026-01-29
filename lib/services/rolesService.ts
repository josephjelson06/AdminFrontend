/**
 * Roles Service
 * 
 * Abstracts all role-related API calls.
 */

import { MOCK_ROLES, type RoleDefinition } from '@/lib/admin/rbac-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store
let roles = [...MOCK_ROLES];

export const rolesService = {
    /**
     * List all roles
     */
    async list(): Promise<RoleDefinition[]> {
        await delay();
        return [...roles];
    },

    /**
     * Get role by ID
     */
    async get(id: string): Promise<RoleDefinition | null> {
        await delay();
        return roles.find(r => r.id === id) || null;
    },

    /**
     * Create a new role
     */
    async create(role: Omit<RoleDefinition, 'id' | 'userCount'>): Promise<ServiceResponse<RoleDefinition>> {
        await delay(500);
        const newRole: RoleDefinition = {
            ...role,
            id: `role-${Date.now()}`,
            userCount: 0,
        };
        roles = [...roles, newRole];
        return { success: true, data: newRole, error: undefined };
    },

    /**
     * Update a role
     */
    async update(id: string, updates: Partial<RoleDefinition>): Promise<ServiceResponse<RoleDefinition | undefined>> {
        await delay(500);
        const index = roles.findIndex(r => r.id === id);
        if (index === -1) {
            return { success: false, data: undefined, error: 'Role not found' };
        }
        roles[index] = { ...roles[index], ...updates };
        return { success: true, data: roles[index], error: undefined };
    },

    /**
     * Delete a role
     */
    async delete(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        const role = roles.find(r => r.id === id);
        if (!role) {
            return { success: false, data: undefined, error: 'Role not found' };
        }
        if (role.name === 'Super Admin') {
            return { success: false, data: undefined, error: 'Cannot delete Super Admin role' };
        }
        roles = roles.filter(r => r.id !== id);
        return { success: true, data: undefined, error: undefined };
    },
};
