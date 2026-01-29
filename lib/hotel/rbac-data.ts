import { HotelUserRole } from '@/lib/hotel/hotel-data';

// ============================================
// BASE TYPES
// ============================================

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

// Types expected by hotel/roles/page.tsx
export interface HotelPageAccess {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

export type RoleColor = 'purple' | 'blue' | 'emerald' | 'amber' | 'slate';

export interface HotelRoleDefinition {
    id: string;
    name: string;
    description: string;
    userCount: number;
    color: RoleColor;
    isSystemRole: boolean;
    pageAccess: HotelPageAccess[];
    createdAt: string;
    updatedAt: string;
}

// ============================================
// HOTEL MODULES (Pages available for access control)
// ============================================

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

// ============================================
// ROLE STYLING
// ============================================

export const ROLE_COLOR_CLASSES: Record<RoleColor, { bg: string; text: string }> = {
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    slate: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300' },
};

export const ROLE_ICON_COLORS: Record<RoleColor, string> = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-500',
};

// ============================================
// MOCK DATA (Compatible with HotelRoleDefinition)
// ============================================

const createPageAccess = (enabledIds: string[]): HotelPageAccess[] => {
    return HOTEL_MODULES.map(module => ({
        id: module.id,
        name: module.label,
        description: module.description,
        enabled: enabledIds.includes(module.id),
    }));
};

export const MOCK_HOTEL_ROLES: HotelRoleDefinition[] = [
    {
        id: 'r-1',
        name: 'Hotel Manager',
        description: 'Full access to all hotel operations and settings.',
        userCount: 2,
        color: 'purple',
        isSystemRole: true,
        pageAccess: createPageAccess(['dashboard', 'guests', 'rooms', 'incidents', 'kiosk', 'settings', 'team', 'billing']),
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
    },
    {
        id: 'r-2',
        name: 'Front Desk',
        description: 'Manage guest check-ins and room assignments.',
        userCount: 4,
        color: 'blue',
        isSystemRole: true,
        pageAccess: createPageAccess(['dashboard', 'guests', 'rooms']),
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
    },
    {
        id: 'r-3',
        name: 'Housekeeping',
        description: 'Update room cleaning status only.',
        userCount: 8,
        color: 'emerald',
        isSystemRole: true,
        pageAccess: createPageAccess(['rooms']),
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
    },
    {
        id: 'r-4',
        name: 'Finance',
        description: 'Access billing and invoices only.',
        userCount: 1,
        color: 'amber',
        isSystemRole: true,
        pageAccess: createPageAccess(['dashboard', 'billing']),
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
    },
    {
        id: 'r-5',
        name: 'Maintenance',
        description: 'Handle reported incidents and repairs.',
        userCount: 3,
        color: 'slate',
        isSystemRole: true,
        pageAccess: createPageAccess(['incidents']),
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
    }
];

// Legacy exports for backward compatibility
export const INITIAL_ROLES: RoleConfig[] = MOCK_HOTEL_ROLES.map(role => ({
    id: role.id,
    roleKey: role.name.toLowerCase().replace(/\s+/g, '_') as HotelUserRole,
    name: role.name,
    description: role.description,
    userCount: role.userCount,
    access: role.pageAccess.filter(p => p.enabled).map(p => p.id),
    isSystem: role.isSystemRole,
}));