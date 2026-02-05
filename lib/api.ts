/**
 * API Client - Production-ready API integration layer
 * 
 * This module provides a centralized API client for making HTTP requests.
 * Currently uses mock data in development, can switch to real API with env flag.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// ============================================
// TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    meta?: {
        page?: number;
        perPage?: number;
        total?: number;
    };
}

export interface ApiError {
    message: string;
    code: string;
    status: number;
}

// ============================================
// BASE FETCH WRAPPER
// ============================================

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('atc_token') : null;

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            credentials: 'include', // Include cookies for auth
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || errorData.detail || 'An error occurred';
            const error = new Error(errorMessage) as any;
            error.code = errorData.code || 'UNKNOWN_ERROR';
            error.status = response.status;
            throw error;
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        const apiError = new Error('Network error. Please check your connection.') as any;
        apiError.code = 'NETWORK_ERROR';
        apiError.status = 0;
        throw apiError;
    }
}

// ============================================
// API METHODS
// ============================================

export const api = {
    // Hotels
    hotels: {
        list: async (params?: { page?: number; status?: string }) => {
            if (USE_MOCK) {
                const { MOCK_HOTELS } = await import('@/lib/admin/mock-data');
                return { success: true, data: MOCK_HOTELS } as ApiResponse<typeof MOCK_HOTELS>;
            }
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set('page', params.page.toString());
            if (params?.status) searchParams.set('status', params.status);
            return apiFetch(`/hotels?${searchParams}`);
        },

        get: async (id: string) => {
            if (USE_MOCK) {
                const { MOCK_HOTELS } = await import('@/lib/admin/mock-data');
                const hotel = MOCK_HOTELS.find(h => h.id === id);
                return { success: !!hotel, data: hotel } as ApiResponse<typeof hotel>;
            }
            return apiFetch(`/hotels/${id}`);
        },

        getMe: async () => {
             return apiFetch('/hotels/me');
        },

        updateMe: async (data: unknown) => {
             return apiFetch('/hotels/me', {
                 method: 'PUT',
                 body: JSON.stringify(data),
             });
        },

        create: async (data: unknown) => {
            return apiFetch('/hotels', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        update: async (id: string, data: unknown) => {
            return apiFetch(`/hotels/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        delete: async (id: string) => {
            return apiFetch(`/hotels/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Kiosks
    kiosks: {
        list: async (params?: { hotelId?: string; status?: string }) => {
            if (USE_MOCK) {
                const { MOCK_KIOSKS } = await import('@/lib/admin/mock-data');
                let filtered = MOCK_KIOSKS;
                if (params?.hotelId) {
                    filtered = filtered.filter(k => k.assignedHotelId === params.hotelId);
                }
                if (params?.status) {
                    filtered = filtered.filter(k => k.status === params.status);
                }
                return { success: true, data: filtered } as ApiResponse<typeof filtered>;
            }
            const searchParams = new URLSearchParams();
            if (params?.hotelId) searchParams.set('hotelId', params.hotelId);
            if (params?.status) searchParams.set('status', params.status);
            return apiFetch(`/kiosks?${searchParams}`);
        },

        get: async (id: string) => {
            if (USE_MOCK) {
                const { MOCK_KIOSKS } = await import('@/lib/admin/mock-data');
                const kiosk = MOCK_KIOSKS.find(k => k.id === id);
                return { success: !!kiosk, data: kiosk } as ApiResponse<typeof kiosk>;
            }
            return apiFetch(`/kiosks/${id}`);
        },
    },

    // Dashboard
    dashboard: {
        metrics: async () => {
            if (USE_MOCK) {
                const { MOCK_METRICS } = await import('@/lib/admin/mock-data');
                return { success: true, data: MOCK_METRICS } as ApiResponse<typeof MOCK_METRICS>;
            }
            return apiFetch('/dashboard/metrics');
        },
    },

    // Invoices
    invoices: {
        list: async (params?: { page?: number; status?: string; hotel_id?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set('skip', ((params.page - 1) * 10).toString());
            if (params?.status) searchParams.set('status', params.status);
            if (params?.hotel_id) searchParams.set('hotel_id', params.hotel_id.toString());
            return apiFetch(`/invoices?${searchParams}`);
        },

        get: async (id: string) => {
            return apiFetch(`/invoices/${id}`);
        },

        create: async (data: unknown) => {
            return apiFetch('/invoices', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        update: async (id: string, data: unknown) => {
            return apiFetch(`/invoices/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        delete: async (id: string) => {
            return apiFetch(`/invoices/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Subscriptions
    subscriptions: {
        list: async (params?: { page?: number; pageSize?: number; search?: string; plan?: string; status?: string; tab?: string }) => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set('skip', ((params.page - 1) * (params.pageSize || 10)).toString());
            if (params?.pageSize) searchParams.set('limit', params.pageSize.toString());
            if (params?.search) searchParams.set('search', params.search);
            if (params?.plan) searchParams.set('plan', params.plan);
            if (params?.status) searchParams.set('status', params.status);
            // Tab param might sort/filter on backend, but our backend mainly filters by status/plan for now
            return apiFetch(`/subscriptions?${searchParams}`);
        },

        get: async (id: string) => {
            return apiFetch(`/subscriptions/${id}`);
        },

        update: async (id: string, data: any) => {
            return apiFetch(`/subscriptions/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },
    },

    // Plans
    plans: {
        list: async () => {
            return apiFetch('/plans');
        },

        get: async (id: string) => {
            return apiFetch(`/plans/${id}`);
        },

        create: async (data: unknown) => {
            return apiFetch('/plans', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        update: async (id: string, data: unknown) => {
            return apiFetch(`/plans/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        async delete(id: string) {
            return apiFetch(`/plans/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Reports
    reports: {
        async hotels(params?: { search?: string; status?: string; plan?: string; date_from?: string; date_to?: string; skip?: number; limit?: number }) {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.status) searchParams.set('status', params.status);
            if (params?.plan) searchParams.set('plan', params.plan);
            if (params?.date_from) searchParams.set('date_from', params.date_from);
            if (params?.date_to) searchParams.set('date_to', params.date_to);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            return apiFetch(`/reports/hotels?${searchParams}`);
        },

        invoices: async (params?: { search?: string; status?: string; date_from?: string; date_to?: string; skip?: number; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.status) searchParams.set('status', params.status);
            if (params?.date_from) searchParams.set('date_from', params.date_from);
            if (params?.date_to) searchParams.set('date_to', params.date_to);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            return apiFetch(`/reports/invoices?${searchParams}`);
        },
        subscriptions: async (params?: { search?: string; plan?: string; status?: string; skip?: number; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.plan) searchParams.set('plan', params.plan);
            if (params?.status) searchParams.set('status', params.status);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            return apiFetch(`/reports/subscriptions?${searchParams}`);
        },

        users: async (params?: { search?: string; role?: string; status?: string; skip?: number; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.role) searchParams.set('role', params.role);
            if (params?.status) searchParams.set('status', params.status);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            return apiFetch(`/reports/users?${searchParams}`);
        },

        audit: async (params?: { search?: string; action?: string; date_from?: string; date_to?: string; skip?: number; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.action) searchParams.set('action', params.action);
            if (params?.date_from) searchParams.set('date_from', params.date_from);
            if (params?.date_to) searchParams.set('date_to', params.date_to);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            return apiFetch(`/reports/audit?${searchParams}`);
        },

        revenue: async (params?: { search?: string; period?: string; date_from?: string; date_to?: string; skip?: number; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.period) searchParams.set('period', params.period);
            if (params?.date_from) searchParams.set('date_from', params.date_from);
            if (params?.date_to) searchParams.set('date_to', params.date_to);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            return apiFetch(`/reports/revenue?${searchParams}`);
        },
    },

    // Audit Logs
    audit: {
        list: async (params?: { page?: number; search?: string; limit?: number }) => {
            if (USE_MOCK) {
                const { MOCK_AUDIT_LOGS } = await import('@/lib/admin/audit-data');
                return { success: true, data: MOCK_AUDIT_LOGS } as ApiResponse<typeof MOCK_AUDIT_LOGS>;
            }
             const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set('skip', ((params.page - 1) * (params.limit || 20)).toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            if (params?.search) searchParams.set('search', params.search);
            return apiFetch(`/audit?${searchParams}`);
        },
    },

    // Users
    users: {
        list: async (params?: { search?: string; role?: string; is_active?: boolean; skip?: number; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.role) searchParams.set('role', params.role);
            if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
            if (params?.skip) searchParams.set('skip', String(params.skip));
            if (params?.limit) searchParams.set('limit', String(params.limit));
            return apiFetch(`/users?${searchParams}`);
        },

        get: async (id: number) => {
            return apiFetch(`/users/${id}`);
        },



        updateMe: async (data: any) => {
            return apiFetch('/users/me', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        create: async (data: { email: string; password: string; full_name?: string; role: string; role_id?: number; hotel_id?: number; is_platform_user?: boolean; is_active?: boolean }) => {
            return apiFetch('/users', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        update: async (id: number, data: { email?: string; password?: string; full_name?: string; role?: string; role_id?: number; hotel_id?: number; is_platform_user?: boolean; is_active?: boolean }) => {
            return apiFetch(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        suspend: async (id: number) => {
            return apiFetch(`/users/${id}/suspend`, {
                method: 'PUT',
            });
        },

        activate: async (id: number) => {
            return apiFetch(`/users/${id}/activate`, {
                method: 'PUT',
            });
        },

        delete: async (id: number) => {
            return apiFetch(`/users/${id}`, {
                method: 'DELETE',
            });
        },
        },


    // Guests
    guests: {
        list: async (params?: { search?: string; status?: string; skip?: number; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.status) searchParams.set('status', params.status);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            return apiFetch(`/guests?${searchParams}`);
        },

        get: async (id: number) => {
            return apiFetch(`/guests/${id}`);
        },

        create: async (data: unknown) => {
            return apiFetch('/guests', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        update: async (id: number, data: unknown) => {
            return apiFetch(`/guests/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        delete: async (id: number) => {
            return apiFetch(`/guests/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Incidents
    incidents: {
        list: async (params?: { search?: string; status?: string; skip?: number; limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.status) searchParams.set('status', params.status);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            return apiFetch(`/incidents?${searchParams}`);
        },

        get: async (id: number) => {
            return apiFetch(`/incidents/${id}`);
        },

        create: async (data: unknown) => {
            return apiFetch('/incidents', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        update: async (id: number, data: unknown) => {
            return apiFetch(`/incidents/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        delete: async (id: number) => {
            return apiFetch(`/incidents/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Roles
    roles: {
        list: async (params?: { search?: string; skip?: number; limit?: number; role_type?: string }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            if (params?.role_type) searchParams.set('role_type', params.role_type);
            return apiFetch(`/roles?${searchParams}`);
        },

        get: async (id: number) => {
            return apiFetch(`/roles/${id}`);
        },

        create: async (data: { name: string; description?: string; permissions: Record<string, Record<string, boolean>>; is_system_role?: boolean }) => {
            return apiFetch('/roles', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        update: async (id: number, data: { name?: string; description?: string; permissions?: Record<string, Record<string, boolean>> }) => {
            return apiFetch(`/roles/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        delete: async (id: number) => {
            return apiFetch(`/roles/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Rooms
    rooms: {
        list: async (params?: { skip?: number; limit?: number; floor?: number; status?: string; room_type?: string }) => {
            const searchParams = new URLSearchParams();
            if (params?.skip) searchParams.set('skip', params.skip.toString());
            if (params?.limit) searchParams.set('limit', params.limit.toString());
            if (params?.floor !== undefined) searchParams.set('floor', params.floor.toString());
            if (params?.status) searchParams.set('status', params.status);
            if (params?.room_type) searchParams.set('room_type', params.room_type);
            return apiFetch(`/rooms?${searchParams}`);
        },

        get: async (id: number) => {
            return apiFetch(`/rooms/${id}`);
        },

        create: async (data: { room_number: string; floor: number; room_type: string; status?: string }) => {
            return apiFetch('/rooms', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        update: async (id: number, data: { room_number?: string; floor?: number; room_type?: string; status?: string }) => {
            return apiFetch(`/rooms/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        delete: async (id: number) => {
            return apiFetch(`/rooms/${id}`, {
                method: 'DELETE',
            });
        },
    },

    // Auth
    auth: {
        login: async (email: string, password: string): Promise<{ access_token: string; token_type: string }> => {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/auth/login/access-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Login failed' }));
                throw new Error(error.detail || 'Invalid credentials');
            }

            return response.json();
        },

        logout: async () => {
            localStorage.removeItem('atc_token');
            localStorage.removeItem('atc_user');
            return { success: true, data: { message: 'Logged out' } };
        },

        me: async (token: string): Promise<{ 
            id: number; 
            email: string; 
            full_name: string | null; 
            is_active: boolean; 
            role: string;
            role_ref?: {
                id: number;
                name: string;
                role_type: string;
                permissions: Record<string, any>;
            };
            is_platform_user: boolean;
            hotel_id?: number;
            hotel?: {
                id: number;
                name: string;
            };
        }> => {
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            return response.json();
        },
    },

    // Settings
    settings: {
        list: async () => {
            return apiFetch('/settings');
        },

        get: async (key: string) => {
            return apiFetch(`/settings/${key}`);
        },

        update: async (key: string, data: unknown) => {
            return apiFetch(`/settings/${key}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },
    },
};

export default api;
