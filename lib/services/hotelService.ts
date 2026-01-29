/**
 * Hotels Service
 * 
 * Abstracts all hotel-related API calls through the adapter pattern.
 * For now, uses mock data directly for backward compatibility.
 */

import type { Hotel } from '@/types/schema';
import { MOCK_HOTELS } from '@/lib/admin/mock-data';

// Consistent response type for service methods
export interface ServiceResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

// Pagination response type
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
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

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface HotelQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: {
        status?: string;
        plan?: string;
    };
}

export const hotelService = {
    /**
     * Fetch paginated list of hotels with optional filters
     */
    async list(params?: HotelQueryParams): Promise<PaginatedResult<Hotel>> {
        await delay();

        let data = [...MOCK_HOTELS] as Hotel[];

        // Apply search
        if (params?.search) {
            const search = params.search.toLowerCase();
            data = data.filter(h =>
                h.name.toLowerCase().includes(search) ||
                h.location.toLowerCase().includes(search) ||
                h.city.toLowerCase().includes(search)
            );
        }

        // Apply filters
        if (params?.filters?.status) {
            data = data.filter(h => h.status === params.filters!.status);
        }
        if (params?.filters?.plan) {
            data = data.filter(h => h.plan === params.filters!.plan);
        }

        // Apply sort
        if (params?.sortBy) {
            const sortOrder = params.sortOrder || 'asc';
            data.sort((a, b) => {
                const aVal = (a as Record<string, unknown>)[params.sortBy!];
                const bVal = (b as Record<string, unknown>)[params.sortBy!];
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortOrder === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }
                return 0;
            });
        }

        return paginate(data, params?.page, params?.pageSize);
    },

    /**
     * Fetch a single hotel by ID
     */
    async get(id: string): Promise<ServiceResponse<Hotel | null>> {
        await delay();
        const hotel = MOCK_HOTELS.find(h => h.id === id) as Hotel | undefined;
        return {
            success: !!hotel,
            data: hotel || null,
            error: hotel ? undefined : 'Hotel not found',
        };
    },

    /**
     * Create a new hotel (mock)
     */
    async create(data: Partial<Hotel>): Promise<ServiceResponse<Hotel>> {
        await delay(500);
        const newHotel = {
            id: `hotel-${Date.now()}`,
            ...data,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as Hotel;
        return { success: true, data: newHotel, error: undefined };
    },

    /**
     * Update an existing hotel (mock)
     */
    async update(id: string, data: Partial<Hotel>): Promise<ServiceResponse<Hotel | null>> {
        await delay(500);
        const hotel = MOCK_HOTELS.find(h => h.id === id);
        if (!hotel) {
            return { success: false, data: null, error: 'Hotel not found' };
        }
        const updated = { ...hotel, ...data, updatedAt: new Date().toISOString() } as Hotel;
        return { success: true, data: updated, error: undefined };
    },

    /**
     * Delete a hotel (mock)
     */
    async delete(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Impersonate a hotel admin (mock implementation)
     */
    async impersonate(hotelId: string): Promise<ServiceResponse<{ hotelId: string; token: string }>> {
        await delay(500);
        return { success: true, data: { hotelId, token: 'mock-hotel-admin-token' } };
    },
};
