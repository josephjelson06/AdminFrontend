'use client';

import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/shared/ui/Toast';
import { AuthProvider } from '@/lib/shared/auth';
import { ThemeProvider } from '@/lib/shared/theme';

// Routes that don't need authentication
const PUBLIC_ROUTES = ['/login'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // For Hotel Panel, all routes use their own layout (HotelLayout)
    // This wrapper just provides the global providers
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
