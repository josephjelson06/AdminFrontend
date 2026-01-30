'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    Bell,
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
    super_admin: { label: 'Super Admin', color: 'text-purple-400' },
    operations: { label: 'Operations', color: 'text-blue-400' },
    finance: { label: 'Finance', color: 'text-emerald-400' },
    support: { label: 'Support', color: 'text-amber-400' },
    // Hotel roles
    hotel_manager: { label: 'Hotel Manager', color: 'text-indigo-400' },
    front_desk: { label: 'Front Desk', color: 'text-blue-400' },
    housekeeping: { label: 'Housekeeping', color: 'text-amber-400' },
    hotel_finance: { label: 'Finance', color: 'text-emerald-400' },
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

    const roleInfo = user ? ROLE_LABELS[user.role] : { label: 'User', color: 'text-slate-400' };

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
        <header className={`sticky top-4 mx-4 z-[99] h-14 rounded-2xl lg:ml-[calc(var(--sidebar-width)+1rem)] transition-all duration-500 ease-out ${
            scrolled 
                ? 'opacity-0 pointer-events-none translate-y-[-8px]' 
                : 'surface-glass-strong opacity-100 translate-y-0 shadow-lg shadow-black/5'
        }`}>
            <div className="h-full flex items-center justify-between px-4 lg:px-6">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 hover:bg-white/10 rounded-lg lg:hidden transition-colors text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Global Search - hidden on mobile */}
                    <div className="hidden sm:block">
                        <GlobalSearch />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    
                    {/* Theme Toggle (Optional - since you forced dark mode, maybe keep for fun) */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 text-white/70 hover:text-white"
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5" />
                        ) : (
                            <Sun className="w-5 h-5" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                            className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 text-white/70 hover:text-white"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center shadow-lg shadow-rose-500/40 animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown - FIXED CLASS */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 surface-glass-strong rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/10 shadow-2xl shadow-black/50">
                                <div className="px-4 py-3 border-b border-white/10 bg-black/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="text-xs text-slate-400 hover:text-white transition-colors"
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
                                                className={`px-2.5 py-1.5 text-xs rounded-lg transition-all duration-200 ${notificationFilter === filter
                                                    ? 'bg-white/10 text-white font-medium border border-white/5'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                                            <p className="text-sm text-slate-400">No notifications</p>
                                        </div>
                                    ) : (
                                        filteredNotifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors duration-200 cursor-pointer ${!notif.read ? 'bg-indigo-500/5' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5">
                                                        <NotificationIcon type={notif.type} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-slate-200">{notif.title}</p>
                                                            {!notif.read && (
                                                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                                                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="px-4 py-2.5 border-t border-white/10 bg-black/20">
                                    <button className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu - FIXED STYLING */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                            // Removed the 'border-l' and 'btn-ghost' classes causing the leak
                            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/10 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                                <span className="text-xs font-bold text-white">
                                    {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                                </span>
                            </div>
                            <div className="text-left hidden sm:block">
                                <div className="text-xs font-semibold text-white leading-tight">{user?.name || 'User'}</div>
                                <div className={`text-[10px] uppercase tracking-wider font-medium ${roleInfo.color}`}>{roleInfo.label}</div>
                            </div>
                            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* User Dropdown - FIXED CLASS */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 surface-glass-strong rounded-2xl py-2 animate-in fade-in zoom-in-95 duration-200 border border-white/10 shadow-2xl shadow-black/50">
                                
                                {/* Dropdown Header */}
                                <div className="px-4 py-2 mb-2 border-b border-white/5 sm:hidden">
                                    <div className="font-medium text-white">{user?.name}</div>
                                    <div className="text-xs text-slate-400">{roleInfo.label}</div>
                                </div>

                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <UserCircle className="w-4 h-4 text-slate-400" />
                                    My Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    Settings
                                </Link>
                                
                                <div className="my-2 border-t border-white/10 mx-2" />
                                
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 w-full transition-all duration-200"
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