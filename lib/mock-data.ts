import { Hotel, Kiosk, DashboardMetrics } from '@/types/schema';

export const MOCK_METRICS: DashboardMetrics = {
    totalHotels: 42,
    activeKiosks: 115,
    totalRevenue: 1250000,
    criticalAlerts: 3,
};

export const MOCK_HOTELS: Hotel[] = [
    {
        id: 'h-001',
        name: 'Royal Orchid Bangalore',
        location: 'Bangalore, KA',
        status: 'active',
        plan: 'advanced',
        kioskCount: 4,
        mrr: 50000,
        contractRenewalDate: '2025-12-01',
        contactEmail: 'ops@royalorchid.com',
    },
    {
        id: 'h-002',
        name: 'Lemon Tree Premier',
        location: 'Mumbai, MH',
        status: 'suspended',
        plan: 'standard',
        kioskCount: 2,
        mrr: 25000,
        contractRenewalDate: '2024-03-01',
        contactEmail: 'manager@lemontree.com',
    },
    {
        id: 'h-003',
        name: 'Ginger Hotel, Panjim',
        location: 'Goa',
        status: 'active',
        plan: 'standard',
        kioskCount: 1,
        mrr: 15000,
        contractRenewalDate: '2024-08-15',
        contactEmail: 'gm-goa@ginger.com',
    },
    {
        id: 'h-004',
        name: 'Sayaji Hotel',
        location: 'Indore, MP',
        status: 'onboarding',
        plan: 'advanced',
        kioskCount: 0,
        mrr: 0,
        contractRenewalDate: '2025-01-01',
        contactEmail: 'projects@sayaji.com',
    },
];

export const MOCK_KIOSKS: Kiosk[] = [
    {
        id: 'k-101',
        serialNumber: 'ATC-SN-9988',
        model: 'Kiosk-V2-Voice',
        assignedHotelId: 'h-001',
        assignedHotelName: 'Royal Orchid Bangalore',
        firmwareVersion: 'v2.4.1',
        status: 'online',
        lastHeartbeat: '2026-01-19T06:00:00Z',
    },
    {
        id: 'k-102',
        serialNumber: 'ATC-SN-7766',
        model: 'Kiosk-V1',
        assignedHotelId: 'h-002',
        assignedHotelName: 'Lemon Tree Premier',
        firmwareVersion: 'v1.0.0',
        status: 'offline',
        lastHeartbeat: '2023-12-01T09:00:00Z', // Old date = Offline
    },
    {
        id: 'k-103',
        serialNumber: 'ATC-SN-5544',
        model: 'Kiosk-V2-Voice',
        assignedHotelId: null,
        assignedHotelName: 'Inventory',
        firmwareVersion: 'v2.5.0',
        status: 'online',
        lastHeartbeat: '2026-01-19T06:00:00Z',
    },
];