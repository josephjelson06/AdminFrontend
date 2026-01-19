// RBAC Data Layer for User & Role Management (Redesigned)

// ============================================
// TYPES
// ============================================

export interface ModulePermission {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}

export interface RoleDefinition {
    id: string;
    name: string;
    description: string;
    userCount: number;
    permissions: Record<string, ModulePermission>;
    createdAt: string;
    updatedAt: string;
}

export interface SystemUser {
    id: string;
    username: string;
    email: string;
    phone?: string;
    roleId: string;
    status: 'active' | 'invited' | 'inactive';
    lastLogin?: string;
    createdAt: string;
}

// ============================================
// PERMISSION MODULES (Based on Sidebar)
// ============================================

export interface PermissionModule {
    id: string;
    name: string;
    description: string;
    defaultPermissions: ModulePermission;
}

export interface PermissionCategory {
    id: string;
    name: string;
    modules: PermissionModule[];
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
    {
        id: 'operations',
        name: 'Operations',
        modules: [
            {
                id: 'dashboard',
                name: 'Dashboard',
                description: 'System overview and metrics',
                defaultPermissions: { view: true, add: false, edit: false, delete: false },
            },
            {
                id: 'hotels',
                name: 'Hotels',
                description: 'Hotel registry and management',
                defaultPermissions: { view: true, add: true, edit: true, delete: true },
            },
            {
                id: 'fleet',
                name: 'Kiosk Fleet',
                description: 'Hardware monitoring and control',
                defaultPermissions: { view: true, add: true, edit: true, delete: true },
            },
        ],
    },
    {
        id: 'finance',
        name: 'Business & Finance',
        modules: [
            {
                id: 'subscriptions',
                name: 'Subscriptions',
                description: 'Revenue and billing management',
                defaultPermissions: { view: true, add: true, edit: true, delete: false },
            },
            {
                id: 'invoices',
                name: 'Invoicing',
                description: 'Invoice generation and tracking',
                defaultPermissions: { view: true, add: true, edit: true, delete: false },
            },
            {
                id: 'reports',
                name: 'Reports',
                description: 'Analytics and data exports',
                defaultPermissions: { view: true, add: false, edit: false, delete: false },
            },
        ],
    },
    {
        id: 'administration',
        name: 'Administration',
        modules: [
            {
                id: 'users',
                name: 'Team & Users',
                description: 'User account management',
                defaultPermissions: { view: true, add: true, edit: true, delete: true },
            },
            {
                id: 'roles',
                name: 'Roles & Access',
                description: 'Permission and role management',
                defaultPermissions: { view: true, add: true, edit: true, delete: true },
            },
            {
                id: 'audit',
                name: 'Audit Logs',
                description: 'System activity tracking',
                defaultPermissions: { view: true, add: false, edit: false, delete: false },
            },
            {
                id: 'settings',
                name: 'Settings',
                description: 'System configuration',
                defaultPermissions: { view: true, add: false, edit: true, delete: false },
            },
        ],
    },
];

// Get all module IDs
export const ALL_MODULE_IDS = PERMISSION_CATEGORIES.flatMap(cat => cat.modules.map(m => m.id));

// Create full permissions (all true)
export function createFullPermissions(): Record<string, ModulePermission> {
    const permissions: Record<string, ModulePermission> = {};
    PERMISSION_CATEGORIES.forEach(cat => {
        cat.modules.forEach(mod => {
            permissions[mod.id] = { view: true, add: true, edit: true, delete: true };
        });
    });
    return permissions;
}

// Create empty permissions (all false)
export function createEmptyPermissions(): Record<string, ModulePermission> {
    const permissions: Record<string, ModulePermission> = {};
    PERMISSION_CATEGORIES.forEach(cat => {
        cat.modules.forEach(mod => {
            permissions[mod.id] = { view: false, add: false, edit: false, delete: false };
        });
    });
    return permissions;
}

// ============================================
// MOCK ROLES
// ============================================

export const MOCK_ROLES: RoleDefinition[] = [
    {
        id: 'role-001',
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        userCount: 2,
        permissions: createFullPermissions(),
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
    },
    {
        id: 'role-002',
        name: 'Operations Manager',
        description: 'Manage hotels and kiosks, no financial access',
        userCount: 5,
        permissions: {
            dashboard: { view: true, add: false, edit: false, delete: false },
            hotels: { view: true, add: true, edit: true, delete: false },
            fleet: { view: true, add: true, edit: true, delete: false },
            subscriptions: { view: false, add: false, edit: false, delete: false },
            invoices: { view: false, add: false, edit: false, delete: false },
            reports: { view: true, add: false, edit: false, delete: false },
            users: { view: false, add: false, edit: false, delete: false },
            roles: { view: false, add: false, edit: false, delete: false },
            audit: { view: true, add: false, edit: false, delete: false },
            settings: { view: false, add: false, edit: false, delete: false },
        },
        createdAt: '2024-02-10',
        updatedAt: '2024-03-15',
    },
    {
        id: 'role-003',
        name: 'Finance',
        description: 'Manage billing and invoices, read-only on operations',
        userCount: 3,
        permissions: {
            dashboard: { view: true, add: false, edit: false, delete: false },
            hotels: { view: true, add: false, edit: false, delete: false },
            fleet: { view: true, add: false, edit: false, delete: false },
            subscriptions: { view: true, add: true, edit: true, delete: false },
            invoices: { view: true, add: true, edit: true, delete: false },
            reports: { view: true, add: false, edit: false, delete: false },
            users: { view: false, add: false, edit: false, delete: false },
            roles: { view: false, add: false, edit: false, delete: false },
            audit: { view: true, add: false, edit: false, delete: false },
            settings: { view: false, add: false, edit: false, delete: false },
        },
        createdAt: '2024-02-20',
        updatedAt: '2024-02-20',
    },
    {
        id: 'role-004',
        name: 'Support Agent',
        description: 'View-only access for troubleshooting',
        userCount: 6,
        permissions: {
            dashboard: { view: true, add: false, edit: false, delete: false },
            hotels: { view: true, add: false, edit: false, delete: false },
            fleet: { view: true, add: false, edit: false, delete: false },
            subscriptions: { view: false, add: false, edit: false, delete: false },
            invoices: { view: false, add: false, edit: false, delete: false },
            reports: { view: true, add: false, edit: false, delete: false },
            users: { view: false, add: false, edit: false, delete: false },
            roles: { view: false, add: false, edit: false, delete: false },
            audit: { view: true, add: false, edit: false, delete: false },
            settings: { view: false, add: false, edit: false, delete: false },
        },
        createdAt: '2024-03-05',
        updatedAt: '2024-03-05',
    },
];

// ============================================
// MOCK USERS
// ============================================

export const MOCK_USERS: SystemUser[] = [
    {
        id: 'user-001',
        username: 'Admin User',
        email: 'admin@atc.in',
        phone: '+91 98765 43210',
        roleId: 'role-001',
        status: 'active',
        lastLogin: '2 hours ago',
        createdAt: '2024-01-15',
    },
    {
        id: 'user-002',
        username: 'Priya Menon',
        email: 'priya.menon@atc.in',
        phone: '+91 98765 43211',
        roleId: 'role-002',
        status: 'active',
        lastLogin: '5 mins ago',
        createdAt: '2024-03-10',
    },
    {
        id: 'user-003',
        username: 'Amit Patel',
        email: 'amit.patel@atc.in',
        phone: '+91 98765 43212',
        roleId: 'role-003',
        status: 'active',
        lastLogin: '1 day ago',
        createdAt: '2024-02-20',
    },
    {
        id: 'user-004',
        username: 'Rahul Sharma',
        email: 'rahul.sharma@atc.in',
        roleId: 'role-002',
        status: 'active',
        lastLogin: '3 hours ago',
        createdAt: '2024-04-05',
    },
    {
        id: 'user-005',
        username: 'Sneha Gupta',
        email: 'sneha.gupta@atc.in',
        roleId: 'role-004',
        status: 'invited',
        createdAt: '2024-05-15',
    },
    {
        id: 'user-006',
        username: 'Vikram Singh',
        email: 'vikram.singh@atc.in',
        roleId: 'role-002',
        status: 'active',
        lastLogin: '30 mins ago',
        createdAt: '2024-03-22',
    },
    {
        id: 'user-007',
        username: 'Kavitha Iyer',
        email: 'kavitha.iyer@atc.in',
        roleId: 'role-003',
        status: 'active',
        lastLogin: '6 hours ago',
        createdAt: '2024-02-28',
    },
    {
        id: 'user-008',
        username: 'Arjun Reddy',
        email: 'arjun.reddy@atc.in',
        roleId: 'role-004',
        status: 'active',
        lastLogin: '2 days ago',
        createdAt: '2024-04-10',
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getRoleById(roleId: string): RoleDefinition | undefined {
    return MOCK_ROLES.find(r => r.id === roleId);
}

export function getRoleName(roleId: string): string {
    return getRoleById(roleId)?.name || 'Unknown';
}

export function getUsersByRole(roleId: string): SystemUser[] {
    return MOCK_USERS.filter(u => u.roleId === roleId);
}

// ============================================
// HOTEL ROLES (For Hotel Panel)
// ============================================

export interface HotelPageAccess {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

export interface HotelRoleDefinition {
    id: string;
    name: string;
    description: string;
    color: string;
    userCount: number;
    pageAccess: HotelPageAccess[];
    isSystemRole: boolean; // Cannot be deleted
    createdAt: string;
    updatedAt: string;
}

export const HOTEL_PAGES = [
    { id: 'dashboard', name: 'Dashboard', description: 'Kiosk health and activity overview' },
    { id: 'guests', name: 'Guest Log', description: 'Check-in history and guest records' },
    { id: 'rooms', name: 'Room Status', description: 'Housekeeping and room management' },
    { id: 'kiosk', name: 'Kiosk Settings', description: 'Kiosk configuration and branding' },
    { id: 'settings', name: 'My Hotel', description: 'Hotel profile and contact info' },
    { id: 'team', name: 'Team Access', description: 'Staff accounts and permissions' },
    { id: 'billing', name: 'Billing', description: 'Subscription and invoices' },
    { id: 'help', name: 'Help & Support', description: 'FAQs and support contact' },
];

export const MOCK_HOTEL_ROLES: HotelRoleDefinition[] = [
    {
        id: 'hotel-role-001',
        name: 'Hotel Manager',
        description: 'Full access to all hotel panel features',
        color: 'indigo',
        userCount: 12,
        pageAccess: HOTEL_PAGES.map(page => ({ ...page, enabled: true })),
        isSystemRole: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
    },
    {
        id: 'hotel-role-002',
        name: 'Front Desk',
        description: 'Guest check-in operations and room assignments',
        color: 'blue',
        userCount: 45,
        pageAccess: HOTEL_PAGES.map(page => ({
            ...page,
            enabled: ['dashboard', 'guests', 'rooms', 'help'].includes(page.id),
        })),
        isSystemRole: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-02-10',
    },
    {
        id: 'hotel-role-003',
        name: 'Housekeeping',
        description: 'Room status updates only',
        color: 'amber',
        userCount: 78,
        pageAccess: HOTEL_PAGES.map(page => ({
            ...page,
            enabled: ['rooms', 'help'].includes(page.id),
        })),
        isSystemRole: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
    },
    {
        id: 'hotel-role-004',
        name: 'Hotel Finance',
        description: 'Billing and subscription management',
        color: 'emerald',
        userCount: 8,
        pageAccess: HOTEL_PAGES.map(page => ({
            ...page,
            enabled: ['dashboard', 'billing', 'help'].includes(page.id),
        })),
        isSystemRole: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
    },
];

export function getHotelRoleById(roleId: string): HotelRoleDefinition | undefined {
    return MOCK_HOTEL_ROLES.find(r => r.id === roleId);
}

