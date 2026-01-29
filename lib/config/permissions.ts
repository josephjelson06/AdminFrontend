/**
 * Permission Configuration
 * 
 * Centralized permission module definitions.
 * Extracted from roles page for reusability.
 */

export interface PermissionModule {
    id: string;
    name: string;
    description: string;
    actions: PermissionAction[];
}

export interface PermissionAction {
    id: 'view' | 'add' | 'edit' | 'delete';
    label: string;
    description: string;
}

// Standard CRUD actions available for most modules
export const standardActions: PermissionAction[] = [
    { id: 'view', label: 'View', description: 'Can view records' },
    { id: 'add', label: 'Add', description: 'Can create new records' },
    { id: 'edit', label: 'Edit', description: 'Can modify existing records' },
    { id: 'delete', label: 'Delete', description: 'Can remove records' },
];

// All permission modules in the system
export const permissionModules: PermissionModule[] = [
    {
        id: 'hotels',
        name: 'Hotel Management',
        description: 'Manage hotel records and details',
        actions: standardActions,
    },
    {
        id: 'subscriptions',
        name: 'Subscriptions',
        description: 'Manage subscription plans and billing',
        actions: standardActions,
    },
    {
        id: 'invoices',
        name: 'Invoices',
        description: 'View and manage invoices',
        actions: [
            { id: 'view', label: 'View', description: 'Can view invoices' },
            { id: 'add', label: 'Create', description: 'Can create invoices' },
            { id: 'edit', label: 'Edit', description: 'Can modify invoices' },
            { id: 'delete', label: 'Void', description: 'Can void invoices' },
        ],
    },
    {
        id: 'users',
        name: 'User Management',
        description: 'Manage user accounts and access',
        actions: [
            { id: 'view', label: 'View', description: 'Can view users' },
            { id: 'add', label: 'Invite', description: 'Can invite new users' },
            { id: 'edit', label: 'Edit', description: 'Can modify user roles' },
            { id: 'delete', label: 'Suspend', description: 'Can suspend users' },
        ],
    },
    {
        id: 'roles',
        name: 'Roles & Permissions',
        description: 'Manage roles and permission assignments',
        actions: standardActions,
    },
    {
        id: 'kiosks',
        name: 'Kiosk Fleet',
        description: 'Manage kiosk devices',
        actions: [
            { id: 'view', label: 'View', description: 'Can view kiosks' },
            { id: 'add', label: 'Assign', description: 'Can assign kiosks' },
            { id: 'edit', label: 'Configure', description: 'Can configure kiosks' },
            { id: 'delete', label: 'Unassign', description: 'Can unassign kiosks' },
        ],
    },
    {
        id: 'audit',
        name: 'Audit Logs',
        description: 'View system audit logs',
        actions: [
            { id: 'view', label: 'View', description: 'Can view audit logs' },
        ],
    },
    {
        id: 'support',
        name: 'Support Tickets',
        description: 'Manage support tickets',
        actions: [
            { id: 'view', label: 'View', description: 'Can view tickets' },
            { id: 'add', label: 'Create', description: 'Can create tickets' },
            { id: 'edit', label: 'Respond', description: 'Can respond to tickets' },
            { id: 'delete', label: 'Close', description: 'Can close tickets' },
        ],
    },
    {
        id: 'finance',
        name: 'Finance & Reports',
        description: 'Access financial data and reports',
        actions: [
            { id: 'view', label: 'View', description: 'Can view financial data' },
            { id: 'add', label: 'Export', description: 'Can export reports' },
        ],
    },
    {
        id: 'settings',
        name: 'System Settings',
        description: 'Manage system configuration',
        actions: [
            { id: 'view', label: 'View', description: 'Can view settings' },
            { id: 'edit', label: 'Modify', description: 'Can change settings' },
        ],
    },
];

/**
 * Get permission module by ID
 */
export function getPermissionModule(id: string): PermissionModule | undefined {
    return permissionModules.find(m => m.id === id);
}

/**
 * Check if a permission is allowed for a role
 */
export function hasPermission(
    permissions: { moduleId: string; view: boolean; add: boolean; edit: boolean; delete: boolean }[],
    moduleId: string,
    action: 'view' | 'add' | 'edit' | 'delete'
): boolean {
    const modulePermission = permissions.find(p => p.moduleId === moduleId);
    if (!modulePermission) return false;
    return modulePermission[action];
}
