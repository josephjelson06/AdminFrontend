import { z } from 'zod';

// ============================================
// BASE SCHEMAS
// ============================================

export const StatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending', 'onboarding']);
export const KioskStatusSchema = z.enum(['online', 'offline', 'warning']);
export const HotelPlanSchema = z.enum(['standard', 'advanced']);

// ============================================
// HOTEL SCHEMA
// ============================================

export const HotelSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(200),
    location: z.string(),
    city: z.string(),
    state: z.string().min(2).max(2), // State codes like "MH", "KA"
    status: StatusSchema,
    plan: HotelPlanSchema,
    kioskCount: z.number().int().min(0),
    mrr: z.number().min(0),
    contractRenewalDate: z.string().datetime(), // ISO 8601
    contactEmail: z.string().email(),
    contactPhone: z.string(),
    onboardedDate: z.string().datetime(),
    lastActivity: z.string().datetime().optional(),
});

// ============================================
// KIOSK SCHEMA
// ============================================

export const KioskModelSchema = z.enum(['Kiosk-V1', 'Kiosk-V2-Voice', 'Kiosk-V3-Pro']);

export const KioskSchema = z.object({
    id: z.string().min(1),
    serialNumber: z.string().regex(/^ATC-SN-\d{4}$/),
    model: KioskModelSchema,
    assignedHotelId: z.string().nullable(),
    assignedHotelName: z.string().optional(),
    firmwareVersion: z.string(),
    status: KioskStatusSchema,
    lastHeartbeat: z.string().datetime(),
});

// ============================================
// DASHBOARD METRICS SCHEMA
// ============================================

export const DashboardMetricsSchema = z.object({
    totalHotels: z.number().int().min(0),
    activeKiosks: z.number().int().min(0),
    totalRevenue: z.number().min(0),
    criticalAlerts: z.number().int().min(0),
});

// ============================================
// DERIVED TYPES (from Zod schemas)
// ============================================

export type Status = z.infer<typeof StatusSchema>;
export type KioskStatus = z.infer<typeof KioskStatusSchema>;
export type HotelPlan = z.infer<typeof HotelPlanSchema>;
export type Hotel = z.infer<typeof HotelSchema>;
export type KioskModel = z.infer<typeof KioskModelSchema>;
export type Kiosk = z.infer<typeof KioskSchema>;
export type DashboardMetrics = z.infer<typeof DashboardMetricsSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Safely parse hotel data with Zod validation
 * Returns parsed data or null if invalid
 */
export function parseHotel(data: unknown): Hotel | null {
    const result = HotelSchema.safeParse(data);
    return result.success ? result.data : null;
}

/**
 * Safely parse kiosk data with Zod validation
 */
export function parseKiosk(data: unknown): Kiosk | null {
    const result = KioskSchema.safeParse(data);
    return result.success ? result.data : null;
}

/**
 * Parse array of hotels, filtering out invalid entries
 */
export function parseHotels(data: unknown[]): Hotel[] {
    const results: Hotel[] = [];
    for (const item of data) {
        const result = HotelSchema.safeParse(item);
        if (result.success) results.push(result.data);
    }
    return results;
}

/**
 * Parse array of kiosks, filtering out invalid entries
 */
export function parseKiosks(data: unknown[]): Kiosk[] {
    const results: Kiosk[] = [];
    for (const item of data) {
        const result = KioskSchema.safeParse(item);
        if (result.success) results.push(result.data);
    }
    return results;
}