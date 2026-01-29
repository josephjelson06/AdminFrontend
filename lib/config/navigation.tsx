/**
 * Navigation Configuration
 * 
 * Centralized navigation items for the sidebar.
 * Extracted from Sidebar component to support OCP.
 */

import type { ReactNode } from 'react';

// UserRole type inline to avoid import issues
export type UserRole = 'super_admin' | 'admin' | 'support' | 'viewer';

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: ReactNode;
    badge?: string;
    roles?: UserRole[];
    children?: NavItem[];
}

export interface NavSection {
    id: string;
    title?: string;
    items: NavItem[];
}

// SVG Icon components (inline for simplicity)
const icons = {
    dashboard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    hotels: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9h1" />
            <path d="M9 13h1" />
            <path d="M9 17h1" />
        </svg>
    ),
    users: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    subscriptions: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 4H3" />
            <path d="M21 8H3" />
            <path d="M21 12H3" />
            <path d="M21 16H3" />
            <path d="M21 20H3" />
        </svg>
    ),
    invoices: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    kiosks: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
        </svg>
    ),
    roles: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    audit: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
        </svg>
    ),
    support: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12" y2="17" />
        </svg>
    ),
    settings: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
    finance: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    ),
    reports: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
        </svg>
    ),
};

// Admin Panel Navigation
export const adminNavSections: NavSection[] = [
    {
        id: 'main',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                href: '/dashboard',
                icon: icons.dashboard,
            },
            {
                id: 'hotels',
                label: 'Hotels',
                href: '/hotels',
                icon: icons.hotels,
            },
            {
                id: 'subscriptions',
                label: 'Subscriptions',
                href: '/subscriptions',
                icon: icons.subscriptions,
            },
            {
                id: 'invoices',
                label: 'Invoices',
                href: '/invoices',
                icon: icons.invoices,
            },
        ],
    },
    {
        id: 'fleet',
        title: 'Fleet Management',
        items: [
            {
                id: 'kiosks',
                label: 'Kiosks',
                href: '/fleet/kiosks',
                icon: icons.kiosks,
            },
        ],
    },
    {
        id: 'access',
        title: 'Access Control',
        items: [
            {
                id: 'users',
                label: 'Users',
                href: '/users',
                icon: icons.users,
                roles: ['super_admin', 'admin'],
            },
            {
                id: 'roles',
                label: 'Roles & Permissions',
                href: '/roles',
                icon: icons.roles,
                roles: ['super_admin'],
            },
            {
                id: 'audit',
                label: 'Audit Logs',
                href: '/audit',
                icon: icons.audit,
                roles: ['super_admin', 'admin'],
            },
        ],
    },
    {
        id: 'operations',
        title: 'Operations',
        items: [
            {
                id: 'support',
                label: 'Support',
                href: '/support',
                icon: icons.support,
            },
            {
                id: 'finance',
                label: 'Finance',
                href: '/finance',
                icon: icons.finance,
                roles: ['super_admin'],
            },
            {
                id: 'reports',
                label: 'Reports',
                href: '/reports',
                icon: icons.reports,
            },
        ],
    },
    {
        id: 'settings',
        items: [
            {
                id: 'settings',
                label: 'Settings',
                href: '/settings',
                icon: icons.settings,
            },
        ],
    },
];

// Hotel Panel Navigation (for hotel-specific views)
export const hotelNavSections: NavSection[] = [
    {
        id: 'main',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                href: '/hotel/dashboard',
                icon: icons.dashboard,
            },
            {
                id: 'rooms',
                label: 'Rooms',
                href: '/hotel/rooms',
                icon: icons.hotels,
            },
            {
                id: 'guests',
                label: 'Guests',
                href: '/hotel/guests',
                icon: icons.users,
            },
            {
                id: 'kiosk',
                label: 'Kiosk',
                href: '/hotel/kiosk',
                icon: icons.kiosks,
            },
            {
                id: 'billing',
                label: 'Billing',
                href: '/hotel/billing',
                icon: icons.invoices,
            },
            {
                id: 'team',
                label: 'Team',
                href: '/hotel/team',
                icon: icons.users,
            },
        ],
    },
    {
        id: 'settings',
        items: [
            {
                id: 'settings',
                label: 'Settings',
                href: '/hotel/settings',
                icon: icons.settings,
            },
        ],
    },
];

/**
 * Filter navigation items by user role
 */
export function filterNavByRole(
    sections: NavSection[],
    userRole: UserRole
): NavSection[] {
    return sections.map(section => ({
        ...section,
        items: section.items.filter(item => {
            if (!item.roles) return true;
            return item.roles.includes(userRole);
        }),
    })).filter(section => section.items.length > 0);
}
