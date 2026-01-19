'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, User, Cpu, CreditCard, AlertTriangle, Clock, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { GlobalSearch } from '@/components/ui/GlobalSearch';

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

export function Header() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    return (
        <header className="fixed top-0 left-56 right-0 z-30 h-14 bg-white border-b border-slate-200">
            <div className="h-full flex items-center justify-between px-6">
                {/* Global Search */}
                <GlobalSearch />

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                            className="relative p-2 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            <Bell className="w-5 h-5 text-slate-600" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-xs text-slate-500 hover:text-slate-700"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5">
                                                    <NotificationIcon type={notif.type} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                                                        {!notif.read && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-slate-200">
                                    <button className="w-full text-center text-xs text-slate-500 hover:text-slate-700">
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
                            className="flex items-center gap-2 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-md py-1 pr-2 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm text-left">
                                <div className="font-medium text-slate-900">Admin User</div>
                                <div className="text-xs text-slate-500">Super Admin</div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <UserCircle className="w-4 h-4 text-slate-400" />
                                    My Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    Settings
                                </Link>
                                <div className="my-1 border-t border-slate-100" />
                                <button className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 w-full transition-colors">
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
