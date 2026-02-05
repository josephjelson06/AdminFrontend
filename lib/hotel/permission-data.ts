export type Action = 'view' | 'create' | 'edit' | 'delete' | 'export';

export interface ModuleDef {
    id: string;
    name: string;
    description: string;
    actions: Action[];
}

export const HOTEL_MODULES: ModuleDef[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'View hotel statistics and analytics',
        actions: ['view', 'export']
    },
    {
        id: 'rooms',
        name: 'Rooms',
        description: 'Manage hotel rooms and availability',
        actions: ['view', 'create', 'edit', 'delete']
    },
    {
        id: 'team',
        name: 'Team & Access',
        description: 'Manage hotel staff and roles',
        actions: ['view', 'create', 'edit', 'delete']
    },
    {
        id: 'guests',
        name: 'Guests',
        description: 'View and manage guest profiles',
        actions: ['view', 'create', 'edit', 'export']
    },
    {
        id: 'bookings',
        name: 'Bookings',
        description: 'Manage reservations and check-ins',
        actions: ['view', 'create', 'edit', 'delete', 'export']
    },
    {
        id: 'finance',
        name: 'Finance',
        description: 'View invoices and transactions',
        actions: ['view', 'export']
    },
    {
        id: 'settings',
        name: 'Hotel Settings',
        description: 'Manage hotel profile and configurations',
        actions: ['view', 'edit']
    }
];

export const DEFAULT_PERMISSIONS: Record<string, Action[]> = {};
