'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield, Calendar, User, Activity, Download, Search, ChevronDown, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';

// Mock audit log data
const MOCK_AUDIT_LOGS = [
    {
        id: 'log-001',
        timestamp: '2026-01-19T11:45:00Z',
        user: 'Rahul Sharma',
        action: 'Hotel Status Changed',
        details: 'Changed Lemon Tree Premier status from Active to Suspended',
        category: 'hotel',
    },
    {
        id: 'log-002',
        timestamp: '2026-01-19T10:30:00Z',
        user: 'Priya Menon',
        action: 'Kiosk Assigned',
        details: 'Assigned kiosk ATC-SN-9988 to Royal Orchid Bangalore',
        category: 'kiosk',
    },
    {
        id: 'log-003',
        timestamp: '2026-01-19T09:15:00Z',
        user: 'System',
        action: 'Heartbeat Alert',
        details: 'Kiosk ATC-SN-7766 offline for more than 24 hours',
        category: 'alert',
    },
    {
        id: 'log-004',
        timestamp: '2026-01-18T16:00:00Z',
        user: 'Amit Patel',
        action: 'Invoice Generated',
        details: 'Generated invoice INV-2026-001 for Royal Orchid Bangalore',
        category: 'billing',
    },
    {
        id: 'log-005',
        timestamp: '2026-01-18T14:30:00Z',
        user: 'Rahul Sharma',
        action: 'User Created',
        details: 'Created new user account for sneha@atc.in',
        category: 'user',
    },
    {
        id: 'log-006',
        timestamp: '2026-01-18T11:00:00Z',
        user: 'Priya Menon',
        action: 'Hotel Onboarded',
        details: 'Onboarded new hotel: Sayaji Hotel, Indore',
        category: 'hotel',
    },
    {
        id: 'log-007',
        timestamp: '2026-01-17T15:20:00Z',
        user: 'Amit Patel',
        action: 'Role Modified',
        details: 'Updated permissions for Operations Manager role',
        category: 'user',
    },
    {
        id: 'log-008',
        timestamp: '2026-01-17T12:00:00Z',
        user: 'System',
        action: 'Subscription Renewed',
        details: 'Auto-renewed subscription for Taj Palace',
        category: 'billing',
    },
    {
        id: 'log-009',
        timestamp: '2026-01-16T09:30:00Z',
        user: 'Priya Menon',
        action: 'Kiosk Firmware Update',
        details: 'Scheduled firmware update for 5 kiosks',
        category: 'kiosk',
    },
    {
        id: 'log-010',
        timestamp: '2026-01-15T14:45:00Z',
        user: 'Rahul Sharma',
        action: 'User Deactivated',
        details: 'Deactivated user account for ex-employee@atc.in',
        category: 'user',
    },
    {
        id: 'log-011',
        timestamp: '2026-01-15T10:00:00Z',
        user: 'System',
        action: 'Payment Failed',
        details: 'Payment retry failed for Lemon Tree Premier',
        category: 'alert',
    },
    {
        id: 'log-012',
        timestamp: '2026-01-14T16:30:00Z',
        user: 'Amit Patel',
        action: 'Plan Created',
        details: 'Created new subscription plan: Enterprise Plus',
        category: 'billing',
    },
];

type Category = 'all' | 'hotel' | 'kiosk' | 'alert' | 'billing' | 'user';

function CategoryBadge({ category }: { category: string }) {
    const styles: Record<string, string> = {
        hotel: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        kiosk: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        alert: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        billing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        user: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[category] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
            {category}
        </span>
    );
}

// Export Dropdown Component
function ExportDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { addToast } = useToast();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (format: 'pdf' | 'excel') => {
        addToast('info', 'Exporting...', `Generating ${format.toUpperCase()} export of audit logs...`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors"
            >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Export as PDF
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Export as Excel
                    </button>
                </div>
            )}
        </div>
    );
}

// Pagination Footer Component
function PaginationFooter({
    currentPage,
    totalPages,
    rowsPerPage,
    totalItems,
    onPageChange,
    onRowsPerPageChange,
}: {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
}) {
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Rows per page:</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                    {totalItems > 0 ? `${startItem}–${endItem} of ${totalItems}` : '0 items'}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-slate-500" />
                    </button>
                    <span className="px-2 text-sm text-slate-700 dark:text-slate-300">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AuditPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter logs
    const filteredLogs = MOCK_AUDIT_LOGS
        .filter(log => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    log.user.toLowerCase().includes(query) ||
                    log.action.toLowerCase().includes(query) ||
                    log.details.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .filter(log => categoryFilter === 'all' || log.category === categoryFilter);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / rowsPerPage));
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, rowsPerPage]);

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Audit Logs</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Security and activity log (read-only)</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportDropdown />
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                {/* Filters */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as Category)}
                        className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                    >
                        <option value="all">All Categories</option>
                        <option value="hotel">Hotel</option>
                        <option value="kiosk">Kiosk</option>
                        <option value="billing">Billing</option>
                        <option value="user">User</option>
                        <option value="alert">Alert</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    Timestamp
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    User
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    Action
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    Category
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {paginatedLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        No audit logs found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {new Date(log.timestamp).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {log.user === 'System' ? (
                                                    <Activity className="w-4 h-4 text-slate-400" />
                                                ) : (
                                                    <User className="w-4 h-4 text-slate-400" />
                                                )}
                                                <span className="text-sm text-slate-900 dark:text-white">{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{log.action}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <CategoryBadge category={log.category} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">{log.details}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <PaginationFooter
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    totalItems={filteredLogs.length}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                />
            </div>
        </div>
    );
}
