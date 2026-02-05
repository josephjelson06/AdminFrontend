/**
 * Hotels Service
 * 
 * Abstracts all hotel-related API calls through the adapter pattern.
 * For now, uses mock data directly for backward compatibility.
 */
import type { Hotel } from '@/types/schema';
import { api } from '@/lib/api';

// Consistent response type for service methods
export interface ServiceResponse<T> {
    success: boolean;
    data: T | undefined;
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
        try {
            const response = await api.hotels.list({
                page: params?.page,
                status: params?.filters?.status
            });

            if (!response.success) throw new Error(response.error);

            // Backend returns flat list for now, we simulate pagination structure wrapper on frontend service layer
            // or if backend implements pagination, we map it. 
            // Current Backend `read_hotels` returns List[Hotel].
            const rawHotels = response.data as Array<Record<string, unknown>>;

            // Map backend snake_case to frontend camelCase
            const allHotels = rawHotels.map(h => ({
                id: String(h.id),
                name: h.name as string,
                location: h.location as string,
                city: (h.city || '') as string,
                state: (h.state || '') as string,
                status: (h.status || 'onboarding') as Hotel['status'],
                plan: (h.subscription_plan || 'standard') as Hotel['plan'],
                kioskCount: 0, // Not in backend yet
                mrr: 0, // Not in backend yet
                contractRenewalDate: new Date().toISOString(),
                contactEmail: '', // Backend doesn't return this on list
                contactPhone: '',
                onboardedDate: new Date().toISOString(),
            })) as Hotel[];

            // Client-side filtering/sorting/pagination simulation until backend supports it fully
            // NOTE: Ideally backend supports all params. For now we fetch all and paginate client side if needed
            // or just return all as "one page".

            return {
                data: allHotels,
                pagination: {
                    page: 1,
                    pageSize: allHotels.length,
                    totalPages: 1,
                    totalItems: allHotels.length,
                }
            };
        } catch (error) {
            console.error('Hotel list error:', error);
            // Fallback to empty
            return {
                data: [],
                pagination: { page: 1, pageSize: 10, totalPages: 1, totalItems: 0 }
            };
        }
    },

    /**
     * Fetch a single hotel by ID
     */
    async get(id: string): Promise<ServiceResponse<Hotel | null>> {
        try {
            const response = await api.hotels.get(id);
            return {
                success: response.success,
                data: response.data as Hotel,
                error: response.error
            };
        } catch (error) {
            return { success: false, data: null, error: (error as Error).message };
        }
    },

    /**
     * Create a new hotel
     */
    async create(data: Partial<Hotel> & { managerName?: string; password?: string }): Promise<ServiceResponse<Hotel | null>> {
        try {
            const payload = {
                ...data,
                manager_name: data.managerName, // Map camelCase to snake_case
                contact_email: data.contactEmail,
                password: data.password,
                subscription_plan: data.plan // Map plan to subscription_plan
            };
            const response = await api.hotels.create(payload);
            return {
                success: response.success,
                data: response.data as Hotel,
                error: response.error
            };
        } catch (error) {
            return { success: false, data: null, error: (error as Error).message };
        }
    },

    /**
     * Update an existing hotel
     */
    async update(id: string, data: Partial<Hotel>): Promise<ServiceResponse<Hotel | null>> {
        try {
            const response = await api.hotels.update(id, data);
            return {
                success: response.success,
                data: response.data as Hotel,
                error: response.error
            };
        } catch (error) {
            return { success: false, data: null, error: (error as Error).message };
        }
    },

    /**
     * Delete a hotel
     */
    async delete(id: string): Promise<ServiceResponse<void>> {
        try {
            const response = await api.hotels.delete(id);
            return { success: response.success, data: undefined, error: response.error };
        } catch (error) {
            return { success: false, data: undefined, error: (error as Error).message };
        }
    },

    /**
     * Impersonate a hotel admin
     */
    async impersonate(hotelId: string): Promise<ServiceResponse<{ hotelId: string; token: string }>> {
        // TODO: Implement real impersonation if supported by backend
        return { success: true, data: { hotelId, token: 'mock-hotel-admin-token' } };
    },
};
