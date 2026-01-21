export type Status = 'active' | 'inactive' | 'suspended' | 'pending' | 'onboarding';
export type KioskStatus = 'online' | 'offline' | 'warning';
export type HotelPlan = 'standard' | 'advanced';

// 1. HOTEL ENTITY
export interface Hotel {
    id: string;
    name: string;
    location: string; // e.g., "Mumbai, MH"
    city: string;     // Extracted city name
    state: string;    // Extracted state code
    status: Status;
    plan: HotelPlan;
    kioskCount: number;
    // Financials (displayed in Finance module, kept for data)
    mrr: number; // Monthly Recurring Revenue
    contractRenewalDate: string;
    // Contact & Registry metadata
    contactEmail: string;
    contactPhone: string;   // Phone for click-to-dial
    onboardedDate: string;  // ISO date of onboarding
    lastActivity?: string;  // Optional last activity timestamp
}

// 2. KIOSK (HARDWARE) ENTITY
export interface Kiosk {
    id: string;
    serialNumber: string;
    model: 'Kiosk-V1' | 'Kiosk-V2-Voice' | 'Kiosk-V3-Pro';
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