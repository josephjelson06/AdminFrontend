'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'super_admin' | 'operations' | 'finance' | 'support';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    canAccessPage: (pageId: string) => boolean;
}

// Page permissions mapped to roles
// Each role can access specific pages
const ROLE_PAGE_ACCESS: Record<UserRole, string[]> = {
    super_admin: ['*'], // All pages
    operations: [
        'dashboard',
        'hotels',
        'fleet',
        'reports',
        'audit',
        'settings',
        'profile',
    ],
    finance: [
        'dashboard',
        'hotels', // view only
        'finance',
        'invoices',
        'reports',
        'profile',
    ],
    support: [
        'dashboard',
        'hotels', // view only
        'fleet', // view only
        'reports',
        'profile',
    ],
};

// Role permissions for actions (view, add, edit, delete)
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    super_admin: ['*'], // All permissions
    operations: ['hotels', 'fleet', 'reports', 'audit'],
    finance: ['finance', 'invoices', 'reports'],
    support: ['hotels.view', 'fleet.view', 'reports.view'],
};

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
    'admin@atc.in': {
        password: 'admin123',
        user: {
            id: 'u-001',
            name: 'Admin User',
            email: 'admin@atc.in',
            role: 'super_admin',
        },
    },
    'ops@atc.in': {
        password: 'ops123',
        user: {
            id: 'u-002',
            name: 'Priya Menon',
            email: 'ops@atc.in',
            role: 'operations',
        },
    },
    'finance@atc.in': {
        password: 'finance123',
        user: {
            id: 'u-003',
            name: 'Amit Patel',
            email: 'finance@atc.in',
            role: 'finance',
        },
    },
    'support@atc.in': {
        password: 'support123',
        user: {
            id: 'u-004',
            name: 'Sneha Gupta',
            email: 'support@atc.in',
            role: 'support',
        },
    },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('atc_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('atc_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockUser = MOCK_USERS[email.toLowerCase()];
        if (mockUser && mockUser.password === password) {
            setUser(mockUser.user);
            localStorage.setItem('atc_user', JSON.stringify(mockUser.user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('atc_user');
        router.push('/login');
    };

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        const permissions = ROLE_PERMISSIONS[user.role];
        return permissions.includes('*') || permissions.includes(permission);
    };

    const canAccessPage = (pageId: string): boolean => {
        if (!user) return false;
        const pages = ROLE_PAGE_ACCESS[user.role];
        return pages.includes('*') || pages.includes(pageId);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                hasPermission,
                canAccessPage,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Export for sidebar usage
export { ROLE_PAGE_ACCESS };
