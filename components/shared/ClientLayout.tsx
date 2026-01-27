'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/layout/Sidebar';
import { Header } from '@/components/admin/layout/Header';
import { ToastProvider } from '@/components/shared/ui/Toast';
import { AuthProvider } from '@/lib/shared/auth';
import { ThemeProvider } from '@/lib/shared/theme';
import { ProtectedRoute } from '@/components/shared/auth/ProtectedRoute';

// Routes that don't need authentication
const PUBLIC_ROUTES = ['/login'];

// Admin routes that use (admin)/layout.tsx
const ADMIN_ROUTES = ['/', '/dashboard', '/hotels', '/fleet', '/plans', '/subscriptions', '/invoices', '/reports', '/users', '/roles', '/audit', '/settings', '/profile', '/support'];

// Hotel routes that use their own HotelLayout - should only get context providers
const HOTEL_ROUTES = ['/hotel'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    // Check if it's an admin route (handled by (admin)/layout.tsx)
    const isAdminRoute = ADMIN_ROUTES.some(route =>
        route === '/' ? pathname === '/' : pathname === route || pathname.startsWith(route + '/')
    );
    // Check if it's a hotel route (handled by HotelLayout)
    const isHotelRoute = HOTEL_ROUTES.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    );
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sidebar State
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [isMounted, setIsMounted] = useState(false);

    // Initial load
    useEffect(() => {
        setIsMounted(true);
        const savedCollapsed = localStorage.getItem('sidebar-collapsed');
        const savedWidth = localStorage.getItem('sidebar-width');

        if (savedCollapsed !== null) {
            setIsCollapsed(savedCollapsed === 'true');
        }
        if (savedWidth !== null) {
            setSidebarWidth(Number(savedWidth));
        }
    }, []);

    // Persist sidebar width with debounce
    useEffect(() => {
        if (!isMounted) return;
        const timer = setTimeout(() => {
            localStorage.setItem('sidebar-width', String(sidebarWidth));
        }, 500);
        return () => clearTimeout(timer);
    }, [sidebarWidth, isMounted]);

    const toggleCollapsed = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', String(newState));
    };

    if (isPublicRoute) {
        return (
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        );
    }

    // Admin routes use (admin)/layout.tsx - just provide context providers
    if (isAdminRoute) {
        return (
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        );
    }

    // Hotel routes use HotelLayout - just provide context providers
    if (isHotelRoute) {
        return (
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        );
    }

    // Default width prevention before mount (SSR match)
    const currentSidebarWidth = isMounted ? (isCollapsed ? 80 : sidebarWidth) : 256;

    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <ProtectedRoute>
                        <div
                            style={{
                                '--sidebar-width': `${currentSidebarWidth}px`
                            } as React.CSSProperties}
                        >
                            <Sidebar
                                isOpen={sidebarOpen}
                                onClose={() => setSidebarOpen(false)}
                                sidebarWidth={sidebarWidth}
                                setSidebarWidth={setSidebarWidth}
                                isCollapsed={isCollapsed}
                                toggleCollapsed={toggleCollapsed}
                            />
                            <Header
                                onMenuClick={() => setSidebarOpen(true)}
                                sidebarCollapsed={isCollapsed}
                            />
                            <main className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-950 transition-all duration-200 lg:ml-[var(--sidebar-width)]">
                                {children}
                            </main>
                        </div>
                    </ProtectedRoute>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
