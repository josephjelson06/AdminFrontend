'use client';

import { useState, useMemo, ReactNode } from 'react';
import {
    Search,
    FileDown,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface Column<T> {
    id: string;
    header: string;
    accessor: (row: T) => ReactNode;
    sortable?: boolean;
    className?: string;
    hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    onSearch?: (query: string) => void;
    itemsPerPage?: number;
    showExport?: boolean;
    onExport?: (format: 'pdf' | 'excel') => void;
    emptyIcon?: ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    getRowKey: (row: T) => string;
}

// ============================================
// COMPONENT
// ============================================

export function DataTable<T>({
    data,
    columns,
    searchPlaceholder = 'Search...',
    searchKeys,
    onSearch,
    itemsPerPage = 10,
    showExport = true,
    onExport,
    emptyIcon,
    emptyTitle = 'No results found',
    emptyDescription = 'Try adjusting your search',
    getRowKey,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(itemsPerPage);

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!searchQuery || !searchKeys) return data;

        const query = searchQuery.toLowerCase();
        return data.filter((row) => {
            return searchKeys.some((key) => {
                const value = row[key];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(query);
                }
                return false;
            });
        });
    }, [data, searchQuery, searchKeys]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    // Handle search
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
        onSearch?.(value);
    };

    // Handle export
    const handleExport = (format: 'pdf' | 'excel') => {
        onExport?.(format);
    };

    // Pagination helpers
    const startItem = filteredData.length > 0 ? startIndex + 1 : 0;
    const endItem = Math.min(startIndex + pageSize, filteredData.length);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            {/* Toolbar */}
            <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-200 dark:border-slate-700">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                    />
                </div>

                {/* Export Buttons */}
                {showExport && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <FileDown className="w-4 h-4" />
                            <span className="hidden sm:inline">Export PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport('excel')}
                            className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <FileDown className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Excel</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className={`text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase ${col.hideOnMobile ? 'hidden sm:table-cell' : ''
                                        } ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {paginatedData.map((row) => (
                            <tr key={getRowKey(row)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                {columns.map((col) => (
                                    <td
                                        key={col.id}
                                        className={`px-4 py-3 ${col.hideOnMobile ? 'hidden sm:table-cell' : ''
                                            } ${col.className || ''}`}
                                    >
                                        {col.accessor(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredData.length === 0 && (
                <div className="py-12 text-center">
                    {emptyIcon && <div className="mb-3">{emptyIcon}</div>}
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                        {emptyTitle}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {emptyDescription}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {filteredData.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                    {/* Info */}
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{startItem}</span> to{' '}
                        <span className="font-medium text-slate-700 dark:text-slate-300">{endItem}</span> of{' '}
                        <span className="font-medium text-slate-700 dark:text-slate-300">{filteredData.length}</span> results
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        {/* Page Size */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Rows:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                                className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
                            >
                                {[5, 10, 25, 50].map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>

                        {/* Page Navigation */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </button>

                            <span className="px-3 text-sm text-slate-700 dark:text-slate-300">
                                {currentPage} / {totalPages || 1}
                            </span>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// HELPER COMPONENTS
// ============================================

export function TableActions({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-end">
            {children}
        </div>
    );
}

export function TableBadge({
    children,
    variant = 'default'
}: {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
    const styles = {
        default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[variant]}`}>
            {children}
        </span>
    );
}
