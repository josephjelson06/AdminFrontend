/**
 * API Adapter Interface
 * 
 * Defines the contract for data fetching. Both mock and real implementations
 * must conform to this interface, enabling seamless switching.
 */

import type {
    ApiResponse,
    PaginatedResponse,
    QueryParams,
    Hotel,
    CreateHotelDTO,
    UpdateHotelDTO,
    User,
    CreateUserDTO,
    Subscription,
    Invoice,
    Kiosk,
    AuditLog,
    Role,
    DashboardMetrics,
    SupportTicket,
} from './types';

export interface ApiAdapter {
    // Hotels
    hotels: {
        list(params?: QueryParams): Promise<PaginatedResponse<Hotel>>;
        get(id: string): Promise<ApiResponse<Hotel>>;
        create(data: CreateHotelDTO): Promise<ApiResponse<Hotel>>;
        update(id: string, data: UpdateHotelDTO): Promise<ApiResponse<Hotel>>;
        delete(id: string): Promise<ApiResponse<void>>;
    };

    // Users
    users: {
        list(params?: QueryParams): Promise<PaginatedResponse<User>>;
        get(id: string): Promise<ApiResponse<User>>;
        create(data: CreateUserDTO): Promise<ApiResponse<User>>;
        update(id: string, data: Partial<User>): Promise<ApiResponse<User>>;
        delete(id: string): Promise<ApiResponse<void>>;
        invite(email: string, roleId: string): Promise<ApiResponse<void>>;
    };

    // Subscriptions
    subscriptions: {
        list(params?: QueryParams): Promise<PaginatedResponse<Subscription>>;
        get(id: string): Promise<ApiResponse<Subscription>>;
        cancel(id: string): Promise<ApiResponse<void>>;
        renew(id: string): Promise<ApiResponse<Subscription>>;
    };

    // Invoices
    invoices: {
        list(params?: QueryParams): Promise<PaginatedResponse<Invoice>>;
        get(id: string): Promise<ApiResponse<Invoice>>;
        download(id: string): Promise<Blob>;
        markAsPaid(id: string): Promise<ApiResponse<Invoice>>;
    };

    // Kiosks
    kiosks: {
        list(params?: QueryParams): Promise<PaginatedResponse<Kiosk>>;
        get(id: string): Promise<ApiResponse<Kiosk>>;
        assign(id: string, hotelId: string): Promise<ApiResponse<Kiosk>>;
        unassign(id: string): Promise<ApiResponse<Kiosk>>;
        restart(id: string): Promise<ApiResponse<void>>;
    };

    // Roles
    roles: {
        list(): Promise<ApiResponse<Role[]>>;
        get(id: string): Promise<ApiResponse<Role>>;
        create(data: Omit<Role, 'id' | 'userCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Role>>;
        update(id: string, data: Partial<Role>): Promise<ApiResponse<Role>>;
        delete(id: string): Promise<ApiResponse<void>>;
    };

    // Audit Logs
    auditLogs: {
        list(params?: QueryParams): Promise<PaginatedResponse<AuditLog>>;
    };

    // Dashboard
    dashboard: {
        metrics(): Promise<ApiResponse<DashboardMetrics>>;
    };

    // Support
    support: {
        list(params?: QueryParams): Promise<PaginatedResponse<SupportTicket>>;
        get(id: string): Promise<ApiResponse<SupportTicket>>;
        updateStatus(id: string, status: SupportTicket['status']): Promise<ApiResponse<SupportTicket>>;
        assign(id: string, userId: string): Promise<ApiResponse<SupportTicket>>;
    };

    // Auth
    auth: {
        login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>>;
        logout(): Promise<ApiResponse<void>>;
        me(): Promise<ApiResponse<User>>;
    };
}
