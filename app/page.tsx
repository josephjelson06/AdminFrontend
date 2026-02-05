'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, isHotelUser } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (isHotelUser) {
                // Hotel users go to hotel dashboard
                router.push('/hotel');
            } else {
                // Admin users go to admin dashboard
                router.push('/dashboard');
            }
        }
    }, [isLoading, isAuthenticated, isHotelUser, router]);

    // Show loading while determining redirect
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
            </div>
        </div>
    );
}
