'use client';

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

    const actions = useHotelActions(refresh);
    const hasActiveFilters = Boolean(filters.search || filters.status || filters.plan);

    return (
        <div className="space-y-6">
            {/* Header with Premium 'Add Hotel' Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
                        Hotels Registry
                    </h1>
                    <p className="text-sm text-blue-200/70 font-medium">
                        Manage hotel tenants, subscriptions, and kiosk deployments
                    </p>
                </div>
                
                {/* NEW PREMIUM BUTTON */}
                <button
                    onClick={actions.openAddModal}
                    className="group relative shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] 
                    hover:bg-right hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] 
                    active:scale-95 border border-white/20 backdrop-blur-md"
                >
                    <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Plus className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Add New Hotel</span>
                </button>
            </div>

            {/* Filters */}
            <GlassCard padding="none" className="border-white/10">
                <HotelFiltersBar
                    filters={filters}
                    onFilterChange={setFilter}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />
            </GlassCard>

            {/* Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-400 border-t-transparent shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                        <p className="text-sm text-blue-200/80 animate-pulse">Loading hotels...</p>
                    </div>
                </div>
            ) : hotels.length === 0 ? (
                <GlassCard className="py-20 text-center border-white/10">
                    <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 shadow-inner border border-white/5">
                        <Building2 className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No hotels found</h3>
                    <p className="text-sm text-blue-200/60 mb-8 max-w-sm mx-auto">
                        {hasActiveFilters
                            ? 'Try adjusting your search filters'
                            : 'Get started by adding your first hotel to the registry'
                        }
                    </p>
                    {hasActiveFilters ? (
                        <button onClick={clearFilters} className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all">
                            Clear Filters
                        </button>
                    ) : (
                        <button onClick={actions.openAddModal} className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all">
                            Add Your First Hotel
                        </button>
                    )}
                </GlassCard>
            ) : (
                <>
                    <div className="flex items-center justify-between px-2">
                        <p className="text-sm text-blue-200/60">
                            Showing <span className="font-bold text-white">{hotels.length}</span> of{' '}
                            <span className="font-bold text-white">{totalItems}</span> properties
                        </p>
                    </div>

                    {/* Cards Grid with Z-Index Fix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {hotels.map((hotel, index) => (
                            <div
                                key={hotel.id}
                                // hover:z-50 prevents the card from being clipped by the next one when it scales up
                                className="relative hover:z-50 transition-all duration-300"
                                style={{ 
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s backwards` 
                                }}
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

                    {hotels.length > 0 && (
                        <div className="pt-4">
                            <PaginationBar
                                currentPage={page}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                pageSize={currentPageSize}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                                pageSizeOptions={[8, 12, 16, 24]}
                            />
                        </div>
                    )}
                </>
            )}

            <HotelModals actions={actions} />

            {error && (
                <GlassCard className="border-red-500/30 bg-red-500/10 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-red-200">
                        <div className="shrink-0 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                        <p className="text-sm font-medium">{error.message}</p>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}