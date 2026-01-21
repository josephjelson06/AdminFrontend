'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, Cpu, X } from 'lucide-react';
import { MOCK_HOTELS, MOCK_KIOSKS } from '@/lib/admin/mock-data';

interface SearchResult {
    type: 'hotel' | 'kiosk';
    id: string;
    title: string;
    subtitle: string;
    href: string;
}

export function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Search logic
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const searchResults: SearchResult[] = [];

        // Search hotels
        MOCK_HOTELS.forEach((hotel) => {
            if (
                hotel.name.toLowerCase().includes(lowerQuery) ||
                hotel.location.toLowerCase().includes(lowerQuery)
            ) {
                searchResults.push({
                    type: 'hotel',
                    id: hotel.id,
                    title: hotel.name,
                    subtitle: hotel.location,
                    href: `/hotels/${hotel.id}`,
                });
            }
        });

        // Search kiosks
        MOCK_KIOSKS.forEach((kiosk) => {
            if (
                kiosk.serialNumber.toLowerCase().includes(lowerQuery) ||
                kiosk.assignedHotelName?.toLowerCase().includes(lowerQuery)
            ) {
                searchResults.push({
                    type: 'kiosk',
                    id: kiosk.id,
                    title: kiosk.serialNumber,
                    subtitle: kiosk.assignedHotelName || 'Unassigned',
                    href: `/fleet`,
                });
            }
        });

        setResults(searchResults.slice(0, 6));
    }, [query]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcut (Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = (result: SearchResult) => {
        router.push(result.href);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-md px-3 py-1.5 w-72">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search hotels, kiosks... (Ctrl+K)"
                    className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none w-full"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    >
                        <X className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="p-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                            {results.length} result{results.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {results.map((result) => (
                            <button
                                key={`${result.type}-${result.id}`}
                                onClick={() => handleSelect(result)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.type === 'hotel' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                                    }`}>
                                    {result.type === 'hotel' ? (
                                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    ) : (
                                        <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {result.title}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {result.subtitle}
                                    </div>
                                </div>
                                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded capitalize">
                                    {result.type}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* No results */}
            {isOpen && query.length >= 2 && results.length === 0 && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 z-50">
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">No results found for "{query}"</p>
                </div>
            )}
        </div>
    );
}
