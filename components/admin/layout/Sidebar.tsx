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
    X,
    PanelLeftClose,
    PanelLeft,
    CreditCard,
    LifeBuoy,
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
            { id: 'support', name: 'Helpdesk', href: '/support', icon: LifeBuoy },
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
    const { canAccessPage } = useAuth();
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
                    className="mobile-menu-overlay"
                    onClick={onClose}
                />
            )}

            {/* GLASS SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-[110] h-screen
                    surface-glass-soft
                    flex flex-col overflow-hidden
                    transform lg:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{
                    width: isCollapsed ? 80 : sidebarWidth,
                    transition: isResizing ? 'none' : 'width var(--transition-normal) var(--ease-smooth), transform var(--transition-normal) var(--ease-smooth)'
                }}
            >
                {/* Logo Area */}
                <div className={`flex-shrink-0 flex flex-col ${isCollapsed ? 'items-center px-2 py-4' : 'px-6 py-4'} border-b border-glass`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                        <Link href="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center flex-shrink-0 transition-transform duration-normal group-hover:scale-105">
                                <Cpu className="w-5 h-5 text-white" />
                            </div>
                            {!isCollapsed && (
                                <span className="text-sm font-bold text-primary truncate">ATC Admin</span>
                            )}
                        </Link>
                        {/* Close button - Mobile */}
                        {!isCollapsed && (
                            <button
                                onClick={onClose}
                                className="p-1.5 btn-ghost rounded-lg lg:hidden"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {/* Collapse/Expand Toggle - Desktop */}
                    <button
                        onClick={toggleCollapsed}
                        className={`mt-3 p-2 rounded-lg text-secondary hover:text-accent transition-all duration-normal hidden lg:flex items-center hover:bg-glass-soft ${isCollapsed ? 'justify-center' : 'gap-2'}`}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                        {!isCollapsed && <span className="text-xs font-medium">Collapse</span>}
                    </button>
                </div>

                {/* Nav Groups */}
                <nav className={`${isCollapsed ? 'px-2 py-4' : 'p-4 space-y-6'} overflow-y-auto flex-1`}>
                    {filteredNavGroups.map((group) => (
                        <div key={group.title}>
                            {!isCollapsed && (
                                <div className="px-2 py-1.5 text-xs font-bold text-muted uppercase tracking-widest truncate">
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
                                                relative flex items-center rounded-xl overflow-hidden
                                                transition-all duration-normal ease-smooth
                                                ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5 text-sm font-medium'}
                                                ${active
                                                    ? 'nav-item-active bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 text-white shadow-lg shadow-emerald-500/25'
                                                    : 'nav-item'
                                                }
                                            `}
                                        >
                                            {active && !isCollapsed && (
                                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-white/40 rounded-r-full" />
                                            )}
                                            <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'flex-shrink-0'} ${active ? '' : ''}`} />
                                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                </nav>


                {/* Resize Handle - Desktop Only */}
                {!isCollapsed && (
                    <div
                        className="hidden lg:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize transition-all duration-normal z-50 group hover:bg-emerald-500/30 active:bg-emerald-500/50"
                        onMouseDown={startResizing}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-transparent group-hover:bg-emerald-500/60 transition-all" />
                    </div>
                )}
            </aside>
        </>
    );
}

