/**
 * API Adapter Factory
 * 
 * Returns the appropriate API adapter based on environment configuration.
 * Currently returns mock adapter; later will support real HTTP adapter.
 */

import type { ApiAdapter } from './adapter';
import { mockAdapter } from './mockAdapter';

// Environment flag to switch between mock and real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// Singleton instance
let apiInstance: ApiAdapter | null = null;

/**
 * Get the API adapter instance.
 * Uses mock adapter in development, real adapter in production.
 */
export function getApiAdapter(): ApiAdapter {
    if (!apiInstance) {
        if (USE_MOCK) {
            apiInstance = mockAdapter;
        } else {
            // TODO: Import and use httpAdapter when backend is ready
            // import { httpAdapter } from './httpAdapter';
            // apiInstance = httpAdapter;
            console.warn('[API] Real HTTP adapter not implemented yet, using mock');
            apiInstance = mockAdapter;
        }
    }
    return apiInstance;
}

/**
 * Get API instance (alias for convenience)
 */
export const api = new Proxy({} as ApiAdapter, {
    get(_, prop) {
        return getApiAdapter()[prop as keyof ApiAdapter];
    },
});

// Re-export types for convenience
export type {
    ApiResponse,
    PaginatedResponse,
    QueryParams,
    ApiError,
    Hotel,
    HotelStatus,
    HotelPlan,
    CreateHotelDTO,
    UpdateHotelDTO,
    User,
    UserStatus,
    UserRole,
    CreateUserDTO,
    Subscription,
    SubscriptionStatus,
    Invoice,
    InvoiceStatus,
    Kiosk,
    KioskStatus,
    AuditLog,
    AuditAction,
    AuditResource,
    Permission,
    Role,
    DashboardMetrics,
    SupportTicket,
    TicketStatus,
    TicketPriority,
} from './types';
export type { ApiAdapter } from './adapter';
