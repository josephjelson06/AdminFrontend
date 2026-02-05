'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// Page ID to Module mapping for permission checks
export const PAGE_PERMISSIONS: Record<string, { module: string; action?: string }> = {
    'hotels': { module: 'hotels' },
    'fleet': { module: 'fleet' },
    'reports': { module: 'reports' },
    'invoices': { module: 'invoices' },
    'plans': { module: 'plans' },
    'subscriptions': { module: 'subscriptions' },
    'finance': { module: 'finance' },
    'users': { module: 'users' },
    'roles': { module: 'roles' },
    'audit': { module: 'reports' },
    'settings': { module: 'settings' },
    'guests': { module: 'guests' },
    'rooms': { module: 'rooms' },
    'housekeeping': { module: 'housekeeping' },
    'billing': { module: 'invoices' },
    'maintenance': { module: 'maintenance' },
};

// User Interface matching API response + frontend needs
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    hotelId?: number;
    hotelName?: string;
    panelType: 'admin' | 'hotel';
    permissions: Record<string, Record<string, boolean>>;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasPermission: (module: string, action: string) => boolean;
    canAccessPage: (pageId: string) => boolean;
    isHotelUser: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('atc_token');
        localStorage.removeItem('atc_user');
        router.push('/login');
    }, [router]);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('atc_token') : null;
        if (token) {
            // Validate token and get fresh user data on load
            fetchUserData(token).catch(() => {
                logout();
            });
        } else {
            setIsLoading(false);
        }
    }, [logout]);

    const fetchUserData = async (token: string) => {
        try {
            const apiUser = await api.auth.me(token);
            
            const mappedUser: User = {
                id: apiUser.id.toString(),
                name: apiUser.full_name || apiUser.email.split('@')[0],
                email: apiUser.email,
                role: apiUser.role_ref?.name || apiUser.role,
                hotelId: apiUser.hotel_id,
                hotelName: apiUser.hotel?.name || 'My Hotel',
                panelType: apiUser.is_platform_user ? 'admin' : 'hotel',
                permissions: apiUser.role_ref?.permissions || {},
            };
            
            setUser(mappedUser);
            // Also update localStorage for immediate access in non-react contexts if needed,
            // though keeping it in state is safer.
            localStorage.setItem('atc_user', JSON.stringify(mappedUser));
        } catch (error) {
            console.error('Failed to fetch user data', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const { access_token } = await api.auth.login(email, password);
            localStorage.setItem('atc_token', access_token);
            await fetchUserData(access_token);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };



    const hasPermission = (module: string, action: string = 'view'): boolean => {
        if (!user) return false;
        
        // SuperAdmin bypass (check role name or if permissions object is empty but it's superadmin)
        if (user.role === 'SuperAdmin' || user.role === 'SUPER_ADMIN') return true;

        const modulePerms = user.permissions[module];
        if (!modulePerms) return false;
        
        return !!modulePerms[action];
    };

    const canAccessPage = (pageId: string): boolean => {
        if (!user) return false;

        const mapping = PAGE_PERMISSIONS[pageId];
        
        // If page not mapped (e.g. profile, help), allow access by default if logged in
        if (!mapping) return true;

        return hasPermission(mapping.module, mapping.action || 'view');
    };

    const isHotelUser = user?.panelType === 'hotel';

    const refreshUser = async () => {
        const token = localStorage.getItem('atc_token');
        if (token) {
            await fetchUserData(token);
        }
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
                isHotelUser,
                refreshUser,
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
