'use client';

/**
 * HotelList Component
 * 
 * Main component for displaying hotels in a responsive card grid layout.
 * Features quick action buttons for location, phone, and email.
 */

import { Search, Plus, Building2 } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useHotels } from './useHotels';
import { useHotelActions } from './useHotelActions';
import { HotelCard } from './HotelCard';
import { HotelFiltersBar } from './HotelFilters';
import { HotelModals } from './HotelModals';

interface HotelListProps {
    pageSize?: number;
}

export function HotelList({ pageSize = 12 }: HotelListProps) {
    // Data fetching
    const {
        hotels,
        isLoading,
        error,
        page,
        pageSize: currentPageSize,
        totalPages,
        totalItems,
        setPage,
        setPageSize,
        filters,
        setFilter,
        clearFilters,
        refresh,
    } = useHotels({ initialPageSize: pageSize });

    // Actions
    const actions = useHotelActions(refresh);

    // Check if any filters are active
    const hasActiveFilters = Boolean(filters.search || filters.status || filters.plan);

    return (
        <div className="space-y-4">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-primary">Hotels Registry</h1>
                    <p className="text-sm text-muted">
                        Manage hotel tenants, subscriptions, and kiosk deployments
                    </p>
                </div>
                <button
                    onClick={actions.openAddModal}
                    className="btn-primary shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Add Hotel
                </button>
            </div>

            {/* Filters */}
            <HotelFiltersBar
                filters={filters}
                onFilterChange={setFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {/* Hotels Card Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
                        <p className="text-sm text-muted">Loading hotels...</p>
                    </div>
                </div>
            ) : hotels.length === 0 ? (
                <GlassCard className="py-20 text-center">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                        <Building2 className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">No hotels found</h3>
                    <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
                        {hasActiveFilters
                            ? 'Try adjusting your search filters to find what you\'re looking for'
                            : 'Get started by adding your first hotel to the registry'
                        }
                    </p>
                    {hasActiveFilters ? (
                        <button
                            onClick={clearFilters}
                            className="btn-secondary"
                        >
                            Clear Filters
                        </button>
                    ) : (
                        <button
                            onClick={actions.openAddModal}
                            className="btn-primary"
                        >
                            <Plus className="w-4 h-4" />
                            Add Your First Hotel
                        </button>
                    )}
                </GlassCard>
            ) : (
                <>
                    {/* Results Count */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted">
                            Showing <span className="font-medium text-primary">{hotels.length}</span> of{' '}
                            <span className="font-medium text-primary">{totalItems}</span> hotels
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {hotels.map((hotel, index) => (
                            <div
                                key={hotel.id}
                                className="animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
                            >
                                <HotelCard
                                    hotel={hotel}
                                    onEdit={actions.openEditModal}
                                    onDelete={actions.openDeleteModal}
                                    onImpersonate={actions.openImpersonateModal}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {hotels.length > 0 && (
                        <PaginationBar
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            pageSize={currentPageSize}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                            pageSizeOptions={[8, 12, 16, 24]}
                        />
                    )}
                </>
            )}

            {/* Modals */}
            <HotelModals actions={actions} />

            {/* Error display */}
            {error && (
                <GlassCard className="border-red-500/30 bg-red-500/5">
                    <div className="flex items-center gap-3 text-red-500 dark:text-red-400">
                        <div className="shrink-0 w-2 h-2 rounded-full bg-red-500" />
                        <p className="text-sm">{error.message}</p>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
