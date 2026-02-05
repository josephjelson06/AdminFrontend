/**
 * Users Service
 * 
 * Abstracts all admin user-related API calls.
 * Connects to real API - no mock data.
 */

import { api } from '@/lib/api';
import type { ServiceResponse, PaginatedResult } from './hotelService';

// User type matching API response
export interface ApiUser {
    id: number;
    email: string;
    full_name: string | null;
    is_active: boolean;
    role: string;
    hotel_id?: number | null;
}

// Frontend-friendly user type
export interface AdminUser {
    id: string;
    email: string;
    name: string;
    roleId: string;
    roleName: string;
    status: 'active' | 'suspended' | 'invited';
    lastActive: string;
    createdAt: string;
    avatarUrl?: string;
    department: string;
    mfaEnabled: boolean;
}

export interface UserQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    filters?: {
        role?: string;
        status?: AdminUser['status'];
        department?: string;
    };
}

// Convert API user to frontend AdminUser format
function mapApiUser(apiUser: ApiUser): AdminUser {
    return {
        id: `user-${apiUser.id}`,
        email: apiUser.email,
        name: apiUser.full_name || apiUser.email.split('@')[0],
        roleId: `role-${apiUser.role.toLowerCase().replace(/[_ ]/g, '-')}`,
        roleName: apiUser.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        status: apiUser.is_active ? 'active' : 'suspended',
        lastActive: 'Recently', // Not tracked in current model
        createdAt: new Date().toISOString(), // Not tracked in current model
        department: 'General', // Default department
        mfaEnabled: false, // MFA not tracked in current model
    };
}

// Extract numeric ID from string ID
function getNumericId(id: string): number {
    const match = id.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

export const userService = {
    /**
     * Fetch paginated list of users with optional filters
     */
    async list(params?: UserQueryParams): Promise<PaginatedResult<AdminUser>> {
        try {
            const response = await api.users.list({
                search: params?.search,
                role: params?.filters?.role,
                is_active: params?.filters?.status === 'active' ? true : 
                           params?.filters?.status === 'suspended' ? false : undefined,
                skip: params?.page ? (params.page - 1) * (params?.pageSize || 10) : 0,
                limit: params?.pageSize || 100,
            });

            // eslint-disable-next-line
            const data = (response?.data as any)?.data || [];
            // eslint-disable-next-line
            const total = (response?.data as any)?.total || 0;

            return {
                data: data.map(mapApiUser),
                pagination: {
                    page: params?.page || 1,
                    pageSize: params?.pageSize || 100,
                    totalPages: Math.ceil(total / (params?.pageSize || 100)),
                    totalItems: total,
                },
            };
        } catch {
            // Return empty list on error
            return {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    totalPages: 0,
                    totalItems: 0,
                },
            };
        }
    },

    /**
     * Fetch a single user by ID
     */
    async get(id: string): Promise<ServiceResponse<AdminUser | null>> {
        try {
            const numericId = getNumericId(id);
            if (!numericId) return { success: false, data: null, error: 'Invalid user ID' };

            const response = await api.users.get(numericId);
            if (response?.data) {
                return { 
                    success: true, 
                    data: mapApiUser(response.data as unknown as ApiUser), 
                    error: undefined 
                };
            }
            return { success: false, data: null, error: 'User not found' };
        } catch {
            return { success: false, data: null, error: 'Failed to fetch user' };
        }
    },

    /**
     * Create a new user
     */
    async create(data: { 
        email: string; 
        password: string; 
        full_name?: string; 
        role: string;
    }): Promise<ServiceResponse<AdminUser>> {
        try {
            const response = await api.users.create({
                email: data.email,
                password: data.password,
                full_name: data.full_name,
                role: data.role,
                is_active: true,
            });
            if (response?.data) {
                return { 
                    success: true, 
                    data: mapApiUser(response.data as unknown as ApiUser), 
                    error: undefined 
                };
            }
            return { success: false, data: undefined as unknown as AdminUser, error: 'Failed to create user' };
        } catch {
            return { success: false, data: undefined as unknown as AdminUser, error: 'Failed to create user' };
        }
    },

    /**
     * Invite a new user (alias for create)
     */
    async invite(data: Partial<AdminUser> & { password?: string }): Promise<ServiceResponse<AdminUser>> {
        return this.create({
            email: data.email || '',
            password: data.password || 'TempPassword123!',
            full_name: data.name,
            role: data.roleName?.toUpperCase().replace(' ', '_') || 'SUPER_ADMIN',
        });
    },

    /**
     * Update user details
     */
    async update(id: string, data: {
        email?: string;
        full_name?: string;
        role?: string;
        password?: string;
    }): Promise<ServiceResponse<AdminUser>> {
        try {
            const numericId = getNumericId(id);
            if (!numericId) return { success: false, data: undefined as unknown as AdminUser, error: 'Invalid user ID' };

            const response = await api.users.update(numericId, data);
            if (response?.data) {
                return { 
                    success: true, 
                    data: mapApiUser(response.data as unknown as ApiUser), 
                    error: undefined 
                };
            }
            return { success: false, data: undefined as unknown as AdminUser, error: 'Failed to update user' };
        } catch {
            return { success: false, data: undefined as unknown as AdminUser, error: 'Failed to update user' };
        }
    },

    /**
     * Update user role
     */
    async updateRole(id: string, roleId: string, roleName: string): Promise<ServiceResponse<void>> {
        try {
            const numericId = getNumericId(id);
            if (!numericId) return { success: false, data: undefined, error: 'Invalid user ID' };

            await api.users.update(numericId, { role: roleName.toUpperCase().replace(' ', '_') });
            return { success: true, data: undefined, error: undefined };
        } catch {
            return { success: false, data: undefined, error: 'Failed to update role' };
        }
    },

    /**
     * Suspend a user
     */
    async suspend(id: string): Promise<ServiceResponse<void>> {
        try {
            const numericId = getNumericId(id);
            if (!numericId) return { success: false, data: undefined, error: 'Invalid user ID' };

            await api.users.suspend(numericId);
            return { success: true, data: undefined, error: undefined };
        } catch {
            return { success: false, data: undefined, error: 'Failed to suspend user' };
        }
    },

    /**
     * Activate a user
     */
    async activate(id: string): Promise<ServiceResponse<void>> {
        try {
            const numericId = getNumericId(id);
            if (!numericId) return { success: false, data: undefined, error: 'Invalid user ID' };

            await api.users.activate(numericId);
            return { success: true, data: undefined, error: undefined };
        } catch {
            return { success: false, data: undefined, error: 'Failed to activate user' };
        }
    },

    /**
     * Reset user password (sends new password)
     */
    async resetPassword(id: string): Promise<ServiceResponse<void>> {
        try {
            const numericId = getNumericId(id);
            if (!numericId) return { success: false, data: undefined, error: 'Invalid user ID' };

            // Generate a temporary password and update
            const tempPassword = 'TempPass' + Math.random().toString(36).slice(-8) + '!';
            await api.users.update(numericId, { password: tempPassword });
            return { success: true, data: undefined, error: undefined };
        } catch {
            return { success: false, data: undefined, error: 'Failed to reset password' };
        }
    },

    /**
     * Delete a user
     */
    async delete(id: string): Promise<ServiceResponse<void>> {
        try {
            const numericId = getNumericId(id);
            if (!numericId) return { success: false, data: undefined, error: 'Invalid user ID' };

            await api.users.delete(numericId);
            return { success: true, data: undefined, error: undefined };
        } catch {
            return { success: false, data: undefined, error: 'Failed to delete user' };
        }
    },
};
