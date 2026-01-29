'use client';

/**
 * TicketCard Component
 * 
 * Individual ticket card display.
 */

import { Clock, MessageSquare } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import type { SupportTicket } from '@/lib/admin/support-data';

interface TicketCardProps {
    ticket: SupportTicket;
    onClick: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
    return (
        <div onClick={onClick}>
            <GlassCard className="p-5 glass-hover cursor-pointer transition-all group">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`w-2 h-2 rounded-full ${ticket.priority === 'critical' || ticket.priority === 'high'
                                        ? 'bg-danger'
                                        : 'bg-info'
                                    }`}
                            />
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
                        <div
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'open'
                                    ? 'badge-success'
                                    : ticket.status === 'new'
                                        ? 'badge-default'
                                        : 'badge-default'
                                }`}
                        >
                            {ticket.status}
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
