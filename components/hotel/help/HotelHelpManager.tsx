'use client';

/**
 * HotelHelpManager Component
 * 
 * Main help and support management component.
 */

import {
    HelpCircle,
    MessageSquare,
    Book,
    Video,
    ChevronDown,
    ChevronRight,
    Phone,
    Mail,
    Clock,
    CheckCircle2,
    Send,
    Loader2,
} from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useHotelHelp } from './useHotelHelp';
import { useToast } from '@/components/shared/ui/Toast';

// FAQ Accordion Item
function FAQItem({
    question,
    answer,
    isOpen,
    onToggle
}: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 text-left group"
            >
                <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-4">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="pb-4 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {answer}
                    </p>
                </div>
            )}
        </div>
    );
}

// Quick Help Card
function QuickHelpCard({
    icon: Icon,
    title,
    description,
    action,
    onClick,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    action: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group"
        >
            <div className="flex items-start gap-4">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/70 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        {action}
                        <ChevronRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </button>
    );
}

export function HotelHelpManager() {
    const { addToast } = useToast();
    const {
        faqs,
        tickets,
        openFaqIndex,
        setOpenFaqIndex,
        showContactForm,
        setShowContactForm,
        contactSubject,
        setContactSubject,
        contactMessage,
        setContactMessage,
        sendMessage,
        isLoading,
        isSending,
    } = useHotelHelp();

    const handleSendMessage = async () => {
        if (!contactSubject.trim() || !contactMessage.trim()) {
            addToast('error', 'Error', 'Please fill in all fields');
            return;
        }
        const success = await sendMessage();
        if (success) {
            addToast('success', 'Message Sent', 'Our support team will respond within 24 hours.');
        }
    };

    if (isLoading) {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    return (
        <HotelLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Get help with your hotel panel or contact our support team
                </p>
            </div>

            <div className="space-y-6">
                {/* Quick Help Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickHelpCard
                        icon={Book}
                        title="User Guide"
                        description="Step-by-step documentation for all features"
                        action="Read Guide"
                        onClick={() => addToast('info', 'Opening', 'User guide opening...')}
                    />
                    <QuickHelpCard
                        icon={Video}
                        title="Video Tutorials"
                        description="Watch quick tutorials on common tasks"
                        action="Watch Videos"
                        onClick={() => addToast('info', 'Opening', 'Video tutorials opening...')}
                    />
                    <QuickHelpCard
                        icon={MessageSquare}
                        title="Contact Support"
                        description="Chat with our support team directly"
                        action="Start Chat"
                        onClick={() => setShowContactForm(true)}
                    />
                </div>

                {/* FAQ Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Quick answers to common questions
                            </p>
                        </div>
                    </div>

                    <div>
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openFaqIndex === index}
                                onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                {showContactForm && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                    <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Send a Message
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        We typically respond within 24 hours
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={contactSubject}
                                    onChange={(e) => setContactSubject(e.target.value)}
                                    placeholder="What do you need help with?"
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Message
                                </label>
                                <textarea
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Describe your issue in detail..."
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow"
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={isSending}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        ATC Support Team
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">+91 800-123-4567</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">support@atc.in</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Hours</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Mon-Sat, 9AM-6PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticket Status */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Recent Tickets
                    </h3>
                    <div className="space-y-3">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{ticket.subject}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Ticket #{ticket.id} • {ticket.createdAt}</p>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ticket.status === 'resolved'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}>
                                    {ticket.status === 'resolved' ? 'Resolved' : 'Open'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </HotelLayout>
    );
}
