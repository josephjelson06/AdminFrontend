'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2,
    MapPin,
    Globe,
    Mail,
    ArrowLeft,
    Cpu,
    CreditCard,
    Users,
    Wifi,
    WifiOff,
    MoreVertical,
    Download
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { getHotelFullProfile } from '@/lib/admin/hotel-detail-data';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'kiosks' | 'finance' | 'support'>('overview');

    const hotel = getHotelFullProfile(id);

    if (!hotel) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hotel Not Found</h2>
                <button onClick={() => router.back()} className="text-emerald-600 hover:underline mt-2">Go Back</button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Top Navigation */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Registry
            </button>

            {/* Hotel Header Card */}
            <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                {hotel.name}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${hotel.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                        : 'bg-amber-100 text-amber-700 border-amber-200'
                                    }`}>
                                    {hotel.status.toUpperCase()}
                                </span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {hotel.location}, {hotel.city}</span>
                                {/* @ts-ignore */}
                                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {hotel.website || 'No website'}</span>
                                {/* @ts-ignore */}
                                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {hotel.email || hotel.contactEmail || 'No email'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Edit Profile
                        </button>
                        <button className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
                            Login as Admin
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Kiosks Online</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {hotel.stats.kiosksOnline} <span className="text-slate-400 text-lg">/ {hotel.stats.kiosksTotal}</span>
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Subscription</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 capitalize">
                            {hotel.plan}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Open Tickets</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {hotel.stats.openTickets}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            ₹{(hotel.stats.totalSpent / 1000).toFixed(1)}k
                        </p>
                    </div>
                </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'overview', label: 'Overview', icon: Building2 },
                    { id: 'kiosks', label: 'Kiosk Fleet', icon: Cpu },
                    { id: 'finance', label: 'Billing & Invoices', icon: CreditCard },
                    { id: 'support', label: 'Support & Team', icon: Users },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md'
                                    : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <GlassCard className="p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Contract Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500 text-sm">Contract Start</span>
                                    {/* @ts-ignore */}
                                    <span className="font-medium text-slate-900 dark:text-white text-sm">{hotel.onboardedDate || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500 text-sm">Renewal Date</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-sm">{hotel.contractRenewalDate}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500 text-sm">Monthly Recurring Revenue</span>
                                    {/* @ts-ignore */}
                                    <span className="font-medium text-slate-900 dark:text-white text-sm">₹{(hotel.mrr || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-slate-500 text-sm">Account Manager</span>
                                    <span className="font-medium text-emerald-600 text-sm">Sarah Jenkins</span>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                            <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Invoice Paid</p>
                                    <p className="text-xs text-slate-500">Invoice #INV-2024-001 was paid via Bank Transfer.</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Support Ticket Opened</p>
                                    <p className="text-xs text-slate-500">"Kiosk in lobby not printing" reported by Front Desk.</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">System Updated</p>
                                    <p className="text-xs text-slate-500">Kiosk firmware auto-updated to v2.4.1</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">3 days ago</span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {activeTab === 'kiosks' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hotel.kiosks.map(kiosk => (
                            <GlassCard key={kiosk.id} className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        {kiosk.status === 'online'
                                            ? <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600"><Wifi className="w-4 h-4" /></div>
                                            : <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600"><WifiOff className="w-4 h-4" /></div>
                                        }
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{kiosk.serialNumber}</h4>
                                            <p className="text-xs text-slate-500">{kiosk.model}</p>
                                        </div>
                                    </div>
                                    <Dropdown
                                        trigger={<button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>}
                                        align="right"
                                    >
                                        <DropdownItem>Reboot Device</DropdownItem>
                                        <DropdownItem>View Logs</DropdownItem>
                                    </Dropdown>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                                    <span>v{kiosk.firmwareVersion}</span>
                                    <span>Last seen: {kiosk.lastHeartbeat}</span>
                                </div>
                            </GlassCard>
                        ))}
                        {hotel.kiosks.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500">No kiosks assigned to this hotel.</div>
                        )}
                    </div>
                )}

                {activeTab === 'finance' && (
                    <GlassCard className="p-0 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Invoice</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {hotel.invoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(inv.issueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">₹{inv.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                    inv.status === 'overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-slate-400 hover:text-slate-600"><Download className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassCard>
                )}

                {activeTab === 'support' && (
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Hotel Staff</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {hotel.users.map(user => (
                                    <GlassCard key={user.id} className="p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.role}</p>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Support Tickets</h3>
                            <div className="space-y-3">
                                {hotel.tickets.map(ticket => (
                                    <GlassCard key={ticket.id} className="p-4 flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs text-slate-500">{ticket.ticketNumber}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>{ticket.status}</span>
                                            </div>
                                            <p className="font-medium text-slate-900 dark:text-white text-sm">{ticket.subject}</p>
                                        </div>
                                        <button className="text-sm text-emerald-600 hover:underline">View</button>
                                    </GlassCard>
                                ))}
                                {hotel.tickets.length === 0 && <p className="text-sm text-slate-500">No recent tickets.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
