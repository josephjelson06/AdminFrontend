import { HotelUserRole } from '@/lib/hotel/hotel-data';

export interface PermissionModule {
    id: string;
    label: string;
    description: string;
}

export interface RoleConfig {
    id: string;
    roleKey: HotelUserRole;
    name: string;
    description: string;
    userCount: number;
    access: string[]; // List of module IDs enabled
    isSystem: boolean; // If true, cannot delete role
}

// 1. Define what pages/features can be toggled
export const HOTEL_MODULES: PermissionModule[] = [
    { id: 'dashboard', label: 'Dashboard', description: 'View KPI cards and activity feed' },
    { id: 'guests', label: 'Guest Log', description: 'Access guest check-in history' },
    { id: 'rooms', label: 'Room Status', description: 'View and update room cleaning status' },
    { id: 'incidents', label: 'Incidents', description: 'Manage maintenance reports' },
    { id: 'kiosk', label: 'Kiosk Config', description: 'Edit kiosk settings and branding' },
    { id: 'settings', label: 'Hotel Profile', description: 'Manage hotel details and branding' },
    { id: 'team', label: 'Team Access', description: 'Add/Remove staff members' },
    { id: 'billing', label: 'Billing', description: 'View invoices and subscription' },
];

// 2. Define the initial state of Roles (Visual Dummy Data)
export const INITIAL_ROLES: RoleConfig[] = [
    {
        id: 'r-1',
        roleKey: 'hotel_manager',
        name: 'Hotel Manager',
        description: 'Full access to all hotel operations and settings.',
        userCount: 2,
        access: ['dashboard', 'guests', 'rooms', 'incidents', 'kiosk', 'settings', 'team', 'billing'],
        isSystem: true
    },
    {
        id: 'r-2',
        roleKey: 'front_desk',
        name: 'Front Desk',
        description: 'Manage guest check-ins and room assignments.',
        userCount: 4,
        access: ['dashboard', 'guests', 'rooms'],
        isSystem: true
    },
    {
        id: 'r-3',
        roleKey: 'housekeeping',
        name: 'Housekeeping',
        description: 'Update room cleaning status only.',
        userCount: 8,
        access: ['rooms'],
        isSystem: true
    },
    {
        id: 'r-4',
        roleKey: 'hotel_finance',
        name: 'Finance',
        description: 'Access billing and invoices only.',
        userCount: 1,
        access: ['dashboard', 'billing'],
        isSystem: true
    },
    {
        id: 'r-5',
        roleKey: 'maintenance_staff',
        name: 'Maintenance',
        description: 'Handle reported incidents and repairs.',
        userCount: 3,
        access: ['incidents'],
        isSystem: true
    }
];