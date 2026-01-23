'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Command,
    Building2,
    Users,
    Cpu,
    FileText,
    Settings,
    LifeBuoy,
    CreditCard,
    ArrowRight
} from 'lucide-react';
import { MOCK_HOTELS } from '@/lib/hotel/hotel-data';
import { MOCK_ADMIN_USERS } from '@/lib/admin/users-data';
import { MOCK_KIOSKS } from '@/lib/admin/mock-data';
import { MOCK_INVOICES } from '@/lib/admin/finance-data';

interface SearchGroup {
    category: string;
    items: SearchItem[];
}

interface SearchItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ElementType;
    href: string;
    keywords?: string[];
}

export function GlobalSearch() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    // Keyboard Shortcut (Cmd+K)
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Search Logic
    const results = React.useMemo(() => {
        if (!query.trim()) return [];

        const q = query.toLowerCase();
        const groups: SearchGroup[] = [];

        // 1. Pages / Navigation
        const pages: SearchItem[] = [
            { id: 'p-1', title: 'Dashboard', icon: Command, href: '/dashboard' },
            { id: 'p-2', title: 'Hotels Registry', icon: Building2, href: '/hotels' },
            { id: 'p-3', title: 'Kiosk Fleet', icon: Cpu, href: '/fleet' },
            { id: 'p-4', title: 'Finance & Invoices', icon: CreditCard, href: '/invoices' },
            { id: 'p-5', title: 'Team Management', icon: Users, href: '/users' },
            { id: 'p-6', title: 'Global Settings', icon: Settings, href: '/settings' },
            { id: 'p-7', title: 'Helpdesk', icon: LifeBuoy, href: '/support' },
        ].filter(item => item.title.toLowerCase().includes(q));

        if (pages.length > 0) groups.push({ category: 'Navigation', items: pages });

        // 2. Hotels
        // Safety check for MOCK_HOTELS
        const hotelsData = typeof MOCK_HOTELS !== 'undefined' ? MOCK_HOTELS : [];
        const hotels: SearchItem[] = hotelsData
            .filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q))
            .slice(0, 3)
            .map(h => ({
                id: h.id,
                title: h.name,
                subtitle: `${h.city} • ${h.status}`,
                icon: Building2,
                href: `/hotels/${h.id}`
            }));

        if (hotels.length > 0) groups.push({ category: 'Hotels', items: hotels });

        // 3. Team
        const usersData = typeof MOCK_ADMIN_USERS !== 'undefined' ? MOCK_ADMIN_USERS : [];
        const users: SearchItem[] = usersData
            .filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
            .slice(0, 3)
            .map(u => ({
                id: u.id,
                title: u.name,
                subtitle: u.roleName,
                icon: Users,
                href: '/users'
            }));

        if (users.length > 0) groups.push({ category: 'Team', items: users });

        // 4. Kiosks
        const kiosksData = typeof MOCK_KIOSKS !== 'undefined' ? MOCK_KIOSKS : [];
        const kiosks: SearchItem[] = kiosksData
            .filter(k => k.serialNumber.toLowerCase().includes(q) || k.model.toLowerCase().includes(q))
            .slice(0, 3)
            .map(k => ({
                id: k.id,
                title: k.serialNumber,
                subtitle: `${k.model} • ${k.status}`,
                icon: Cpu,
                href: '/fleet'
            }));

        if (kiosks.length > 0) groups.push({ category: 'Kiosks', items: kiosks });

        return groups;
    }, [query]);

    // Flatten results for keyboard navigation
    const flatResults = React.useMemo(() =>
        results.flatMap(g => g.items),
        [results]);

    // Handle Selection
    const handleSelect = (href: string) => {
        setOpen(false);
        setQuery('');
        router.push(href);
    };

    // Keyboard Navigation in List
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => (i + 1) % flatResults.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => (i - 1 + flatResults.length) % flatResults.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (flatResults[selectedIndex]) {
                    handleSelect(flatResults[selectedIndex].href);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, flatResults, selectedIndex]);

    // Reset selection when results change
    React.useEffect(() => setSelectedIndex(0), [results]);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="group flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600 w-full sm:w-64"
            >
                <Search className="w-4 h-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">Search...</span>
                <span className="ml-auto text-xs text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono hidden sm:inline-block">
                    ⌘K
                </span>
            </button>

            {/* Modal Overlay */}
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        {/* Search Input */}
                        <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
                            <Search className="w-5 h-5 text-slate-400 mr-3" />
                            <input
                                type="text"
                                className="flex-1 py-4 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-base"
                                placeholder="Type to search..."
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                onClick={() => setOpen(false)}
                                className="ml-2 px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 rounded hover:text-slate-700"
                            >
                                ESC
                            </button>
                        </div>

                        {/* Results List */}
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {results.length === 0 ? (
                                <div className="py-12 text-center text-sm text-slate-500">
                                    {query ? 'No results found.' : 'Search hotels, users, or settings...'}
                                </div>
                            ) : (
                                results.map((group) => (
                                    <div key={group.category} className="mb-4 last:mb-0">
                                        <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            {group.category}
                                        </h3>
                                        <div className="space-y-1">
                                            {group.items.map((item) => {
                                                const isSelected = flatResults[selectedIndex]?.id === item.id;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleSelect(item.href)}
                                                        onMouseEnter={() => {
                                                            const idx = flatResults.findIndex(r => r.id === item.id);
                                                            if (idx !== -1) setSelectedIndex(idx);
                                                        }}
                                                        className={`flex items-center w-full px-3 py-3 rounded-xl transition-colors text-left gap-3 ${isSelected
                                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100'
                                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                                            }`}
                                                    >
                                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                            }`}>
                                                            <item.icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm truncate">{item.title}</div>
                                                            {item.subtitle && (
                                                                <div className={`text-xs truncate ${isSelected ? 'text-emerald-700/70 dark:text-emerald-300/70' : 'text-slate-400'}`}>
                                                                    {item.subtitle}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {isSelected && <ArrowRight className="w-4 h-4 opacity-50" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-400 flex justify-between items-center">
                            <span>
                                <strong className="font-medium text-slate-500 dark:text-slate-300">↑↓</strong> to navigate
                            </span>
                            <span>
                                <strong className="font-medium text-slate-500 dark:text-slate-300">↵</strong> to select
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
