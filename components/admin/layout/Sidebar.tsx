'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Cpu,
    IndianRupee,
    FileText,
    BarChart3,
    Users,
    Shield,
    ScrollText,
    Settings,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    X,
    User,
    PanelLeftClose,
    PanelLeft,
    CreditCard,
} from 'lucide-react';
import { useAuth } from '@/lib/shared/auth';

interface NavItem {
    id: string; // Used for permission check
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
            { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
            { id: 'hotels', name: 'Hotels', href: '/hotels', icon: Building2 },
            { id: 'fleet', name: 'Kiosk Fleet', href: '/fleet', icon: Cpu },
        ],
    },
    {
        title: 'Business & Finance',
        items: [
            { id: 'plans', name: 'Plans', href: '/plans', icon: CreditCard },
            { id: 'subscriptions', name: 'Subscriptions', href: '/subscriptions', icon: IndianRupee },
            { id: 'invoices', name: 'Invoices', href: '/invoices', icon: FileText },
            { id: 'reports', name: 'Reports', href: '/reports', icon: BarChart3 },
        ],
    },
    {
        title: 'Administration',
        items: [
            { id: 'users', name: 'Team & Users', href: '/users', icon: Users },
            { id: 'roles', name: 'Roles & Access', href: '/roles', icon: Shield },
            { id: 'audit', name: 'Audit Logs', href: '/audit', icon: ScrollText },
            { id: 'settings', name: 'Settings', href: '/settings', icon: Settings },
        ],
    },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
    isCollapsed: boolean;
    toggleCollapsed: () => void;
}

export function Sidebar({ isOpen = true, onClose, sidebarWidth, setSidebarWidth, isCollapsed, toggleCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const { user, canAccessPage } = useAuth();
    const [isResizing, setIsResizing] = useState(false);

    // Resizing logic
    const startResizing = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            // Limit width between 200px and 450px
            const newWidth = Math.max(200, Math.min(450, e.clientX));
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
                // We rely on ClientLayout to persist the width, but we trigger the update here
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            // Disable text selection/etc while resizing
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, setSidebarWidth]);

    // Filter nav items based on user permissions
    const filteredNavGroups = NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => canAccessPage(item.id)),
    })).filter((group) => group.items.length > 0);

    const handleLinkClick = () => {
        if (onClose) {
            onClose();
        }
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(href + '/');
    };

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
                    glass border-r-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md
                    transition-all duration-300 ease-out
                    flex flex-col overflow-hidden shadow-2xl shadow-emerald-500/5
                    transform lg:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{
                    width: isCollapsed ? 80 : sidebarWidth,
                    transition: isResizing ? 'none' : 'width 200ms ease-in-out, transform 200ms ease-in-out'
                }}
            >
                {/* Logo Area */}
                <div className={`h-16 flex-shrink-0 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-6'} border-b border-slate-200/50 dark:border-slate-700/50`}>
                    <Link href="/" className="flex items-center gap-3" onClick={handleLinkClick}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30 flex items-center justify-center flex-shrink-0">
                            <Cpu className="w-4 h-4 text-white" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">ATC Admin</span>
                        )}
                    </Link>
                    {!isCollapsed && (
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-slate-500/10 rounded-md lg:hidden transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </button>
                    )}
                </div>

                {/* User Role Badge & Collapse Toggle */}
                {user && (
                    <div className={`flex-shrink-0 ${isCollapsed ? 'py-3' : 'px-4 py-3'} border-b border-slate-200/50 dark:border-slate-700/50`}>
                        {isCollapsed ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 flex items-center justify-center" title={`${user.name} - ${user.role.replace('_', ' ')}`}>
                                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <button
                                    onClick={toggleCollapsed}
                                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 rounded-md transition-colors hidden lg:block"
                                    title="Expand sidebar"
                                >
                                    <PanelLeft className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">
                                            {user.role.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleCollapsed}
                                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 rounded-md transition-colors hidden lg:block flex-shrink-0"
                                    title="Collapse sidebar"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Nav Groups */}
                <nav className={`${isCollapsed ? 'px-2 py-4' : 'p-4 space-y-6'} overflow-y-auto flex-1`}>
                    {filteredNavGroups.map((group) => (
                        <div key={group.title}>
                            {!isCollapsed && (
                                <div className="px-2 py-1.5 text-xs font-bold text-slate-400/80 dark:text-slate-500 uppercase tracking-widest truncate">
                                    {group.title}
                                </div>
                            )}

                            <div className={`${isCollapsed ? 'space-y-1' : 'mt-2 space-y-1'}`}>
                                {group.items.map((item) => {
                                    const active = isActive(item.href);
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={handleLinkClick}
                                            title={isCollapsed ? item.name : undefined}
                                            className={`
                                                relative flex items-center transition-all duration-200 rounded-xl overflow-hidden
                                                ${isCollapsed ? 'justify-center p-2' : 'gap-3 px-3.5 py-2.5 text-sm font-medium'}
                                                ${active
                                                    ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-500/25 backdrop-blur-md'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-emerald-600 dark:hover:text-emerald-400'
                                                }
                                            `}
                                        >
                                            {active && !isCollapsed && (
                                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 rounded-r-full" />
                                            )}
                                            <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'flex-shrink-0'}`} />
                                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Profile Link */}
                    <div className={`pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto`}>
                        <Link
                            href="/profile"
                            onClick={handleLinkClick}
                            title={isCollapsed ? 'My Profile' : undefined}
                            className={`
                                relative flex items-center transition-all duration-200 rounded-xl overflow-hidden
                                ${isCollapsed ? 'justify-center p-2' : 'gap-3 px-3.5 py-2.5 text-sm font-medium'}
                                ${isActive('/profile')
                                    ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-500/25 backdrop-blur-md'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-emerald-600 dark:hover:text-emerald-400'
                                }
                            `}
                        >
                            {isActive('/profile') && !isCollapsed && (
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 rounded-r-full" />
                            )}
                            <User className="w-4 h-4 flex-shrink-0" />
                            {!isCollapsed && <span className="truncate">My Profile</span>}
                        </Link>
                    </div>
                </nav>


                {/* Resize Handle - Desktop Only */}
                {!isCollapsed && (
                    <div
                        className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-emerald-500/50 active:bg-emerald-500 transition-colors z-50 group"
                        onMouseDown={startResizing}
                    >
                        {/* Visual indicator on hover */}
                        <div className="absolute top-0 right-0 w-1 h-full bg-transparent group-hover:bg-emerald-500/30"></div>
                    </div>
                )}
            </aside>
        </>
    );
}

