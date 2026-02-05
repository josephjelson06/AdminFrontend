/**
 * Roles Service
 * 
 * Abstracts all role-related API calls.
 */

import { MOCK_ROLES, type RoleDefinition } from '@/lib/admin/rbac-data';
import { api } from '@/lib/api';
import type { ServiceResponse } from './hotelService';

// Check if mock mode is enabled
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// Simulate network delay for mock data
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for mock mode
let mockRoles = [...MOCK_ROLES];

// Helper to map API response to RoleDefinition
// eslint-disable-next-line
function mapApiRole(apiRole: any): RoleDefinition {
    return {
        id: `role-${apiRole.id}`,
        name: apiRole.name,
        description: apiRole.description || '',
        permissions: apiRole.permissions || {},
        userCount: apiRole.user_count || 0,
        createdAt: apiRole.created_at || new Date().toISOString(),
        updatedAt: apiRole.updated_at || new Date().toISOString(),
    };
}

export const rolesService = {
    /**
     * List all roles
     */
    async list(role_type?: string): Promise<RoleDefinition[]> {
        if (USE_MOCK) {
            await delay();
            return [...mockRoles];
        }

        try {
            const response = await api.roles.list({ role_type });
            // Handle response.data.data structure (paginated) or response.data (direct array)
            const responseData = response?.data as any;
            const data = responseData?.data || responseData;
            
            if (Array.isArray(data)) {
                return data.map(mapApiRole);
            }
            return [...mockRoles]; // Fallback if unexpected structure
        } catch {
            // Silently fallback to mock data on any API error
            return [...mockRoles];
        }
    },

    /**
     * Get role by ID
     */
    async get(id: string): Promise<RoleDefinition | null> {
        if (USE_MOCK) {
            await delay();
            return mockRoles.find(r => r.id === id) || null;
        }

        try {
            const numericId = parseInt(id.replace('role-', ''), 10);
            if (isNaN(numericId)) return null;

            const response = await api.roles.get(numericId);
            if (response?.data) {
                return mapApiRole(response.data);
            }
            return mockRoles.find(r => r.id === id) || null;
        } catch {
            return mockRoles.find(r => r.id === id) || null;
        }
    },

    /**
     * Create a new role
     */
    async create(role: Omit<RoleDefinition, 'id' | 'userCount'>): Promise<ServiceResponse<RoleDefinition>> {
        if (USE_MOCK) {
            await delay(500);
            const newRole: RoleDefinition = {
                ...role,
                id: `role-${Date.now()}`,
                userCount: 0,
            };
            mockRoles = [...mockRoles, newRole];
            return { success: true, data: newRole, error: undefined };
        }

        try {
            // Convert permissions to API format
            const permissionsForApi: Record<string, Record<string, boolean>> = {};
            for (const [key, value] of Object.entries(role.permissions)) {
                permissionsForApi[key] = {
                    view: value.view,
                    add: value.add,
                    edit: value.edit,
                    delete: value.delete,
                };
            }

            const response = await api.roles.create({
                name: role.name,
                description: role.description,
                permissions: permissionsForApi,
            });

            if (response?.data) {
                return { success: true, data: mapApiRole(response.data), error: undefined };
            }
            return { success: false, data: undefined, error: 'Failed to create role' };
        } catch {
            return { success: false, data: undefined, error: 'Failed to create role' };
        }
    },

    /**
     * Update a role
     */
    async update(id: string, updates: Partial<RoleDefinition>): Promise<ServiceResponse<RoleDefinition | undefined>> {
        if (USE_MOCK) {
            await delay(500);
            const index = mockRoles.findIndex(r => r.id === id);
            if (index === -1) {
                return { success: false, data: undefined, error: 'Role not found' };
            }
            mockRoles[index] = { ...mockRoles[index], ...updates };
            return { success: true, data: mockRoles[index], error: undefined };
        }

        try {
            const numericId = parseInt(id.replace('role-', ''), 10);
            if (isNaN(numericId)) {
                return { success: false, data: undefined, error: 'Invalid role ID' };
            }

            // Convert permissions if present
            let permissionsForApi: Record<string, Record<string, boolean>> | undefined;
            if (updates.permissions) {
                permissionsForApi = {};
                for (const [key, value] of Object.entries(updates.permissions)) {
                    permissionsForApi[key] = {
                        view: value.view,
                        add: value.add,
                        edit: value.edit,
                        delete: value.delete,
                    };
                }
            }

            const response = await api.roles.update(numericId, {
                name: updates.name,
                description: updates.description,
                permissions: permissionsForApi,
            });

            if (response?.data) {
                return { success: true, data: mapApiRole(response.data), error: undefined };
            }
            return { success: false, data: undefined, error: 'Failed to update role' };
        } catch {
            return { success: false, data: undefined, error: 'Failed to update role' };
        }
    },

    /**
     * Delete a role
     */
    async delete(id: string): Promise<ServiceResponse<void>> {
        if (USE_MOCK) {
            await delay(500);
            const role = mockRoles.find(r => r.id === id);
            if (!role) {
                return { success: false, data: undefined, error: 'Role not found' };
            }
            if (role.name === 'Super Admin') {
                return { success: false, data: undefined, error: 'Cannot delete Super Admin role' };
            }
            mockRoles = mockRoles.filter(r => r.id !== id);
            return { success: true, data: undefined, error: undefined };
        }

        try {
            const numericId = parseInt(id.replace('role-', ''), 10);
            if (isNaN(numericId)) {
                return { success: false, data: undefined, error: 'Invalid role ID' };
            }

            await api.roles.delete(numericId);
            return { success: true, data: undefined, error: undefined };
        } catch {
            return { success: false, data: undefined, error: 'Failed to delete role' };
        }
    },
};
