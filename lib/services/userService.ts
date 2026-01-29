/**
 * Users Service
 * 
 * Abstracts all admin user-related API calls.
 */

import type { ServiceResponse, PaginatedResult } from './hotelService';
import { MOCK_ADMIN_USERS, type AdminUser } from '@/lib/admin/users-data';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

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

// Pagination helper
function paginate<T>(data: T[], page: number = 1, pageSize: number = 10): PaginatedResult<T> {
    const start = (page - 1) * pageSize;
    return {
        data: data.slice(start, start + pageSize),
        pagination: {
            page,
            pageSize,
            totalPages: Math.ceil(data.length / pageSize),
            totalItems: data.length,
        },
    };
}

export const userService = {
    /**
     * Fetch paginated list of users with optional filters
     */
    async list(params?: UserQueryParams): Promise<PaginatedResult<AdminUser>> {
        await delay();

        let data = [...MOCK_ADMIN_USERS];

        // Apply search
        if (params?.search) {
            const search = params.search.toLowerCase();
            data = data.filter(u =>
                u.name.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search)
            );
        }

        // Apply filters
        if (params?.filters?.role) {
            data = data.filter(u => u.roleName === params.filters!.role);
        }
        if (params?.filters?.status) {
            data = data.filter(u => u.status === params.filters!.status);
        }
        if (params?.filters?.department) {
            data = data.filter(u => u.department === params.filters!.department);
        }

        return paginate(data, params?.page, params?.pageSize);
    },

    /**
     * Fetch a single user by ID
     */
    async get(id: string): Promise<ServiceResponse<AdminUser | null>> {
        await delay();
        const user = MOCK_ADMIN_USERS.find(u => u.id === id);
        return {
            success: !!user,
            data: user || null,
            error: user ? undefined : 'User not found',
        };
    },

    /**
     * Invite a new user (mock)
     */
    async invite(data: Partial<AdminUser>): Promise<ServiceResponse<AdminUser>> {
        await delay(500);
        const newUser = {
            id: `user-${Date.now()}`,
            ...data,
            status: 'invited' as const,
            lastActive: 'Never',
            createdAt: new Date().toISOString(),
        } as AdminUser;
        return { success: true, data: newUser, error: undefined };
    },

    /**
     * Update user role (mock)
     */
    async updateRole(id: string, roleId: string, roleName: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Suspend a user (mock)
     */
    async suspend(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Activate a user (mock)
     */
    async activate(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Reset user password (mock)
     */
    async resetPassword(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Delete a user (mock)
     */
    async delete(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },
};
