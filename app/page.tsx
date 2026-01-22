'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/shared/auth';

export default function RootPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.replace('/login');
            } else {
                // All users go to admin dashboard
                router.replace('/dashboard');
            }
        }
    }, [isLoading, isAuthenticated, router]);

    // Loading state while checking auth
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
        </div>
    );
}
