'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pages = [];
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
        <div className="flex items-center justify-between py-3 px-4 border-t border-slate-200 bg-white">
            <div className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{startItem}</span> to{' '}
                <span className="font-medium text-slate-700">{endItem}</span> of{' '}
                <span className="font-medium text-slate-700">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="w-8 h-8 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-1 text-slate-400">...</span>}
                    </>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${page === currentPage
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="w-8 h-8 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
            </div>
        </div>
    );
}

// Items per page selector
interface PageSizeSelectorProps {
    value: number;
    options?: number[];
    onChange: (size: number) => void;
}

export function PageSizeSelector({
    value,
    options = [10, 25, 50, 100],
    onChange,
}: PageSizeSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Show</span>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="px-2 py-1 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            <span className="text-sm text-slate-500">entries</span>
        </div>
    );
}
