export type Action = 'view' | 'create' | 'edit' | 'delete' | 'export';

export interface ModulePermissions {
    id: string;
    name: string;
    description: string;
    actions: Action[]; // Actions applicable to this module
}

export const ADMIN_MODULES: ModulePermissions[] = [
    {
        id: 'hotels',
        name: 'Hotel Registry',
        description: 'Manage hotel tenants and contracts.',
        actions: ['view', 'create', 'edit', 'delete', 'export']
    },
    {
        id: 'fleet',
        name: 'Kiosk Fleet',
        description: 'Device monitoring and remote commands.',
        actions: ['view', 'create', 'edit', 'delete'] // No export
    },
    {
        id: 'finance',
        name: 'Finance & Invoices',
        description: 'Billing, taxation and payment recording.',
        actions: ['view', 'create', 'edit', 'export'] // No delete (audit trail)
    },
    {
        id: 'users',
        name: 'Admin Users',
        description: 'Internal team access control.',
        actions: ['view', 'create', 'edit', 'delete']
    },
    {
        id: 'settings',
        name: 'System Settings',
        description: 'Global configuration and feature flags.',
        actions: ['view', 'edit']
    }
];

export interface RoleFormData {
    name: string;
    description: string;
    permissions: Record<string, Action[]>; // { 'hotels': ['view', 'edit'] }
}
