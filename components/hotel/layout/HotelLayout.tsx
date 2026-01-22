'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HotelSidebar } from './HotelSidebar';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '@/lib/shared/auth';
import { useTheme } from '@/lib/shared/theme';

interface HotelLayoutProps {
    children: React.ReactNode;
}

export function HotelLayout({ children }: HotelLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated, isHotelUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isHotelUser) {
                // If admin user tries to access hotel panel, redirect to admin
                router.push('/');
            }
        }
    }, [isLoading, isAuthenticated, isHotelUser, router]);

    // Close sidebar on route change (mobile only)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated || !isHotelUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <HotelSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Main Content */}
            <div className={`
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
            `}>
                {/* Header */}
                <header className={`
                    h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 
                    fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out
                    left-0 ${isCollapsed ? 'lg:left-20' : 'lg:left-64'}
                `}>
                    <div className="h-full px-4 flex items-center justify-between">
                        {/* Mobile Menu */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
                        >
                            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>

                        {/* Spacer */}
                        <div className="hidden lg:block" />

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="pt-14 min-h-screen p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
