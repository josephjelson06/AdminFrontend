/**
 * API Client - Production-ready API integration layer
 * 
 * This module provides a centralized API client for making HTTP requests.
 * Currently uses mock data in development, can switch to real API with env flag.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
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

    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include', // Include cookies for auth
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                message: errorData.message || 'An error occurred',
                code: errorData.code || 'UNKNOWN_ERROR',
                status: response.status,
            } as ApiError;
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        if ((error as ApiError).status) {
            throw error;
        }
        throw {
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR',
            status: 0,
        } as ApiError;
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

    // Auth
    auth: {
        login: async (email: string, password: string) => {
            if (USE_MOCK) {
                // Mock login handled by auth context
                await new Promise(resolve => setTimeout(resolve, 800));
                return { success: true, data: { message: 'Mock login' } };
            }
            return apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
        },

        logout: async () => {
            if (USE_MOCK) {
                return { success: true, data: { message: 'Mock logout' } };
            }
            return apiFetch('/auth/logout', { method: 'POST' });
        },

        me: async () => {
            if (USE_MOCK) {
                return { success: false, data: null, error: 'Not authenticated in mock mode' };
            }
            return apiFetch('/auth/me');
        },
    },
};

export default api;
