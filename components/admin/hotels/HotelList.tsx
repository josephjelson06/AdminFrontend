'use client';

/**
 * HotelList Component
 * 
 * Main component for displaying hotels in a responsive card grid layout.
 * Features quick action buttons for location, phone, and email.
 */

import { Search, Plus, Grid, List } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/shared/ui/Card';
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
        totalPages,
        setPage,
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

            {/* Filters Card */}
            <Card padding="none" className="mb-6">
                <HotelFiltersBar
                    filters={filters}
                    onFilterChange={setFilter}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />
            </Card>

            {/* Hotels Card Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : hotels.length === 0 ? (
                <Card className="py-16 text-center">
                    <Search className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary mb-2">No hotels found</h3>
                    <p className="text-sm text-muted mb-4">
                        {hasActiveFilters
                            ? 'Try adjusting your search filters'
                            : 'Get started by adding your first hotel'
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
                            Add Hotel
                        </button>
                    )}
                </Card>
            ) : (
                <>
                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {hotels.map((hotel, index) => (
                            <div
                                key={hotel.id}
                                className="animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${index * 50}ms` }}
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
                    {totalPages > 1 && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-elevated rounded-xl">
                            <span className="text-sm text-muted">
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page <= 1}
                                    className="px-4 py-2 text-sm font-medium glass-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="px-4 py-2 text-sm font-medium glass-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <HotelModals actions={actions} />

            {/* Error display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                    {error.message}
                </div>
            )}
        </>
    );
}
