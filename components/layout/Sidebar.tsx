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
    X,
    User,
    type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
    id: string;
    name: string;
    href: string;
    icon: LucideIcon;
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

const smoothTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 35,
};

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, canAccessPage } = useAuth();

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
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Glass Style */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-64 
                    glass-sidebar
                    transform transition-transform duration-300 ease-out
                    lg:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={smoothTransition}
                            className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                        >
                            <Cpu className="w-4 h-4 text-white" />
                        </motion.div>
                        <span className="text-sm font-bold text-slate-100">ATC Admin</span>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-md lg:hidden transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </motion.button>
                </div>

                {/* User Role Badge */}
                {user && (
                    <div className="px-4 py-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-100 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-400 capitalize">
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
                            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                                            className="relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            {/* Glossy Active Pill */}
                                            {active && (
                                                <motion.div
                                                    layoutId="sidebar-active-pill"
                                                    className="absolute inset-0 bg-white/10 rounded-lg shadow-inner"
                                                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)' }}
                                                    transition={smoothTransition}
                                                />
                                            )}

                                            {/* Icon and Text */}
                                            <span className={`relative z-10 flex items-center gap-2.5 ${active
                                                ? 'text-white'
                                                : 'text-slate-400 hover:text-slate-100'
                                                }`}>
                                                <Icon className="w-4 h-4" />
                                                {item.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Profile Link */}
                    <div className="pt-4 border-t border-white/10">
                        <Link
                            href="/profile"
                            onClick={handleLinkClick}
                            className="relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {isActive('/profile') && (
                                <motion.div
                                    layoutId="sidebar-active-pill"
                                    className="absolute inset-0 bg-white/10 rounded-lg shadow-inner"
                                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)' }}
                                    transition={smoothTransition}
                                />
                            )}
                            <span className={`relative z-10 flex items-center gap-2.5 ${isActive('/profile')
                                ? 'text-white'
                                : 'text-slate-400 hover:text-slate-100'
                                }`}>
                                <User className="w-4 h-4" />
                                My Profile
                            </span>
                        </Link>
                    </div>
                </nav>
            </aside>
        </>
    );
}

