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
import { SelectDropdown } from './Dropdown';

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
        <div className="surface-glass-strong rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-glass">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="input-glass-strong pl-10"
                    />
                </div>

                {/* Export Buttons */}
                {showExport && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleExport('pdf')}
                            className="btn-secondary"
                        >
                            <FileDown className="w-4 h-4" />
                            <span className="hidden sm:inline">Export PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport('excel')}
                            className="btn-secondary"
                        >
                            <FileDown className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Excel</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto surface-solid">
                <table className="w-full">
                    <thead>
                        <tr className="surface-glass-soft border-b border-glass">
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className={`text-left px-4 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider ${col.hideOnMobile ? 'hidden sm:table-cell' : ''
                                        } ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-subtle/50">
                        {paginatedData.map((row) => (
                            <tr key={getRowKey(row)} className="hover:bg-glass-soft transition-colors duration-normal">
                                {columns.map((col) => (
                                    <td
                                        key={col.id}
                                        className={`px-4 py-3.5 text-sm text-primary ${col.hideOnMobile ? 'hidden sm:table-cell' : ''
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
                    <h3 className="text-lg font-medium text-primary mb-1">
                        {emptyTitle}
                    </h3>
                    <p className="text-sm text-muted">
                        {emptyDescription}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {filteredData.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-glass">
                    {/* Info */}
                    <div className="text-sm text-muted">
                        Showing <span className="font-medium text-secondary">{startItem}</span> to{' '}
                        <span className="font-medium text-secondary">{endItem}</span> of{' '}
                        <span className="font-medium text-secondary">{filteredData.length}</span> results
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        {/* Page Size */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted">Rows:</span>
                            <div className="w-20">
                                <SelectDropdown
                                    value={String(pageSize)}
                                    onChange={(val) => { setPageSize(Number(val)); setCurrentPage(1); }}
                                    options={[5, 10, 25, 50].map((size) => ({ value: String(size), label: String(size) }))}
                                />
                            </div>
                        </div>

                        {/* Page Navigation */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 btn-ghost rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <span className="px-3 text-sm text-secondary font-medium">
                                {currentPage} / {totalPages || 1}
                            </span>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="p-2 btn-ghost rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
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
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}) {
    const styles = {
        default: 'badge-neutral',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        info: 'badge-info',
    };

    return (
        <span className={`${styles[variant]}`}>
            {children}
        </span>
    );
}
