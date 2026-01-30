'use client';

/**
 * Pagination Components
 * 
 * Unified pagination with glassmorphism design system.
 * Use PaginationBar for a complete pagination control with page size selector.
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

// ============================================
// TYPES
// ============================================

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    showPageNumbers?: boolean;
}

interface PageSizeSelectorProps {
    value: number;
    options?: number[];
    onChange: (size: number) => void;
    label?: string;
}

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
}

// ============================================
// PAGINATION (Page Numbers)
// ============================================

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    showPageNumbers = true,
}: PaginationProps) {
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Calculate visible page numbers
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center gap-4">
            {/* Results count */}
            <span className="text-sm text-muted hidden sm:inline">
                {totalItems > 0 ? `${startItem}–${endItem} of ${totalItems}` : '0 items'}
            </span>

            {/* Navigation */}
            <div className="flex items-center gap-1">
                {/* First page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl glass-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="First page"
                >
                    <ChevronsLeft className="w-4 h-4 text-muted" />
                </button>

                {/* Previous page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl glass-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Previous page"
                >
                    <ChevronLeft className="w-4 h-4 text-muted" />
                </button>

                {/* Page numbers */}
                {showPageNumbers && (
                    <div className="hidden sm:flex items-center gap-1 mx-1">
                        {startPage > 1 && (
                            <>
                                <button
                                    onClick={() => onPageChange(1)}
                                    className="w-8 h-8 rounded-xl text-sm font-medium text-muted glass-hover transition-all"
                                >
                                    1
                                </button>
                                {startPage > 2 && (
                                    <span className="px-1 text-muted">...</span>
                                )}
                            </>
                        )}

                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${page === currentPage
                                        ? 'bg-primary text-inverse shadow-lg'
                                        : 'text-muted glass-hover'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && (
                                    <span className="px-1 text-muted">...</span>
                                )}
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className="w-8 h-8 rounded-xl text-sm font-medium text-muted glass-hover transition-all"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Mobile page indicator */}
                <span className="sm:hidden px-3 text-sm text-secondary-text">
                    {currentPage} / {totalPages || 1}
                </span>

                {/* Next page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-xl glass-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Next page"
                >
                    <ChevronRight className="w-4 h-4 text-muted" />
                </button>

                {/* Last page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-xl glass-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    title="Last page"
                >
                    <ChevronsRight className="w-4 h-4 text-muted" />
                </button>
            </div>
        </div>
    );
}

// ============================================
// PAGE SIZE SELECTOR
// ============================================

export function PageSizeSelector({
    value,
    options = [10, 25, 50],
    onChange,
    label = 'Per page',
}: PageSizeSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted">{label}:</span>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="input-glass !py-1.5 !px-2 !w-auto text-sm"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}

// ============================================
// PAGINATION BAR (Complete component)
// ============================================

export function PaginationBar({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [8, 12, 16, 24],
}: PaginationBarProps) {
    return (
        <GlassCard padding="sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Page size selector */}
                {onPageSizeChange ? (
                    <PageSizeSelector
                        value={pageSize}
                        options={pageSizeOptions}
                        onChange={onPageSizeChange}
                    />
                ) : (
                    <div /> // Spacer
                )}

                {/* Pagination controls */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={pageSize}
                    onPageChange={onPageChange}
                />
            </div>
        </GlassCard>
    );
}
