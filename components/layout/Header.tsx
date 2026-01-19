'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Bell,
    User,
    Cpu,
    CreditCard,
    AlertTriangle,
    Clock,
    ChevronDown,
    LogOut,
    Settings,
    UserCircle,
    Menu,
    Moon,
    Sun,
} from 'lucide-react';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';

// Mock notifications
const MOCK_NOTIFICATIONS = [
    {
        id: 'n-001',
        type: 'alert',
        title: 'Kiosk Offline',
        message: 'ATC-SN-7766 has been offline for 24+ hours',
        time: '2 hours ago',
        read: false,
    },
    {
        id: 'n-002',
        type: 'payment',
        title: 'Payment Overdue',
        message: 'Lemon Tree Premier - ₹25,000 overdue by 9 days',
        time: '5 hours ago',
        read: false,
    },
    {
        id: 'n-003',
        type: 'contract',
        title: 'Contract Expiring',
        message: 'Ginger Hotel contract expires in 15 days',
        time: '1 day ago',
        read: true,
    },
];

function NotificationIcon({ type }: { type: string }) {
    switch (type) {
        case 'alert':
            return <Cpu className="w-4 h-4 text-rose-500" />;
        case 'payment':
            return <CreditCard className="w-4 h-4 text-amber-500" />;
        case 'contract':
            return <Clock className="w-4 h-4 text-blue-500" />;
        default:
            return <AlertTriangle className="w-4 h-4 text-slate-400" />;
    }
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
    // Admin roles
    super_admin: { label: 'Super Admin', color: 'text-purple-600 dark:text-purple-400' },
    operations: { label: 'Operations', color: 'text-blue-600 dark:text-blue-400' },
    finance: { label: 'Finance', color: 'text-emerald-600 dark:text-emerald-400' },
    support: { label: 'Support', color: 'text-amber-600 dark:text-amber-400' },
    // Hotel roles
    hotel_manager: { label: 'Hotel Manager', color: 'text-indigo-600 dark:text-indigo-400' },
    front_desk: { label: 'Front Desk', color: 'text-blue-600 dark:text-blue-400' },
    housekeeping: { label: 'Housekeeping', color: 'text-amber-600 dark:text-amber-400' },
    hotel_finance: { label: 'Finance', color: 'text-emerald-600 dark:text-emerald-400' },
};

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    const roleInfo = user ? ROLE_LABELS[user.role] : { label: 'User', color: 'text-slate-600' };

    return (
        <header className="fixed top-0 left-0 lg:left-64 right-0 z-30 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="h-full flex items-center justify-between px-4 lg:px-6">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md lg:hidden"
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
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 text-slate-600" />
                        ) : (
                            <Sun className="w-5 h-5 text-amber-400" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        >
                            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5">
                                                    <NotificationIcon type={notif.type} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{notif.title}</p>
                                                        {!notif.read && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                                    <button className="w-full text-center text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-2 pl-2 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md py-1 pr-2 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-600 flex items-center justify-center">
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
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <UserCircle className="w-4 h-4 text-slate-400" />
                                    My Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    Settings
                                </Link>
                                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 w-full transition-colors"
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
    );
}
