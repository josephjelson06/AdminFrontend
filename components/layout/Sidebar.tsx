'use client';

import { useState } from 'react';
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
    ScrollText,
    Settings,
    ChevronDown,
    ChevronRight,
    X,
} from 'lucide-react';

interface NavItem {
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
            { name: 'Dashboard', href: '/', icon: LayoutDashboard },
            { name: 'Hotels', href: '/hotels', icon: Building2 },
            { name: 'Kiosk Fleet', href: '/fleet', icon: Cpu },
        ],
    },
    {
        title: 'Business & Finance',
        items: [
            { name: 'Subscriptions', href: '/finance', icon: IndianRupee },
            { name: 'Invoicing', href: '/invoices', icon: FileText },
            { name: 'Reports', href: '/reports', icon: BarChart3 },
        ],
    },
    {
        title: 'System',
        items: [
            { name: 'User Access', href: '/users', icon: Users },
            { name: 'Audit Logs', href: '/audit', icon: ScrollText },
            { name: 'Settings', href: '/settings', icon: Settings },
        ],
    },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [expandedGroups, setExpandedGroups] = useState<string[]>(
        NAV_GROUPS.map((g) => g.title)
    );

    const toggleGroup = (title: string) => {
        setExpandedGroups((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const handleLinkClick = () => {
        // Close sidebar on mobile when link is clicked
        if (onClose) {
            onClose();
        }
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

                {/* Nav Groups */}
                <nav className="p-3 space-y-4 overflow-y-auto h-[calc(100vh-3.5rem)]">
                    {NAV_GROUPS.map((group) => {
                        const isExpanded = expandedGroups.includes(group.title);

                        return (
                            <div key={group.title}>
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-400"
                                >
                                    {group.title}
                                    {isExpanded ? (
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    ) : (
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="mt-1 space-y-0.5">
                                        {group.items.map((item) => {
                                            const isActive = pathname === item.href;
                                            const Icon = item.icon;

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={handleLinkClick}
                                                    className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                            ${isActive
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
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
