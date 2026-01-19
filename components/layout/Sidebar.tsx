'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Cpu,
    Users,
    CreditCard,
    FileText,
    BarChart3,
    Shield,
    Settings,
    ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
}

interface NavSection {
    title: string;
    items: NavItem[];
    collapsible?: boolean;
}

const navSections: NavSection[] = [
    {
        title: '',
        items: [
            { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Operations',
        collapsible: true,
        items: [
            { href: '/hotels', label: 'Hotels', icon: Building2 },
            { href: '/fleet', label: 'Kiosk Fleet', icon: Cpu },
            { href: '/users', label: 'User Access', icon: Users },
        ],
    },
    {
        title: 'Business & Finance',
        collapsible: true,
        items: [
            { href: '/finance', label: 'Subscriptions', icon: CreditCard },
            { href: '/invoices', label: 'Invoicing', icon: FileText },
            { href: '/reports', label: 'Reports', icon: BarChart3 },
        ],
    },
    {
        title: 'System',
        collapsible: true,
        items: [
            { href: '/audit', label: 'Audit Logs', icon: Shield },
            { href: '/settings', label: 'Settings', icon: Settings },
        ],
    },
];

function NavSection({ section }: { section: NavSection }) {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);

    const hasActiveItem = section.items.some(
        (item) => pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))
    );

    return (
        <div className="mb-1">
            {section.title && (
                <button
                    onClick={() => section.collapsible && setIsExpanded(!isExpanded)}
                    className={`
            w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider
            ${hasActiveItem ? 'text-slate-300' : 'text-slate-500'}
            ${section.collapsible ? 'hover:text-slate-300 cursor-pointer' : 'cursor-default'}
          `}
                >
                    {section.title}
                    {section.collapsible && (
                        <ChevronDown
                            className={`w-3 h-3 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
                        />
                    )}
                </button>
            )}

            {isExpanded && (
                <div className="space-y-0.5">
                    {section.items.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-2.5 px-3 py-2 mx-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                    }
                `}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-56 bg-slate-900 border-r border-slate-800 flex flex-col">
            {/* Logo */}
            <div className="h-14 flex items-center px-4 border-b border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">ATC</span>
                    </div>
                    <span className="text-white font-semibold text-sm">Super Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-3 overflow-y-auto">
                {navSections.map((section, idx) => (
                    <NavSection key={idx} section={section} />
                ))}
            </nav>

            {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-slate-800">
                <div className="text-xs text-slate-500">
                    ATC Admin v1.0.0
                </div>
            </div>
        </aside>
    );
}
