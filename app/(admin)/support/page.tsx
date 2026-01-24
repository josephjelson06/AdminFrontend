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
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <LifeBuoy className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        Helpdesk
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Support tickets and hotel inquiries
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-xl text-sm font-medium border border-rose-100 dark:border-rose-900/50">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        {criticalCount} Critical
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-medium border border-blue-100 dark:border-blue-900/50">
                        <Inbox className="w-4 h-4" />
                        {openCount} Open
                    </div>
                </div>
            </div>

            {/* Filters & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Filter */}
                <GlassCard className="p-2 flex flex-col gap-1 h-fit">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-slate-900 dark:bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className="flex items-center gap-2"><Inbox className="w-4 h-4" /> All Tickets</span>
                        <span className="opacity-70">{MOCK_TICKETS.length}</span>
                    </button>
                    <button
                        onClick={() => setFilterStatus('open')}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'open' ? 'bg-slate-900 dark:bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Open / Pending</span>
                        <span className="opacity-70">{openCount}</span>
                    </button>
                    <button
                        onClick={() => setFilterStatus('resolved')}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'resolved' ? 'bg-slate-900 dark:bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Resolved</span>
                        <span className="opacity-70">{MOCK_TICKETS.length - openCount}</span>
                    </button>
                </GlassCard>

                {/* Ticket List */}
                <div className="lg:col-span-3 space-y-4">
                    {filteredTickets.map((ticket) => (
                        <GlassCard
                            key={ticket.id}
                            className="p-5 hover:border-emerald-500/30 cursor-pointer transition-all group"
                            onClick={() => setSelectedTicket(ticket)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${ticket.priority === 'critical' || ticket.priority === 'high' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{ticket.ticketNumber}</span>
                                        <span className="text-xs text-slate-400">•</span>
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{ticket.hotelName}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {ticket.subject}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                                        {ticket.messages[ticket.messages.length - 1].message}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {ticket.lastUpdate}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" /> {ticket.messages.length} messages
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            ticket.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                        {ticket.status}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
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
