'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Combined user roles (ATC Admin + Hotel)
export type UserRole = 'super_admin' | 'operations' | 'finance' | 'support';
export type HotelUserRole = 'hotel_manager' | 'front_desk' | 'housekeeping' | 'hotel_finance' | 'maintenance_staff';
export type AnyUserRole = UserRole | HotelUserRole;

export interface User {
    id: string;
    name: string;
    email: string;
    role: AnyUserRole;
    avatar?: string;
    hotelId?: string; // Only for hotel users
    hotelName?: string;
    panelType: 'admin' | 'hotel';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    canAccessPage: (pageId: string) => boolean;
    isHotelUser: boolean;
}

// ATC Admin page access
const ADMIN_PAGE_ACCESS: Record<UserRole, string[]> = {
    super_admin: ['*'],
    operations: ['dashboard', 'hotels', 'fleet', 'reports', 'audit', 'settings', 'profile'],
    finance: ['dashboard', 'hotels', 'finance', 'invoices', 'reports', 'profile'],
    support: ['dashboard', 'hotels', 'fleet', 'reports', 'profile'],
};

// Hotel panel page access  
const HOTEL_PAGE_ACCESS: Record<HotelUserRole, string[]> = {
    hotel_manager: ['dashboard', 'guests', 'rooms', 'kiosk', 'settings', 'team', 'roles', 'billing', 'incidents', 'help'],
    front_desk: ['dashboard', 'guests', 'rooms', 'help'],
    housekeeping: ['rooms', 'help'],
    hotel_finance: ['dashboard', 'billing', 'help'],
    maintenance_staff: ['incidents', 'help'],
};

// Role permissions for actions
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    super_admin: ['*'],
    operations: ['hotels', 'fleet', 'reports', 'audit'],
    finance: ['finance', 'invoices', 'reports'],
    support: ['hotels.view', 'fleet.view', 'reports.view'],
};

// Mock users for demo - ATC Admin users
const MOCK_ADMIN_USERS: Record<string, { password: string; user: User }> = {
    'admin@atc.in': {
        password: 'admin123',
        user: {
            id: 'u-001',
            name: 'Admin User',
            email: 'admin@atc.in',
            role: 'super_admin',
            panelType: 'admin',
        },
    },
    'ops@atc.in': {
        password: 'ops123',
        user: {
            id: 'u-002',
            name: 'Priya Menon',
            email: 'ops@atc.in',
            role: 'operations',
            panelType: 'admin',
        },
    },
    'finance@atc.in': {
        password: 'finance123',
        user: {
            id: 'u-003',
            name: 'Amit Patel',
            email: 'finance@atc.in',
            role: 'finance',
            panelType: 'admin',
        },
    },
    'support@atc.in': {
        password: 'support123',
        user: {
            id: 'u-004',
            name: 'Sneha Gupta',
            email: 'support@atc.in',
            role: 'support',
            panelType: 'admin',
        },
    },
};

// Mock users for demo - Hotel users
const MOCK_HOTEL_USERS: Record<string, { password: string; user: User }> = {
    'manager@hotel.in': {
        password: 'manager123',
        user: {
            id: 'hu-001',
            name: 'Vikram Mehta',
            email: 'manager@hotel.in',
            role: 'hotel_manager',
            hotelId: 'hotel-001',
            hotelName: 'Grand Hyatt Mumbai',
            panelType: 'hotel',
        },
    },
    'frontdesk@hotel.in': {
        password: 'frontdesk123',
        user: {
            id: 'hu-002',
            name: 'Anita Desai',
            email: 'frontdesk@hotel.in',
            role: 'front_desk',
            hotelId: 'hotel-001',
            hotelName: 'Grand Hyatt Mumbai',
            panelType: 'hotel',
        },
    },
    'hk@hotel.in': {
        password: 'hk123',
        user: {
            id: 'hu-003',
            name: 'Ramesh Kumar',
            email: 'hk@hotel.in',
            role: 'housekeeping',
            hotelId: 'hotel-001',
            hotelName: 'Grand Hyatt Mumbai',
            panelType: 'hotel',
        },
    },
    'hotelfinance@hotel.in': {
        password: 'hotelfinance123',
        user: {
            id: 'hu-004',
            name: 'Priya Nair',
            email: 'hotelfinance@hotel.in',
            role: 'hotel_finance',
            hotelId: 'hotel-001',
            hotelName: 'Grand Hyatt Mumbai',
            panelType: 'hotel',
        },
    },
};

// Combined mock users
const ALL_MOCK_USERS = { ...MOCK_ADMIN_USERS, ...MOCK_HOTEL_USERS };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

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
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockUser = ALL_MOCK_USERS[email.toLowerCase()];
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
        if (user.panelType === 'hotel') return true; // Simplified for hotel
        const permissions = ROLE_PERMISSIONS[user.role as UserRole];
        return permissions?.includes('*') || permissions?.includes(permission);
    };

    const canAccessPage = (pageId: string): boolean => {
        if (!user) return false;

        if (user.panelType === 'hotel') {
            const pages = HOTEL_PAGE_ACCESS[user.role as HotelUserRole];
            return pages?.includes('*') || pages?.includes(pageId);
        }

        const pages = ADMIN_PAGE_ACCESS[user.role as UserRole];
        return pages?.includes('*') || pages?.includes(pageId);
    };

    const isHotelUser = user?.panelType === 'hotel';

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
                isHotelUser,
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
export { ADMIN_PAGE_ACCESS, HOTEL_PAGE_ACCESS };
