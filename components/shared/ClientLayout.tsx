'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/layout/Sidebar';
import { Header } from '@/components/admin/layout/Header';
import { ToastProvider } from '@/components/shared/ui/Toast';
import { AuthProvider } from '@/lib/shared/auth';
import { ThemeProvider } from '@/lib/shared/theme';
import { ProtectedRoute } from '@/components/shared/auth/ProtectedRoute';

// Routes that don't need authentication
const PUBLIC_ROUTES = ['/login'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isHotelRoute = pathname?.startsWith('/hotel');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isPublicRoute || isHotelRoute) {
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
                        <Header onMenuClick={() => setSidebarOpen(true)} />
                        <main className="lg:ml-64 mt-14 min-h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950">
                            {children}
                        </main>
                    </ProtectedRoute>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}




