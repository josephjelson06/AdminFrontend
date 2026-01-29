'use client';

/**
 * HotelList Component
 * 
 * Main component for displaying the hotels table with all features.
 * Uses the new Card component and shared Badge.
 */

import { MapPin, Search, Plus } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/ui/DataTable';
import { Card } from '@/components/shared/ui/Card';
import { useHotels } from './useHotels';
import { useHotelActions } from './useHotelActions';
import { HotelStatusBadge } from './HotelStatusBadge';
import { HotelFiltersBar } from './HotelFilters';
import { HotelActionsMenu } from './HotelActionsMenu';
import { HotelModals } from './HotelModals';
import type { Hotel } from '@/types/schema';

interface HotelListProps {
    pageSize?: number;
}

export function HotelList({ pageSize = 10 }: HotelListProps) {
    // Data fetching
    const {
        hotels,
        isLoading,
        error,
        page,
        totalPages,
        setPage,
        filters,
        setFilter,
        clearFilters,
        toggleSort,
        sortBy,
        sortOrder,
        refresh,
    } = useHotels({ initialPageSize: pageSize });

    // Actions
    const actions = useHotelActions(refresh);

    // Check if any filters are active
    const hasActiveFilters = Boolean(filters.search || filters.status || filters.plan);

    // Column definitions
    const columns: Column<Hotel>[] = [
        {
            id: 'name',
            header: 'Hotel Name',
            accessor: (hotel) => (
                <div>
                    <div className="font-medium text-primary">{hotel.name}</div>
                    <div className="text-xs text-muted md:hidden">{hotel.location}</div>
                </div>
            ),
        },
        {
            id: 'location',
            header: 'Location',
            accessor: (hotel) => (
                <div className="flex items-center gap-1 text-secondary-text">
                    <MapPin className="w-3.5 h-3.5" />
                    {hotel.city}
                </div>
            ),
            hideOnMobile: true,
        },
        {
            id: 'plan',
            header: 'Plan',
            accessor: (hotel) => (
                <span className="capitalize text-secondary-text">{hotel.plan}</span>
            ),
            hideOnMobile: true,
        },
        {
            id: 'kioskCount',
            header: 'Kiosks',
            accessor: (hotel) => (
                <span className="font-medium text-primary">{hotel.kioskCount}</span>
            ),
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (hotel) => <HotelStatusBadge status={hotel.status} />,
        },
        {
            id: 'actions',
            header: 'Actions',
            accessor: (hotel) => (
                <HotelActionsMenu
                    hotel={hotel}
                    onEdit={actions.openEditModal}
                    onDelete={actions.openDeleteModal}
                    onImpersonate={actions.openImpersonateModal}
                />
            ),
            className: 'w-16 text-right',
        },
    ];

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-primary">Hotels Registry</h1>
                    <p className="text-sm text-muted">
                        Manage hotel tenants and subscriptions
                    </p>
                </div>
                <button
                    onClick={actions.openAddModal}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    Add Hotel
                </button>
            </div>

            {/* Table Card */}
            <Card padding="none" className="overflow-hidden">
                {/* Filters */}
                <HotelFiltersBar
                    filters={filters}
                    onFilterChange={setFilter}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable
                        data={hotels}
                        columns={columns}
                        getRowKey={(hotel) => hotel.id}
                        emptyIcon={<Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />}
                        emptyTitle="No hotels found"
                    />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-glass">
                        <span className="text-sm text-muted">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                                className="px-3 py-1 text-sm glass-hover rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages}
                                className="px-3 py-1 text-sm glass-hover rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Modals */}
            <HotelModals actions={actions} />

            {/* Error display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error.message}
                </div>
            )}
        </>
    );
}
