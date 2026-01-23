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
    Shield,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useAuth, HOTEL_PAGE_ACCESS, HotelUserRole } from '@/lib/shared/auth';
import { HOTEL_ROLE_LABELS, MOCK_GUEST_CHECKINS, MOCK_ROOMS } from '@/lib/hotel/hotel-data';

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
            { id: 'incidents', name: 'Incidents', href: '/hotel/incidents', icon: AlertTriangle },
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
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export function HotelSidebar({ isOpen = true, onClose, isCollapsed, onToggleCollapse }: HotelSidebarProps) {
    const pathname = usePathname();
    const { user, logout, canAccessPage } = useAuth();

    const attentionCount = MOCK_GUEST_CHECKINS.filter(g => g.verification === 'failed' || g.verification === 'manual').length;
    const dirtyRoomCount = MOCK_ROOMS.filter(r => r.status === 'dirty').length;

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
                    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* GLASS SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen 
                    glass border-r-0 /* Border handled by glass class */
                    transition-all duration-300 ease-out
                    flex flex-col overflow-hidden shadow-2xl shadow-indigo-500/5
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64
                `}
            >
                {/* Logo Area */}
                <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0`}>
                    <Link href="/hotel" className="flex items-center gap-3 overflow-hidden" onClick={handleLinkClick}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/30 flex items-center justify-center flex-shrink-0">
                            <Cpu className="w-4 h-4 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="whitespace-nowrap overflow-hidden">
                                <span className="text-sm font-bold text-slate-900 dark:text-white block">Hotel Panel</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-[140px]">
                                    {user?.hotelName || 'My Hotel'}
                                </span>
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-500/10 rounded-md lg:hidden transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Nav Groups */}
                <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'p-4 space-y-6'}`}>
                    {filteredNavGroups.map((group) => (
                        <div key={group.title}>
                            {!isCollapsed && (
                                <div className="px-2 py-1.5 text-xs font-bold text-slate-400/80 dark:text-slate-500 uppercase tracking-widest">
                                    {group.title}
                                </div>
                            )}

                            <div className={`mt-2 space-y-1 ${isCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
                                {group.items.map((item) => {
                                    const active = isActive(item.href);
                                    const Icon = item.icon;
                                    const isGuestsItem = item.id === 'guests';
                                    const isRoomsItem = item.id === 'rooms';

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={handleLinkClick}
                                            title={isCollapsed ? item.name : ''}
                                            className={`
                                                relative flex items-center transition-all duration-200 rounded-xl overflow-hidden
                                                ${isCollapsed
                                                    ? 'justify-center w-10 h-10'
                                                    : 'gap-3 px-3.5 py-2.5 text-sm font-medium'
                                                }
                                                ${active
                                                    ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/25 backdrop-blur-md'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                }
                                            `}
                                        >
                                            <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                                            {!isCollapsed && (
                                                <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                                            )}

                                            {/* Badges */}
                                            {isGuestsItem && attentionCount > 0 && (
                                                isCollapsed ? (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                                                ) : (
                                                    <span className="ml-auto flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-sm shadow-rose-500/30">
                                                        {attentionCount}
                                                    </span>
                                                )
                                            )}
                                            {isRoomsItem && dirtyRoomCount > 0 && (
                                                isCollapsed ? (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                                                ) : (
                                                    <span className="ml-auto flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-sm shadow-rose-500/30">
                                                        {dirtyRoomCount}
                                                    </span>
                                                )
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <div className="hidden lg:flex items-center justify-end p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <button
                        onClick={onToggleCollapse}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-500/10 transition-colors"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* User Footer */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50">
                    {!isCollapsed ? (
                        <>
                            <div className="flex items-center gap-3 px-1 py-1 overflow-hidden">
                                <div className="w-9 h-9 rounded-full bg-indigo-100/80 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                        {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {roleLabel}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60 rounded-xl transition-colors whitespace-nowrap overflow-hidden border border-transparent hover:border-slate-200/50 dark:hover:border-slate-600/50"
                            >
                                <LogOut className="w-4 h-4 flex-shrink-0" />
                                Log Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                    {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-slate-500 hover:bg-slate-500/10 rounded-md transition-colors"
                                title="Log Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}