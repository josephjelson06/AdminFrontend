'use client';

/**
 * HotelGuestsManager Component
 * 
 * Main guest log management component.
 */

import { useState } from 'react';
import {
    Download,
    User,
    Loader2,
    ChevronRight,
    Trash2,
} from 'lucide-react';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useHotelGuests } from './useHotelGuests';
import { GuestQuickStats } from './GuestQuickStats';
import { GuestFilters } from './GuestFilters';
import { VerificationBadge } from './VerificationBadge';
import { GuestDetailModal } from './GuestDetailModal';
import { GuestMobileCard } from './GuestMobileCard';
import { useToast } from '@/components/shared/ui/Toast';
import { DATE_FILTERS } from '@/lib/services/hotelGuestService';
import type { GuestCheckIn } from '@/lib/hotel/hotel-data';

export function HotelGuestsManager() {
    const { addToast } = useToast();
    const {
        guests,
        stats,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        dateFilter,
        setDateFilter,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        paginatedGuests,
        exportCSV,
        deleteGuest,
        isLoading,
        isExporting,
    } = useHotelGuests();

    const [selectedGuest, setSelectedGuest] = useState<GuestCheckIn | null>(null);

    const handleExport = async () => {
        const success = await exportCSV();
        if (success) {
            addToast('success', 'Export Complete', 'Guest log downloaded as CSV');
        } else {
            addToast('error', 'Export Failed', 'Could not generate CSV');
        }
    };

    if (isLoading) {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    return (
        <HotelLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Guest Log</h1>
                        <span className="text-sm font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            Showing: {DATE_FILTERS.find(f => f.id === dateFilter)?.label}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Check-in history from kiosk
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all hover:shadow-lg"
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Export CSV
                        </>
                    )}
                </button>
            </div>

            {/* Quick Stats */}
            <GuestQuickStats stats={stats} activeFilter={statusFilter} onFilterChange={setStatusFilter} />

            {/* Filters */}
            <GuestFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
            />

            {/* Guest Cards (Mobile) */}
            <div className="space-y-3 sm:hidden">
                {paginatedGuests.map((guest, index) => (
                    <GuestMobileCard
                        key={guest.id}
                        guest={guest}
                        onClick={() => setSelectedGuest(guest)}
                        animationDelay={index * 30}
                    />
                ))}
            </div>

            {/* Guest Table (Desktop) */}
            <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Guest</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Booking ID</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Room</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Language</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {paginatedGuests.map((guest, index) => (
                                <tr
                                    key={guest.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors animate-in fade-in"
                                    style={{ animationDelay: `${index * 20}ms` }}
                                    onClick={() => setSelectedGuest(guest)}
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                                                <span className="text-xs font-semibold text-white">
                                                    {guest.guestName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                {guest.guestName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                                            {guest.bookingId}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {guest.roomNumber}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            {guest.checkInTime}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            {guest.language}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <VerificationBadge status={guest.verification} />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Delete this guest log entry?')) {
                                                        deleteGuest(guest.id);
                                                    }
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                                title="Delete entry"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {guests.length === 0 && (
                    <div className="py-16 text-center">
                        <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            No guests found
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                            className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {guests.length > 0 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-lg">
                        <PaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={guests.length}
                            pageSize={rowsPerPage}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setRowsPerPage}
                            pageSizeOptions={[5, 10, 15, 25]}
                        />
                    </div>
                )}
            </div>

            {/* Guest Detail Modal */}
            <GuestDetailModal
                guest={selectedGuest}
                onClose={() => setSelectedGuest(null)}
            />
        </HotelLayout>
    );
}
