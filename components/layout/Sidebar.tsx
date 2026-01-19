'use client';

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
    X,
    User,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

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
            { id: 'finance', name: 'Subscriptions', href: '/finance', icon: IndianRupee },
            { id: 'invoices', name: 'Invoicing', href: '/invoices', icon: FileText },
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
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, canAccessPage } = useAuth();

    // Filter nav items based on user permissions
    const filteredNavGroups = NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => canAccessPage(item.id)),
    })).filter((group) => group.items.length > 0); // Remove empty groups

    const handleLinkClick = () => {
        if (onClose) {
            onClose();
        }
    };

    // Check if path matches (including nested routes)
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(href + '/');
    };

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
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                    <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Cpu className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">ATC Admin</span>
                    </Link>
                    {/* Close button - mobile only */}
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md lg:hidden"
                    >
                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* User Role Badge */}
                {user && (
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                    {user.role.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nav Groups */}
                <nav className="p-3 space-y-4 overflow-y-auto h-[calc(100vh-7.5rem)]">
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
                                                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
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

                    {/* Profile Link - Always visible */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Link
                            href="/profile"
                            onClick={handleLinkClick}
                            className={`
                flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive('/profile')
                                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                                }
              `}
                        >
                            <User className="w-4 h-4" />
                            My Profile
                        </Link>
                    </div>
                </nav>
            </aside>
        </>
    );
}
