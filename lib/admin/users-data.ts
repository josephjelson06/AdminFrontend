export interface AdminUser {
    id: string;
    name: string;
    email: string;
    roleId: string; // Links to the Role ID
    roleName: string; // Denormalized for display
    avatar?: string;
    status: 'active' | 'invited' | 'suspended';
    lastActive: string;
    mfaEnabled: boolean;
    department: string;
}

export const MOCK_ADMIN_USERS: AdminUser[] = [
    {
        id: 'usr-001',
        name: 'Arjun Rao',
        email: 'arjun@atc.in',
        roleId: 'role-super-admin', // Assumes you have this ID
        roleName: 'Super Admin',
        status: 'active',
        lastActive: 'Just now',
        mfaEnabled: true,
        department: 'Executive'
    },
    {
        id: 'usr-002',
        name: 'Sarah Jenkins',
        email: 'sarah.j@atc.in',
        roleId: 'role-support',
        roleName: 'L1 Support',
        status: 'active',
        lastActive: '2 hours ago',
        mfaEnabled: true,
        department: 'Operations'
    },
    {
        id: 'usr-003',
        name: 'Finance Team',
        email: 'billing@atc.in',
        roleId: 'role-finance',
        roleName: 'Finance Manager',
        status: 'invited',
        lastActive: 'Never',
        mfaEnabled: false,
        department: 'Finance'
    }
];
