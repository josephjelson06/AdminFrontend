'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Routes that don't need authentication
const PUBLIC_ROUTES = ['/login'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Sync collapsed state with localStorage (shared with Sidebar)
    useEffect(() => {
        const checkCollapsed = () => {
            const saved = localStorage.getItem('sidebar-collapsed');
            setSidebarCollapsed(saved === 'true');
        };

        checkCollapsed();

        // Listen for storage changes (in case sidebar updates)
        const handleStorage = () => checkCollapsed();
        window.addEventListener('storage', handleStorage);

        // Also poll for changes since storage event doesn't fire in same tab
        const interval = setInterval(checkCollapsed, 300);

        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

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

    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <ProtectedRoute>
                        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                        <Header onMenuClick={() => setSidebarOpen(true)} sidebarCollapsed={sidebarCollapsed} />
                        <main className={`mt-14 min-h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950 transition-all duration-200 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
                            {children}
                        </main>
                    </ProtectedRoute>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

