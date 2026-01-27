'use client';

import { useState } from 'react';
import {
    LifeBuoy,
    Inbox,
    Clock,
    CheckCircle2,
    MessageSquare
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { MOCK_TICKETS, type SupportTicket } from '@/lib/admin/support-data';
import { TicketDetailSlideOver } from '@/components/admin/support/TicketDetailSlideOver';

export default function SupportPage() {
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');

    const filteredTickets = MOCK_TICKETS.filter(t =>
        filterStatus === 'all'
            ? true
            : filterStatus === 'open' ? ['new', 'open'].includes(t.status) : t.status === 'resolved'
    );

    const openCount = MOCK_TICKETS.filter(t => ['new', 'open'].includes(t.status)).length;
    const criticalCount = MOCK_TICKETS.filter(t => t.priority === 'critical').length;

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-normal">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <LifeBuoy className="w-6 h-6 text-success" />
                        Helpdesk
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        Support tickets and hotel inquiries
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="badge-danger flex items-center gap-2 px-4 py-2 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        {criticalCount} Critical
                    </div>
                    <div className="badge-default flex items-center gap-2 px-4 py-2 text-sm font-medium">
                        <Inbox className="w-4 h-4" />
                        {openCount} Open
                    </div>
                </div>
            </div>

            {/* Filters & Content */}
            <div className="flex flex-col gap-6">
                {/* Top Filters */}
                <div className="flex flex-wrap items-center gap-6 px-1">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`flex items-center gap-2 text-sm transition-colors ${filterStatus === 'all'
                            ? 'font-bold text-primary'
                            : 'font-medium text-muted hover:text-secondary-text'
                            }`}
                    >
                        All Tickets
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${filterStatus === 'all'
                            ? 'bg-primary text-inverse'
                            : 'surface-glass-soft text-muted'
                            }`}>
                            {MOCK_TICKETS.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setFilterStatus('open')}
                        className={`flex items-center gap-2 text-sm transition-colors ${filterStatus === 'open'
                            ? 'font-bold text-primary'
                            : 'font-medium text-muted hover:text-secondary-text'
                            }`}
                    >
                        Open / Pending
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${filterStatus === 'open'
                            ? 'bg-primary text-inverse'
                            : 'surface-glass-soft text-muted'
                            }`}>
                            {openCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setFilterStatus('resolved')}
                        className={`flex items-center gap-2 text-sm transition-colors ${filterStatus === 'resolved'
                            ? 'font-bold text-primary'
                            : 'font-medium text-muted hover:text-secondary-text'
                            }`}
                    >
                        Resolved
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${filterStatus === 'resolved'
                            ? 'bg-primary text-inverse'
                            : 'surface-glass-soft text-muted'
                            }`}>
                            {MOCK_TICKETS.length - openCount}
                        </span>
                    </button>
                </div>

                {/* Ticket List */}
                <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                            <GlassCard
                                className="p-5 glass-hover cursor-pointer transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${ticket.priority === 'critical' || ticket.priority === 'high' ? 'bg-danger' : 'bg-info'}`} />
                                            <span className="text-xs font-mono text-muted">{ticket.ticketNumber}</span>
                                            <span className="text-xs text-muted">•</span>
                                            <span className="text-xs font-medium text-secondary-text">{ticket.hotelName}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-primary mb-1 group-hover:text-success transition-colors">
                                            {ticket.subject}
                                        </h3>
                                        <p className="text-sm text-muted line-clamp-1">
                                            {ticket.messages[ticket.messages.length - 1].message}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {ticket.lastUpdate}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" /> {ticket.messages.length} messages
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'open' ? 'badge-success' :
                                            ticket.status === 'new' ? 'badge-default' :
                                                'badge-default'
                                            }`}>
                                            {ticket.status}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </div>

            <TicketDetailSlideOver
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                ticket={selectedTicket}
            />
        </div>
    );
}
