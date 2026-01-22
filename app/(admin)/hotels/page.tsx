'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Building2,
    MapPin,
    Mail,
    Phone,
    ExternalLink,
    MoreVertical,
    Rocket,
    Search,
    Filter,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Calendar,
    UserCheck,
    Eye,
    Edit3,
    KeyRound,
    History,
    Ban,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { MOCK_HOTELS } from '@/lib/admin/mock-data';
import type { Status, Hotel } from '@/types/schema';
import { EditHotelModal } from '@/components/admin/modals/EditHotelModal';
import { OnboardingWizard } from '@/components/admin/modals/OnboardingWizard';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { ImpersonationModal } from '@/components/admin/modals/ImpersonationModal';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';

function StatusBadge({ status }: { status: Status }) {
    const styles: Record<Status, string> = {
        active: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        inactive: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
        suspended: 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
        pending: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
        onboarding: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

// Sort type definition
type SortField = 'name' | 'status' | 'onboarded' | 'city';
type SortDirection = 'asc' | 'desc';

// Pagination constants
const ITEMS_PER_PAGE = 10;

export default function HotelsPage() {
    const router = useRouter();
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editHotel, setEditHotel] = useState<Hotel | null>(null);
    const [suspendHotel, setSuspendHotel] = useState<Hotel | null>(null);
    const [impersonateHotel, setImpersonateHotel] = useState<Hotel | null>(null);
    const { addToast } = useToast();

    // Search, filter, and sort state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
    const [cityFilter, setCityFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Get unique cities for filter dropdown
    const uniqueCities = useMemo(() => {
        const cities = [...new Set(MOCK_HOTELS.map(h => h.city))];
        return cities.sort();
    }, []);

    // Filter and sort hotels
    const filteredHotels = useMemo(() => {
        let result = [...MOCK_HOTELS];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(hotel =>
                hotel.name.toLowerCase().includes(query) ||
                hotel.city.toLowerCase().includes(query) ||
                hotel.contactEmail.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(hotel => hotel.status === statusFilter);
        }

        // City filter
        if (cityFilter !== 'all') {
            result = result.filter(hotel => hotel.city === cityFilter);
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'onboarded':
                    comparison = new Date(a.onboardedDate).getTime() - new Date(b.onboardedDate).getTime();
                    break;
                case 'city':
                    comparison = a.city.localeCompare(b.city);
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [searchQuery, statusFilter, cityFilter, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
    const paginatedHotels = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredHotels.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredHotels, currentPage]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, cityFilter]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
        return sortDirection === 'asc'
            ? <ArrowUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            : <ArrowDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    };

    const handleSuspend = () => {
        if (suspendHotel) {
            addToast('warning', 'Hotel Suspended', `${suspendHotel.name} has been suspended.`);
            setSuspendHotel(null);
        }
    };

    const handleImpersonate = (hotel: Hotel) => {
        addToast('info', 'Accessing Hotel Panel', `Logging in as admin for ${hotel.name}...`);
        // In real app, this would redirect to the hotel panel with impersonation token
        router.push(`/hotel/${hotel.id}/dashboard`);
    };

    const formatOnboardedDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const openGoogleMaps = (location: string) => {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, '_blank');
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Hotel Registry</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage all registered hotels • {filteredHotels.length} of {MOCK_HOTELS.length} shown
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors"
                    >
                        <Rocket className="w-4 h-4" />
                        Add Hotel
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search hotels by name, city, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                            <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
                        className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="onboarding">Onboarding</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {/* City Filter */}
                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Cities</option>
                        {uniqueCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <th
                                onClick={() => handleSort('name')}
                                className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Hotel
                                    <SortIcon field="name" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('status')}
                                className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Status
                                    <SortIcon field="status" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('onboarded')}
                                className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Onboarded
                                    <SortIcon field="onboarded" />
                                </div>
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Contact
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {paginatedHotels.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                        <p className="text-sm text-slate-500 dark:text-slate-400">No hotels found matching your criteria</p>
                                        <button
                                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCityFilter('all'); }}
                                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedHotels.map((hotel) => (
                            <tr
                                key={hotel.id}
                                onClick={() => router.push(`/hotels/${hotel.id}`)}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                            >
                                {/* Hotel Info */}
                                <td className="px-4 py-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {hotel.name}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                {hotel.city}, {hotel.state}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <StatusBadge status={hotel.status} />
                                </td>

                                {/* Onboarded Date */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatOnboardedDate(hotel.onboardedDate)}
                                    </div>
                                </td>

                                {/* Contact Cluster */}
                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-2">
                                        {/* Email */}
                                        <a
                                            href={`mailto:${hotel.contactEmail}`}
                                            title={hotel.contactEmail}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                                        >
                                            <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400" />
                                        </a>
                                        {/* Phone */}
                                        <a
                                            href={`tel:${hotel.contactPhone}`}
                                            title={hotel.contactPhone}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                                        >
                                            <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400" />
                                        </a>
                                        {/* Location */}
                                        <button
                                            onClick={() => openGoogleMaps(hotel.location)}
                                            title={`Open ${hotel.location} in Google Maps`}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                                        >
                                            <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400" />
                                        </button>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center gap-1">
                                        {/* Primary Action: Login as Admin */}
                                        <button
                                            onClick={() => setImpersonateHotel(hotel)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                                        >
                                            <UserCheck className="w-3.5 h-3.5" />
                                            Login as Admin
                                        </button>

                                        {/* Overflow Menu */}
                                        <Dropdown
                                            trigger={
                                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                                                    <MoreVertical className="w-4 h-4 text-slate-400" />
                                                </button>
                                            }
                                            align="right"
                                        >
                                            <DropdownItem onClick={() => router.push(`/hotels/${hotel.id}`)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </DropdownItem>
                                            <DropdownItem onClick={() => setEditHotel(hotel)}>
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Edit Hotel
                                            </DropdownItem>
                                            <DropdownItem onClick={() => addToast('info', 'Reset Password', 'Password reset email sent to hotel admin.')}>
                                                <KeyRound className="w-4 h-4 mr-2" />
                                                Reset Password
                                            </DropdownItem>
                                            <DropdownItem onClick={() => addToast('info', 'Audit Log', 'Opening audit log for this hotel...')}>
                                                <History className="w-4 h-4 mr-2" />
                                                View Audit Log
                                            </DropdownItem>
                                            <DropdownItem
                                                variant="danger"
                                                onClick={() => setSuspendHotel(hotel)}
                                            >
                                                <Ban className="w-4 h-4 mr-2" />
                                                Suspend Service
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div>
                    Showing <span className="font-medium text-slate-700 dark:text-slate-300">{paginatedHotels.length}</span> of{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-300">{filteredHotels.length}</span> hotels
                    {filteredHotels.length !== MOCK_HOTELS.length && (
                        <span className="ml-1">(filtered from {MOCK_HOTELS.length} total)</span>
                    )}
                </div>
            </div>

            {/* Onboarding Wizard */}
            <OnboardingWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
            />

            {/* Edit Modal */}
            <EditHotelModal
                isOpen={!!editHotel}
                onClose={() => setEditHotel(null)}
                hotel={editHotel}
            />

            {/* Impersonation Modal */}
            <ImpersonationModal
                isOpen={!!impersonateHotel}
                onClose={() => setImpersonateHotel(null)}
                hotel={impersonateHotel}
                onConfirm={handleImpersonate}
            />

            {/* Suspend Confirm */}
            <ConfirmModal
                isOpen={!!suspendHotel}
                onClose={() => setSuspendHotel(null)}
                onConfirm={handleSuspend}
                title="Suspend Hotel Service"
                message={`Are you sure you want to suspend service for ${suspendHotel?.name}? Their kiosks will go offline and admins will lose portal access.`}
                confirmLabel="Suspend Service"
                variant="danger"
            />
        </div>
    );
}
