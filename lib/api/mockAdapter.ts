/**
 * Mock API Adapter
 * 
 * Implements the ApiAdapter interface using local mock data.
 * Simulates network delays and pagination for realistic testing.
 */

import type { ApiAdapter } from './adapter';
import type {
    PaginatedResponse,
    QueryParams,
    Hotel,
    User,
    Subscription,
    Invoice,
    Kiosk,
    AuditLog,
    Role,
    DashboardMetrics,
    SupportTicket,
} from './types';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Generic pagination helper
function paginate<T>(
    data: T[],
    params?: QueryParams
): PaginatedResponse<T> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const paginatedData = data.slice(start, start + pageSize);

    return {
        data: paginatedData,
        pagination: {
            page,
            pageSize,
            totalPages: Math.ceil(data.length / pageSize),
            totalItems: data.length,
        },
    };
}

// Generic search filter
function applySearch<T>(
    data: T[],
    search: string | undefined,
    searchFields: string[]
): T[] {
    if (!search) return data;
    const searchLower = search.toLowerCase();
    return data.filter(item => {
        const record = item as Record<string, unknown>;
        return searchFields.some(field => {
            const value = record[field];
            return typeof value === 'string' && value.toLowerCase().includes(searchLower);
        });
    });
}

// Generic sort helper
function applySort<T>(
    data: T[],
    sortBy: string | undefined,
    sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortBy];
        const bVal = (b as Record<string, unknown>)[sortBy];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
    });
}

export const mockAdapter: ApiAdapter = {
    // ============================================
    // HOTELS
    // ============================================
    hotels: {
        async list(params) {
            await delay();
            const { MOCK_HOTELS } = await import('@/lib/admin/mock-data');

            let data = [...MOCK_HOTELS] as unknown as Hotel[];

            // Apply search
            data = applySearch(data, params?.search, ['name', 'location', 'city']);

            // Apply filters
            if (params?.filters?.status) {
                data = data.filter(h => h.status === params.filters!.status);
            }
            if (params?.filters?.plan) {
                data = data.filter(h => h.plan === params.filters!.plan);
            }

            // Apply sort
            data = applySort(data, params?.sortBy, params?.sortOrder);

            return paginate(data, params);
        },

        async get(id) {
            await delay();
            const { MOCK_HOTELS } = await import('@/lib/admin/mock-data');
            const hotel = (MOCK_HOTELS as unknown as Hotel[]).find(h => h.id === id);
            return {
                success: !!hotel,
                data: hotel!,
                error: hotel ? undefined : 'Hotel not found',
            };
        },

        async create(data) {
            await delay(500);
            const newHotel: Hotel = {
                id: `hotel-${Date.now()}`,
                ...data,
                status: 'pending',
                rating: undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return { success: true, data: newHotel };
        },

        async update(id, data) {
            await delay(500);
            const { MOCK_HOTELS } = await import('@/lib/admin/mock-data');
            const hotel = (MOCK_HOTELS as unknown as Hotel[]).find(h => h.id === id);
            if (!hotel) {
                return { success: false, data: null as unknown as Hotel, error: 'Hotel not found' };
            }
            const updated = { ...hotel, ...data, updatedAt: new Date().toISOString() };
            return { success: true, data: updated };
        },

        async delete(id) {
            await delay(500);
            return { success: true, data: undefined };
        },
    },

    // ============================================
    // USERS
    // ============================================
    users: {
        async list(params) {
            await delay();
            // MOCK_USERS doesn't exist yet - return empty array
            let data: User[] = [];
            data = applySearch(data, params?.search, ['name', 'email']);

            if (params?.filters?.role) {
                data = data.filter(u => u.role === params.filters!.role);
            }
            if (params?.filters?.status) {
                data = data.filter(u => u.status === params.filters!.status);
            }

            data = applySort(data, params?.sortBy, params?.sortOrder);
            return paginate(data, params);
        },

        async get(id) {
            await delay();
            // MOCK_USERS doesn't exist - return not found
            return {
                success: false,
                data: null as unknown as User,
                error: 'User not found',
            };
        },

        async create(data) {
            await delay(500);
            const newUser: User = {
                id: `user-${Date.now()}`,
                ...data,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return { success: true, data: newUser };
        },

        async update(id, data) {
            await delay(500);
            // MOCK_USERS doesn't exist - simulate success
            const updated = { id, ...data, updatedAt: new Date().toISOString() } as User;
            return { success: true, data: updated };
        },

        async delete(id) {
            await delay(500);
            return { success: true, data: undefined };
        },

        async invite(email, roleId) {
            await delay(500);
            // Simulate sending invite email
            console.log(`[Mock] Invite sent to ${email} with role ${roleId}`);
            return { success: true, data: undefined };
        },
    },

    // ============================================
    // SUBSCRIPTIONS
    // ============================================
    subscriptions: {
        async list(params) {
            await delay();
            const data: Subscription[] = [];
            return paginate(data, params);
        },

        async get(id) {
            await delay();
            return { success: false, data: null as unknown as Subscription, error: 'Not found' };
        },

        async cancel(id) {
            await delay(500);
            return { success: true, data: undefined };
        },

        async renew(id) {
            await delay(500);
            return { success: false, data: null as unknown as Subscription, error: 'Not implemented' };
        },
    },

    // ============================================
    // INVOICES
    // ============================================
    invoices: {
        async list(params) {
            await delay();
            const data: Invoice[] = [];
            return paginate(data, params);
        },

        async get(id) {
            await delay();
            return { success: false, data: null as unknown as Invoice, error: 'Not found' };
        },

        async download(id) {
            await delay(500);
            return new Blob(['Mock PDF content'], { type: 'application/pdf' });
        },

        async markAsPaid(id) {
            await delay(500);
            return { success: true, data: null as unknown as Invoice };
        },
    },

    // ============================================
    // KIOSKS
    // ============================================
    kiosks: {
        async list(params) {
            await delay();
            const { MOCK_KIOSKS } = await import('@/lib/admin/mock-data');

            let data = [...MOCK_KIOSKS] as unknown as Kiosk[];
            data = applySearch(data, params?.search, ['serialNumber', 'location']);

            if (params?.filters?.status) {
                data = data.filter(k => k.status === params.filters!.status);
            }
            if (params?.filters?.hotelId) {
                data = data.filter(k => k.assignedHotelId === params.filters!.hotelId);
            }

            data = applySort(data, params?.sortBy, params?.sortOrder);
            return paginate(data, params);
        },

        async get(id) {
            await delay();
            const { MOCK_KIOSKS } = await import('@/lib/admin/mock-data');
            const kiosk = (MOCK_KIOSKS as unknown as Kiosk[]).find(k => k.id === id);
            return {
                success: !!kiosk,
                data: kiosk!,
                error: kiosk ? undefined : 'Kiosk not found',
            };
        },

        async assign(id, hotelId) {
            await delay(500);
            return { success: true, data: null as unknown as Kiosk };
        },

        async unassign(id) {
            await delay(500);
            return { success: true, data: null as unknown as Kiosk };
        },

        async restart(id) {
            await delay(500);
            return { success: true, data: undefined };
        },
    },

    // ============================================
    // ROLES
    // ============================================
    roles: {
        async list() {
            await delay();
            const { MOCK_ROLES } = await import('@/lib/admin/rbac-data');
            return { success: true, data: MOCK_ROLES as unknown as Role[] };
        },

        async get(id) {
            await delay();
            const { MOCK_ROLES } = await import('@/lib/admin/rbac-data');
            const role = (MOCK_ROLES as unknown as Role[]).find(r => r.id === id);
            return {
                success: !!role,
                data: role!,
                error: role ? undefined : 'Role not found',
            };
        },

        async create(data) {
            await delay(500);
            const newRole: Role = {
                id: `role-${Date.now()}`,
                ...data,
                userCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return { success: true, data: newRole };
        },

        async update(id, data) {
            await delay(500);
            return { success: true, data: { id, ...data } as Role };
        },

        async delete(id) {
            await delay(500);
            return { success: true, data: undefined };
        },
    },

    // ============================================
    // AUDIT LOGS
    // ============================================
    auditLogs: {
        async list(params) {
            await delay();
            const { MOCK_AUDIT_LOGS } = await import('@/lib/admin/audit-data');

            let data = [...MOCK_AUDIT_LOGS] as unknown as AuditLog[];
            data = applySearch(data, params?.search, ['userName', 'resourceName', 'details']);
            data = applySort(data, params?.sortBy || 'timestamp', params?.sortOrder || 'desc');

            return paginate(data, params);
        },
    },

    // ============================================
    // DASHBOARD
    // ============================================
    dashboard: {
        async metrics() {
            await delay();
            const { MOCK_METRICS } = await import('@/lib/admin/mock-data');
            return { success: true, data: MOCK_METRICS as unknown as DashboardMetrics };
        },
    },

    // ============================================
    // SUPPORT
    // ============================================
    support: {
        async list(params) {
            await delay();
            const { MOCK_TICKETS } = await import('@/lib/admin/support-data');

            let data = [...MOCK_TICKETS] as unknown as SupportTicket[];
            data = applySearch(data, params?.search, ['subject', 'hotelName']);

            if (params?.filters?.status) {
                data = data.filter(t => t.status === params.filters!.status);
            }
            if (params?.filters?.priority) {
                data = data.filter(t => t.priority === params.filters!.priority);
            }

            data = applySort(data, params?.sortBy, params?.sortOrder);
            return paginate(data, params);
        },

        async get(id) {
            await delay();
            const { MOCK_TICKETS } = await import('@/lib/admin/support-data');
            const ticket = (MOCK_TICKETS as unknown as SupportTicket[]).find(t => t.id === id);
            return {
                success: !!ticket,
                data: ticket!,
                error: ticket ? undefined : 'Ticket not found',
            };
        },

        async updateStatus(id, status) {
            await delay(500);
            return { success: true, data: { id, status } as SupportTicket };
        },

        async assign(id, userId) {
            await delay(500);
            return { success: true, data: { id, assigneeId: userId } as SupportTicket };
        },
    },

    // ============================================
    // AUTH
    // ============================================
    auth: {
        async login(email, password) {
            await delay(800);
            const mockUser: User = {
                id: 'user-1',
                email,
                name: 'Admin User',
                role: 'super_admin',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return { success: true, data: { token: 'mock-jwt-token', user: mockUser } };
        },

        async logout() {
            await delay(200);
            return { success: true, data: undefined };
        },

        async me() {
            await delay();
            return { success: false, data: null as unknown as User, error: 'Not authenticated' };
        },
    },
};
