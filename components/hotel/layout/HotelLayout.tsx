'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { HotelSidebar } from './HotelSidebar';
import { Menu, Moon, Sun, Bell, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/lib/shared/auth';
import { useTheme } from '@/lib/shared/theme';
import { GlobalSearch } from '@/components/shared/ui/GlobalSearch';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
    hotel_manager: { label: 'Hotel Manager', color: 'text-indigo-600 dark:text-indigo-400' },
    front_desk: { label: 'Front Desk', color: 'text-blue-600 dark:text-blue-400' },
    housekeeping: { label: 'Housekeeping', color: 'text-amber-600 dark:text-amber-400' },
    hotel_finance: { label: 'Finance', color: 'text-emerald-600 dark:text-emerald-400' },
    maintenance_staff: { label: 'Maintenance', color: 'text-orange-600 dark:text-orange-400' },
};

interface HotelLayoutProps {
    children: React.ReactNode;
}

export function HotelLayout({ children }: HotelLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated, isHotelUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Refs for click outside
    const userMenuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(userMenuRef, () => setShowUserMenu(false));

    const roleInfo = user ? ROLE_LABELS[user.role] || { label: 'User', color: 'text-slate-600' } : { label: 'User', color: 'text-slate-600' };

    // Scroll detection for transparency effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                sidebarWidth={sidebarWidth}
                setSidebarWidth={setSidebarWidth}
            />

            {/* Main Content Area */}
            <div className={`
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
            `}>
                {/* GLASS HEADER (Floating) */}
                <header className={`
                    h-14 sticky top-4 mx-4 z-[100] rounded-2xl transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'lg:left-20' : 'lg:left-64'}
                    ${scrolled 
                        ? 'bg-transparent backdrop-blur-none shadow-none opacity-0 pointer-events-none' 
                        : 'glass bg-white/60 dark:bg-slate-900/60 backdrop-blur-md opacity-100'}
                `}>
                    <div className="h-full px-4 flex items-center justify-between">
                        {/* Left side */}
                        <div className="flex items-center gap-3">
                            {/* Mobile Menu */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-slate-500/10 rounded-lg lg:hidden transition-colors"
                            >
                                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>

                            {/* Global Search - hidden on mobile */}
                            <div className="hidden sm:block">
                                <GlobalSearch />
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-slate-500/10 rounded-lg transition-colors"
                                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5 text-slate-600" />
                                ) : (
                                    <Sun className="w-5 h-5 text-amber-400" />
                                )}
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-slate-500/10 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                            </button>

                            {/* User Menu */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 pl-2 sm:pl-4 hover:bg-slate-500/10 rounded-lg py-1 pr-2 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-left hidden sm:block">
                                        <div className="font-medium text-slate-900 dark:text-white">{user?.name || 'User'}</div>
                                        <div className={`text-xs ${roleInfo.color}`}>{roleInfo.label}</div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                                </button>

                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 glass-elevated rounded-xl py-1">
                                        <Link
                                            href="/hotel/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <UserCircle className="w-4 h-4 text-slate-400" />
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/hotel/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4 text-slate-400" />
                                            Settings
                                        </Link>
                                        <div className="my-1 border-t border-slate-100/50 dark:border-slate-700/50" />
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                logout();
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 w-full transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content - Padded to account for floating header */}
                <main className="pt-20 p-4 sm:p-6 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}