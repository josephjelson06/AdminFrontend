'use client';

import { useState, useRef, useEffect } from 'react';
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
import { GlobalSearch } from '@/components/shared/ui/GlobalSearch';
import { useAuth } from '@/lib/shared/auth';
import { useTheme } from '@/lib/shared/theme';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

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
    sidebarCollapsed?: boolean;
}

export function Header({ onMenuClick, sidebarCollapsed = false }: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [notificationFilter, setNotificationFilter] = useState<'all' | 'alert' | 'payment' | 'contract'>('all');
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Refs for click outside
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(notificationRef, () => setShowNotifications(false));
    useOnClickOutside(userMenuRef, () => setShowUserMenu(false));

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    const filteredNotifications = notificationFilter === 'all'
        ? notifications
        : notifications.filter(n => n.type === notificationFilter);

    const roleInfo = user ? ROLE_LABELS[user.role] : { label: 'User', color: 'text-secondary' };

    // Scroll detection for transparency effect
    const [scrolled, setScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-4 mx-4 z-[99] h-14 rounded-2xl lg:ml-[calc(var(--sidebar-width)+1rem)] transition-all duration-slow ease-smooth ${
            scrolled 
                ? 'opacity-0 pointer-events-none translate-y-[-8px]' 
                : 'surface-glass-soft opacity-100 translate-y-0'
        }`}>
            <div className="h-full flex items-center justify-between px-4 lg:px-6">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 btn-ghost rounded-lg lg:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Global Search - hidden on mobile */}
                    <div className="hidden sm:block">
                        <GlobalSearch />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 btn-ghost rounded-xl"
                        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 text-secondary" />
                        ) : (
                            <Sun className="w-5 h-5 text-amber-400" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                            className="relative p-2.5 btn-ghost rounded-xl"
                        >
                            <Bell className="w-5 h-5 text-secondary" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger rounded-full text-[10px] text-white font-bold flex items-center justify-center shadow-lg shadow-danger/40 animate-pulse-slow">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 glass-elevated rounded-2xl overflow-hidden animate-scale-in">
                                <div className="px-4 py-3 border-b border-glass">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-primary">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="text-xs text-muted hover:text-primary transition-colors duration-normal"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    {/* Category Filter Tabs */}
                                    <div className="flex gap-1">
                                        {(['all', 'alert', 'payment', 'contract'] as const).map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setNotificationFilter(filter)}
                                                className={`px-2.5 py-1.5 text-xs rounded-lg transition-all duration-normal ${notificationFilter === filter
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                                                    : 'text-muted hover:text-primary hover:bg-glass-soft'
                                                    }`}
                                            >
                                                {filter === 'all' ? 'All' : filter === 'alert' ? 'Kiosk' : filter === 'payment' ? 'Billing' : 'Contract'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {filteredNotifications.length === 0 ? (
                                        <div className="px-4 py-8 text-center">
                                            <p className="text-sm text-muted">No notifications</p>
                                        </div>
                                    ) : (
                                        filteredNotifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`px-4 py-3 border-b border-glass hover:bg-glass-soft transition-colors duration-normal cursor-pointer ${!notif.read ? 'bg-info/5' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5">
                                                        <NotificationIcon type={notif.type} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-primary">{notif.title}</p>
                                                            {!notif.read && (
                                                                <span className="w-2 h-2 bg-info rounded-full animate-pulse" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-secondary mt-0.5">{notif.message}</p>
                                                        <p className="text-xs text-muted mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="px-4 py-2.5 border-t border-glass">
                                    <button className="w-full text-center text-xs text-accent hover:text-primary transition-colors duration-normal font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-2 pl-3 sm:border-l border-glass btn-ghost rounded-xl py-1.5 pr-2"
                        >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                                </span>
                            </div>
                            <div className="text-sm text-left hidden sm:block">
                                <div className="font-medium text-primary">{user?.name || 'User'}</div>
                                <div className={`text-xs ${roleInfo.color}`}>{roleInfo.label}</div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-52 glass-elevated rounded-2xl py-2 animate-scale-in">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-glass-soft transition-all duration-normal"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <UserCircle className="w-4 h-4" />
                                    My Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-glass-soft transition-all duration-normal"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>
                                <div className="my-2 border-t border-glass mx-2" />
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 w-full transition-all duration-normal"
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
