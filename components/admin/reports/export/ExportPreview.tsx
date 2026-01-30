'use client';

/**
 * ExportPreview Component
 * 
 * Table preview of export data with sorting and column visibility.
 */

import { useState } from 'react';
import { Eye, EyeOff, ArrowUpDown, Download, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';

export interface Column {
    id: string;
    label: string;
    sortable?: boolean;
}

interface ExportPreviewProps {
    columns: Column[];
    data: Record<string, unknown>[];
    isLoading?: boolean;
    onExport: () => void;
    isExporting?: boolean;
    totalCount?: number;
}

export function ExportPreview({
    columns,
    data,
    isLoading = false,
    onExport,
    isExporting = false,
    totalCount = 0,
}: ExportPreviewProps) {
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(columns.map((c) => c.id))
    );
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showColumnPicker, setShowColumnPicker] = useState(false);

    const toggleColumn = (columnId: string) => {
        const newVisible = new Set(visibleColumns);
        if (newVisible.has(columnId)) {
            if (newVisible.size > 1) {
                newVisible.delete(columnId);
            }
        } else {
            newVisible.add(columnId);
        }
        setVisibleColumns(newVisible);
    };

    const handleSort = (columnId: string) => {
        if (sortColumn === columnId) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnId);
            setSortDirection('asc');
        }
    };

    const visibleCols = columns.filter((c) => visibleColumns.has(c.id));

    return (
        <GlassCard padding="none" className="lg:col-span-2">
            {/* Header */}
            <div className="p-5 border-b border-glass flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold text-primary flex items-center gap-2">
                        <Eye className="w-5 h-5 text-info" />
                        Preview
                    </h3>
                    <p className="text-xs text-muted">
                        Showing {data.length} of {totalCount.toLocaleString()} records
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Column Visibility Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowColumnPicker(!showColumnPicker)}
                            className="btn-secondary text-xs px-3 py-2"
                        >
                            <EyeOff className="w-4 h-4" />
                            Columns
                        </button>
                        {showColumnPicker && (
                            <div className="absolute right-0 top-full mt-2 w-48 p-2 surface-glass-strong rounded-xl border border-glass shadow-xl z-20">
                                {columns.map((col) => (
                                    <label
                                        key={col.id}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:surface-glass-soft cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns.has(col.id)}
                                            onChange={() => toggleColumn(col.id)}
                                            className="rounded border-glass"
                                        />
                                        <span className="text-sm text-primary">{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={onExport}
                        disabled={isExporting || data.length === 0}
                        className="btn-primary px-5 py-2 disabled:opacity-50"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Export {totalCount.toLocaleString()} Records
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-info border-t-transparent" />
                            <p className="text-sm text-muted">Loading preview...</p>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-sm text-muted">No data available for the selected filters</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="surface-glass-soft border-b border-glass">
                                {visibleCols.map((col) => (
                                    <th
                                        key={col.id}
                                        className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider"
                                    >
                                        {col.sortable ? (
                                            <button
                                                onClick={() => handleSort(col.id)}
                                                className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                            >
                                                {col.label}
                                                <ArrowUpDown className={`w-3 h-3 ${sortColumn === col.id ? 'text-info' : ''}`} />
                                            </button>
                                        ) : (
                                            col.label
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass">
                            {data.map((row, idx) => (
                                <tr key={idx} className="hover:surface-glass-soft transition-colors">
                                    {visibleCols.map((col) => (
                                        <td key={col.id} className="px-5 py-3.5 text-sm text-primary">
                                            {String(row[col.id] ?? '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </GlassCard>
    );
}
