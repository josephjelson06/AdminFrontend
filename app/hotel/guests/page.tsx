'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import {
    Search,
    Calendar,
    Download,
    Filter,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle,
    X,
    Clock,
    Globe,
    CreditCard,
    BedDouble,
    Loader2,
} from 'lucide-react';
import {
    MOCK_GUEST_CHECKINS,
    GuestCheckIn,
    getVerificationColor,
} from '@/lib/hotel/hotel-data';
import { useToast } from '@/components/shared/ui/Toast';
import { Pagination } from '@/components/shared/ui/Pagination';
import { useEffect } from 'react';

// Date filter options
const DATE_FILTERS = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'This Week' },
    { id: 'custom', label: 'Custom' },
];

// Verification status options
const STATUS_FILTERS = [
    { id: 'all', label: 'All', color: 'bg-slate-500' },
    { id: 'verified', label: 'Verified', color: 'bg-emerald-500' },
    { id: 'manual', label: 'Manual', color: 'bg-amber-500' },
    { id: 'failed', label: 'Failed', color: 'bg-rose-500' },
];

function VerificationBadge({ status }: { status: string }) {
    const config = {
        verified: { icon: CheckCircle2, label: 'Verified' },
        manual: { icon: AlertCircle, label: 'Manual' },
        failed: { icon: XCircle, label: 'Failed' },
    };

    const { icon: Icon, label } = config[status as keyof typeof config] || config.verified;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${getVerificationColor(status as any)}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
        </span>
    );
}

// Guest Detail Modal
function GuestDetailModal({
    guest,
    onClose,
}: {
    guest: GuestCheckIn | null;
    onClose: () => void;
}) {
    if (!guest) return null;

    const statusConfig = {
        verified: { icon: CheckCircle2, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', label: 'ID Verified' },
        manual: { icon: AlertCircle, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Manual Override' },
        failed: { icon: XCircle, bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', label: 'Verification Failed' },
    };

    const status = statusConfig[guest.verification];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{guest.guestName}</h2>
                            <p className="text-white/80 text-sm">Room {guest.roomNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Status Banner */}
                <div className={`mx-5 -mt-4 p-4 rounded-xl ${status.bg} flex items-center gap-3 relative z-10 shadow-lg`}>
                    <status.icon className={`w-5 h-5 ${status.text}`} />
                    <div>
                        <p className={`font-semibold ${status.text}`}>{status.label}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Check-in completed {guest.checkInTime}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <CreditCard className="w-3.5 h-3.5" />
                                Booking ID
                            </p>
                            <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">{guest.bookingId}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <BedDouble className="w-3.5 h-3.5" />
                                Room
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{guest.roomNumber}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" />
                                Language
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{guest.language}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Time
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{guest.checkInTime}</p>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Kiosk Used</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-sm text-slate-900 dark:text-white">{guest.kioskId === 'kiosk-001' ? 'Lobby Kiosk 1' : 'Lobby Kiosk 2'}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Close
                    </button>
                    <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">
                        View Booking
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GuestsPage() {
    const { addToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('today');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedGuest, setSelectedGuest] = useState<GuestCheckIn | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter guests
    const filteredGuests = MOCK_GUEST_CHECKINS.filter((guest) => {
        const matchesSearch =
            guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.roomNumber.includes(searchQuery);

        const matchesStatus = statusFilter === 'all' || guest.verification === statusFilter;

        return matchesSearch && matchesStatus;
        return matchesSearch && matchesStatus;
    });

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, dateFilter]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
    const paginatedGuests = filteredGuests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleExport = async () => {
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsExporting(false);
        addToast('success', 'Export Complete', 'Guest log downloaded as CSV');
    };

    // Stats
    const stats = {
        total: MOCK_GUEST_CHECKINS.length,
        verified: MOCK_GUEST_CHECKINS.filter(g => g.verification === 'verified').length,
        manual: MOCK_GUEST_CHECKINS.filter(g => g.verification === 'manual').length,
        failed: MOCK_GUEST_CHECKINS.filter(g => g.verification === 'failed').length,
    };

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
            <div className="grid grid-cols-4 gap-3 mb-6">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`p-3 rounded-xl text-center transition-all ${statusFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                        }`}
                >
                    <div className={`text-xl font-bold ${statusFilter === 'all' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{stats.total}</div>
                    <div className={`text-xs ${statusFilter === 'all' ? 'text-white/80' : 'text-slate-500'}`}>Total</div>
                </button>
                <button
                    onClick={() => setStatusFilter('verified')}
                    className={`p-3 rounded-xl text-center transition-all ${statusFilter === 'verified'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                        }`}
                >
                    <div className={`text-xl font-bold ${statusFilter === 'verified' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>{stats.verified}</div>
                    <div className={`text-xs ${statusFilter === 'verified' ? 'text-white/80' : 'text-slate-500'}`}>Verified</div>
                </button>
                <button
                    onClick={() => setStatusFilter('manual')}
                    className={`p-3 rounded-xl text-center transition-all ${statusFilter === 'manual'
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                        }`}
                >
                    <div className={`text-xl font-bold ${statusFilter === 'manual' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`}>{stats.manual}</div>
                    <div className={`text-xs ${statusFilter === 'manual' ? 'text-white/80' : 'text-slate-500'}`}>Manual</div>
                </button>
                <button
                    onClick={() => setStatusFilter('failed')}
                    className={`p-3 rounded-xl text-center transition-all ${statusFilter === 'failed'
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                        }`}
                >
                    <div className={`text-xl font-bold ${statusFilter === 'failed' ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`}>{stats.failed}</div>
                    <div className={`text-xs ${statusFilter === 'failed' ? 'text-white/80' : 'text-slate-500'}`}>Failed</div>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, booking ID, or room..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {DATE_FILTERS.map((filter) => (
                                <option key={filter.id} value={filter.id}>{filter.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Guest Cards (Mobile) */}
            <div className="space-y-3 sm:hidden">
                {paginatedGuests.map((guest, index) => (
                    <button
                        key={guest.id}
                        onClick={() => setSelectedGuest(guest)}
                        className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white">
                                        {guest.guestName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{guest.guestName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Room {guest.roomNumber}</p>
                                </div>
                            </div>
                            <VerificationBadge status={guest.verification} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>{guest.checkInTime}</span>
                            <span>{guest.language}</span>
                        </div>
                    </button>
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
                                        <VerificationBadge status={guest.verification} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredGuests.length === 0 && (
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
                {filteredGuests.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredGuests.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
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


