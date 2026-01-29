/**
 * API Adapter Type Definitions
 * 
 * Core types for the API adapter pattern. These types define the contract
 * between UI components and data fetching, enabling mock/real backend swap.
 */

// ============================================
// GENERIC API TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
    };
}

export interface QueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, string | string[]>;
}

export interface ApiError {
    message: string;
    code: string;
    status: number;
}

// ============================================
// DOMAIN TYPES - HOTEL
// ============================================

export type HotelStatus = 'active' | 'inactive' | 'pending';
export type HotelPlan = 'basic' | 'standard' | 'premium' | 'enterprise';

export interface Hotel {
    id: string;
    name: string;
    location: string;
    address: string;
    city: string;
    country: string;
    rating?: number;
    roomCount: number;
    status: HotelStatus;
    plan: HotelPlan;
    contactEmail: string;
    contactPhone: string;
    logo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateHotelDTO {
    name: string;
    location: string;
    address: string;
    city: string;
    country: string;
    roomCount: number;
    plan: HotelPlan;
    contactEmail: string;
    contactPhone: string;
}

export type UpdateHotelDTO = Partial<CreateHotelDTO> & { status?: HotelStatus };

// ============================================
// DOMAIN TYPES - USER
// ============================================

export type UserStatus = 'active' | 'inactive' | 'suspended';
export type UserRole = 'super_admin' | 'admin' | 'support' | 'viewer';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    hotelId?: string;
    hotelName?: string;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDTO {
    email: string;
    name: string;
    role: UserRole;
    hotelId?: string;
}

// ============================================
// DOMAIN TYPES - SUBSCRIPTION
// ============================================

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export interface Subscription {
    id: string;
    hotelId: string;
    hotelName: string;
    plan: HotelPlan;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
    renewalDate: string;
    amount: number;
    currency: string;
    autoRenew: boolean;
}

// ============================================
// DOMAIN TYPES - INVOICE
// ============================================

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    hotelId: string;
    hotelName: string;
    subscriptionId: string;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    paidDate?: string;
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    paymentMethod?: string;
}

// ============================================
// DOMAIN TYPES - KIOSK
// ============================================

export type KioskStatus = 'online' | 'offline' | 'maintenance' | 'unassigned';

export interface Kiosk {
    id: string;
    serialNumber: string;
    model: string;
    firmwareVersion: string;
    status: KioskStatus;
    assignedHotelId?: string;
    assignedHotelName?: string;
    lastPingAt?: string;
    location?: string;
    createdAt: string;
}

// ============================================
// DOMAIN TYPES - AUDIT LOG
// ============================================

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'export';
export type AuditResource = 'hotel' | 'user' | 'subscription' | 'invoice' | 'kiosk' | 'role';

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: AuditAction;
    resource: AuditResource;
    resourceId: string;
    resourceName: string;
    details: string;
    ipAddress: string;
    timestamp: string;
}

// ============================================
// DOMAIN TYPES - ROLE & PERMISSION
// ============================================

export interface Permission {
    moduleId: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
    userCount: number;
    isSystem: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardMetrics {
    totalHotels: number;
    activeHotels: number;
    totalKiosks: number;
    onlineKiosks: number;
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    pendingTickets: number;
}

// ============================================
// SUPPORT TYPES
// ============================================

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    hotelId: string;
    hotelName: string;
    assigneeId?: string;
    assigneeName?: string;
    createdAt: string;
    updatedAt: string;
}
