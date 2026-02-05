'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, hasPermission } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Check permission if required
    if (requiredPermission && !hasPermission(requiredPermission, 'view')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
                    <p className="text-slate-500 mb-4">You don&apos;t have permission to view this page.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
