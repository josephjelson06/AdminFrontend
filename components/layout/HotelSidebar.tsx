'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    BedDouble,
    Monitor,
    Building2,
    UserCog,
    CreditCard,
    LifeBuoy,
    LogOut,
    X,
    Cpu,
} from 'lucide-react';
import { useAuth, HOTEL_PAGE_ACCESS, HotelUserRole } from '@/lib/auth';
import { HOTEL_ROLE_LABELS } from '@/lib/hotel-data';

interface NavItem {
    id: string;
    name: string;
    href: string;
    icon: React.ElementType;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
    {
        title: 'Operations',
        items: [
            { id: 'dashboard', name: 'Dashboard', href: '/hotel', icon: LayoutDashboard },
            { id: 'guests', name: 'Guests', href: '/hotel/guests', icon: Users },
            { id: 'rooms', name: 'Rooms', href: '/hotel/rooms', icon: BedDouble },
        ],
    },
    {
        title: 'Configuration',
        items: [
            { id: 'kiosk', name: 'Kiosk Settings', href: '/hotel/kiosk', icon: Monitor },
            { id: 'settings', name: 'My Hotel', href: '/hotel/settings', icon: Building2 },
            { id: 'team', name: 'Team Access', href: '/hotel/team', icon: UserCog },
        ],
    },
    {
        title: 'Account',
        items: [
            { id: 'billing', name: 'Subscription & Billing', href: '/hotel/billing', icon: CreditCard },
            { id: 'help', name: 'Help & Support', href: '/hotel/help', icon: LifeBuoy },
        ],
    },
];

interface HotelSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function HotelSidebar({ isOpen = true, onClose }: HotelSidebarProps) {
    const pathname = usePathname();
    const { user, logout, canAccessPage } = useAuth();

    // Filter nav items based on user permissions
    const filteredNavGroups = NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => canAccessPage(item.id)),
    })).filter((group) => group.items.length > 0);

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    const isActive = (href: string) => {
        if (href === '/hotel') return pathname === '/hotel';
        return pathname === href || pathname.startsWith(href + '/');
    };

    const roleLabel = user?.role ? HOTEL_ROLE_LABELS[user.role as HotelUserRole] || user.role : '';

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-screen w-64 
          bg-white dark:bg-slate-900 
          border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                    <Link href="/hotel" className="flex items-center gap-2" onClick={handleLinkClick}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                            <Cpu className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white block">Hotel Panel</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-[140px]">
                                {user?.hotelName || 'My Hotel'}
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md lg:hidden"
                    >
                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Nav Groups */}
                <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
                    {filteredNavGroups.map((group) => (
                        <div key={group.title}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                {group.title}
                            </div>

                            <div className="mt-1 space-y-0.5">
                                {group.items.map((item) => {
                                    const active = isActive(item.href);
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={handleLinkClick}
                                            className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                                                }
                      `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Footer */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {roleLabel}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </aside>
        </>
    );
}
