export type Status = 'active' | 'inactive' | 'suspended' | 'pending' | 'onboarding';
export type KioskStatus = 'online' | 'offline' | 'warning';
export type HotelPlan = 'standard' | 'advanced';

// 1. HOTEL ENTITY
export interface Hotel {
    id: string;
    name: string;
    location: string; // e.g., "Mumbai, MH"
    status: Status;
    plan: HotelPlan;
    kioskCount: number;
    // Financials
    mrr: number; // Monthly Recurring Revenue
    contractRenewalDate: string;
    contactEmail: string;
}

// 2. KIOSK (HARDWARE) ENTITY
export interface Kiosk {
    id: string;
    serialNumber: string;
    model: 'Kiosk-V1' | 'Kiosk-V2-Voice';
    assignedHotelId: string | null; // Null if inventory
    assignedHotelName?: string;
    firmwareVersion: string;
    status: KioskStatus;
    lastHeartbeat: string; // ISO Date
}

// 3. DASHBOARD METRICS
export interface DashboardMetrics {
    totalHotels: number;
    activeKiosks: number;
    totalRevenue: number;
    criticalAlerts: number;
}