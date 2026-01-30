'use client';

/**
 * SupportList Component
 * 
 * Main component for the helpdesk page.
 */

import { useState, useMemo } from 'react';
import { LifeBuoy, Inbox } from 'lucide-react';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useSupport } from './useSupport';
import { TicketCard } from './TicketCard';
import { TicketDetailSlideOver } from './TicketDetailSlideOver';
import type { TicketFilterStatus } from '@/lib/services/supportService';

// Filter tab component
function FilterTab({
    label,
    count,
    isActive,
    onClick,
}: {
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 text-sm transition-colors ${isActive
                ? 'font-bold text-primary'
                : 'font-medium text-muted hover:text-secondary-text'
                }`}
        >
            {label}
            <span
                className={`px-2 py-0.5 rounded-md text-xs font-bold ${isActive ? 'bg-primary text-inverse' : 'surface-glass-soft text-muted'
                    }`}
            >
                {count}
            </span>
        </button>
    );
}

export function SupportList() {
    const {
        tickets,
        isLoading,
        stats,
        filterStatus,
        setFilterStatus,
        selectedTicket,
        selectTicket,
    } = useSupport();

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    // Paginated data
    const { paginatedTickets, totalPages } = useMemo(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
            paginatedTickets: tickets.slice(start, end),
            totalPages: Math.ceil(tickets.length / pageSize)
        };
    }, [tickets, page, pageSize]);

    // Reset to page 1 when filter changes
    useMemo(() => {
        setPage(1);
    }, [filterStatus]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <LifeBuoy className="w-6 h-6 text-success" />
                        Helpdesk
                    </h1>
                    <p className="text-sm text-muted mt-1">Support tickets and hotel inquiries</p>
                </div>
                <div className="flex gap-3">
                    <div className="badge-danger flex items-center gap-2 px-4 py-2 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        {stats.critical} Critical
                    </div>
                    <div className="badge-default flex items-center gap-2 px-4 py-2 text-sm font-medium">
                        <Inbox className="w-4 h-4" />
                        {stats.open} Open
                    </div>
                </div>
            </div>

            {/* Filters & Content */}
            <div className="flex flex-col gap-6">
                {/* Top Filters */}
                <div className="flex flex-wrap items-center gap-6 px-1">
                    <FilterTab
                        label="All Tickets"
                        count={stats.total}
                        isActive={filterStatus === 'all'}
                        onClick={() => setFilterStatus('all')}
                    />
                    <FilterTab
                        label="Open / Pending"
                        count={stats.open}
                        isActive={filterStatus === 'open'}
                        onClick={() => setFilterStatus('open')}
                    />
                    <FilterTab
                        label="Resolved"
                        count={stats.resolved}
                        isActive={filterStatus === 'resolved'}
                        onClick={() => setFilterStatus('resolved')}
                    />
                </div>

                {/* Ticket List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onClick={() => selectTicket(ticket)}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {tickets.length > 0 && (
                    <PaginationBar
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={tickets.length}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        pageSizeOptions={[6, 8, 12, 16]}
                    />
                )}
            </div>

            <TicketDetailSlideOver
                isOpen={!!selectedTicket}
                onClose={() => selectTicket(null)}
                ticket={selectedTicket}
            />
        </div>
    );
}
