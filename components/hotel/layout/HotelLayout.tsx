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
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isHotelUser) {
                router.push('/');
            }
        }
    }, [isLoading, isAuthenticated, isHotelUser, router]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (isLoading) {
        return (
            // Glass Loader
            <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full shadow-lg shadow-indigo-500/30" />
            </div>
        );
    }

    if (!isAuthenticated || !isHotelUser) return null;

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <HotelSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Main Content Area */}
            <div className={`
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
            `}>
                {/* GLASS HEADER (Floating) */}
                <header className={`
                    h-14 glass sticky top-4 mx-4 z-30 rounded-2xl transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'lg:left-20' : 'lg:left-64'}
                `}>
                    <div className="h-full px-4 flex items-center justify-between">
                        {/* Mobile Menu */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 hover:bg-slate-500/10 rounded-lg lg:hidden transition-colors"
                        >
                            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>

                        <div className="hidden lg:block" />

                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-slate-500/10 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-slate-500/10 rounded-lg transition-colors"
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

                {/* Page Content - Padded to account for floating header */}
                <main className="pt-8 p-4 sm:p-6 min-h-[calc(100vh-1rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}