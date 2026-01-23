'use client';

import { useState } from 'react';
import { SlideOver } from '@/components/shared/ui/SlideOver';
import {
    Send,
    Paperclip,
    User,
    Headphones,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { type SupportTicket, type TicketPriority, type TicketStatus } from '@/lib/admin/support-data';
import { useToast } from '@/components/shared/ui/Toast';

interface TicketDetailProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: SupportTicket | null;
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
    const colors = {
        low: 'bg-slate-100 text-slate-600',
        medium: 'bg-blue-100 text-blue-600',
        high: 'bg-amber-100 text-amber-600',
        critical: 'bg-rose-100 text-rose-600',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${colors[priority]}`}>
            {priority}
        </span>
    );
}

export function TicketDetailSlideOver({ isOpen, onClose, ticket }: TicketDetailProps) {
    const { addToast } = useToast();
    const [replyText, setReplyText] = useState('');

    if (!ticket) return null;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        // In a real app, API call here
        addToast('success', 'Reply Sent', 'Notification sent to hotel admin.');
        setReplyText('');
    };

    return (
        <SlideOver
            isOpen={isOpen}
            onClose={onClose}
            title={ticket.ticketNumber}
            subtitle={ticket.hotelName}
        >
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 -m-6">
                {/* Ticket Meta Header */}
                <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            {ticket.subject}
                        </h3>
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{ticket.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span className="capitalize">{ticket.status}</span>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {ticket.messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 ${msg.sender === 'agent' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'agent' ? 'bg-slate-900 dark:bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                                }`}>
                                {msg.sender === 'agent' ? <Headphones className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col max-w-[80%] ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                                </div>
                                <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'agent'
                                        ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                                    }`}>
                                    {msg.message}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Box */}
                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSend} className="relative">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500 resize-none h-14" // Fixed height for simplicity
                        />
                        <div className="absolute right-2 top-2 flex items-center gap-1">
                            <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <button
                                type="submit"
                                disabled={!replyText.trim()}
                                className="p-1.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                    <div className="flex items-center justify-between mt-3 px-1">
                        <div className="flex gap-2">
                            <button className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                            </button>
                            <button className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> Escalate
                            </button>
                        </div>
                        <span className="text-[10px] text-slate-400">Press Enter to send</span>
                    </div>
                </div>
            </div>
        </SlideOver>
    );
}
