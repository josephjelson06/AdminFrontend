'use client';

/**
 * SubscriptionList Component
 * 
 * Main component for managing subscriptions with card-based layout.
 */

import { GlassCard } from '@/components/shared/ui/GlassCard';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useSubscriptions, TabType } from './useSubscriptions';
import { SubscriptionMetricsCards } from './SubscriptionMetricsCards';
import { SubscriptionCard } from './SubscriptionCard';
import { SubscriptionFiltersBar } from './SubscriptionFilters';
import { Skeleton } from '@/components/shared/ui/Skeleton';

export function SubscriptionList() {
    const {
        subscriptions,
        isLoading,
        error,
        metrics,
        tabCounts,
        activeTab,
        setActiveTab,
        page,
        pageSize,
        totalPages,
        totalItems,
        setPage,
        setPageSize,
        filters,
        setFilter,
    } = useSubscriptions();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Subscriptions</h1>
                    <p className="text-sm text-muted">Track entitlements and subscription status</p>
                </div>
            </div>

            {/* Metrics Cards */}
            <SubscriptionMetricsCards metrics={metrics} />

            {/* Filters Toolbar */}
            <SubscriptionFiltersBar
                search={filters.search}
                onSearchChange={(value) => setFilter('search', value)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabCounts={tabCounts}
                plan={filters.plan}
                onPlanChange={(value) => setFilter('plan', value as typeof filters.plan)}
                status={filters.status}
                onStatusChange={(value) => setFilter('status', value as typeof filters.status)}
            />

            {/* Subscription Cards Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-72 rounded-2xl" />
                    ))}
                </div>
            ) : subscriptions.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <p className="text-muted">No subscriptions found matching filters</p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {subscriptions.map((subscription) => (
                        <SubscriptionCard
                            key={subscription.hotelId}
                            subscription={subscription}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {subscriptions.length > 0 && (
                <PaginationBar
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[8, 12, 16, 24]}
                />
            )}

            {/* Error display */}
            {error && (
                <GlassCard className="border-danger/30 bg-danger/5">
                    <p className="text-danger text-sm">{error.message}</p>
                </GlassCard>
            )}
        </div>
    );
}
