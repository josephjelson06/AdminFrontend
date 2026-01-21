'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HotelIndexPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to hotel dashboard
        router.replace('/hotel/dashboard');
    }, [router]);

    // Loading state while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
    );
}
