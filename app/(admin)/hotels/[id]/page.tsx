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

    const [activeTab, setActiveTab] = useState<'overview' | 'kiosks' | 'finance' | 'support'>('overview');

    const hotel = getHotelFullProfile(id);

    if (!hotel) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-primary">Hotel Not Found</h2>
                <button onClick={() => router.back()} className="text-info hover:underline mt-2">Go Back</button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-normal">
            {/* Top Navigation */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Registry
            </button>

            {/* Hotel Header Card */}
            <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center text-inverse shadow-lg">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
                                {hotel.name}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${hotel.status === 'active'
                                    ? 'badge-success'
                                    : 'badge-warning'
                                    }`}>
                                    {hotel.status.toUpperCase()}
                                </span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {hotel.location}, {hotel.city}</span>
                                {/* @ts-ignore */}
                                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {hotel.website || 'No website'}</span>
                                {/* @ts-ignore */}
                                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {hotel.email || hotel.contactEmail || 'No email'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-secondary">
                            Edit Profile
                        </button>
                        <button className="btn-primary">
                            Login as Admin
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-glass">
                    <div className="p-4 rounded-xl surface-glass-soft border border-glass">
                        <p className="text-xs text-muted uppercase tracking-wide font-medium">Kiosks Online</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                            {hotel.stats.kiosksOnline} <span className="text-muted text-lg">/ {hotel.stats.kiosksTotal}</span>
                        </p>
                    </div>
                    <div className="p-4 rounded-xl surface-glass-soft border border-glass">
                        <p className="text-xs text-muted uppercase tracking-wide font-medium">Subscription</p>
                        <p className="text-2xl font-bold text-success mt-1 capitalize">
                            {hotel.plan}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl surface-glass-soft border border-glass">
                        <p className="text-xs text-muted uppercase tracking-wide font-medium">Open Tickets</p>
                        <p className="text-2xl font-bold text-warning mt-1">
                            {hotel.stats.openTickets}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl surface-glass-soft border border-glass">
                        <p className="text-xs text-muted uppercase tracking-wide font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-primary mt-1">
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
                                ? 'btn-primary'
                                : 'surface-glass-soft text-secondary-text glass-hover'
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
                            <h3 className="font-bold text-primary mb-4">Contract Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-glass">
                                    <span className="text-muted text-sm">Contract Start</span>
                                    {/* @ts-ignore */}
                                    <span className="font-medium text-primary text-sm">{hotel.onboardedDate || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-glass">
                                    <span className="text-muted text-sm">Renewal Date</span>
                                    <span className="font-medium text-primary text-sm">{hotel.contractRenewalDate}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-glass">
                                    <span className="text-muted text-sm">Monthly Recurring Revenue</span>
                                    {/* @ts-ignore */}
                                    <span className="font-medium text-primary text-sm">₹{(hotel.mrr || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-muted text-sm">Account Manager</span>
                                    <span className="font-medium text-info text-sm">Sarah Jenkins</span>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <h3 className="font-bold text-primary mb-4">Recent Activity</h3>
                            <div className="relative pl-4 border-l-2 border-glass space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-success ring-4 ring-white dark:ring-slate-900" />
                                    <p className="text-sm font-medium text-primary">Invoice Paid</p>
                                    <p className="text-xs text-muted">Invoice #INV-2024-001 was paid via Bank Transfer.</p>
                                    <span className="text-[10px] text-muted mt-1 block">2 hours ago</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-warning ring-4 ring-white dark:ring-slate-900" />
                                    <p className="text-sm font-medium text-primary">Support Ticket Opened</p>
                                    <p className="text-xs text-muted">&quot;Kiosk in lobby not printing&quot; reported by Front Desk.</p>
                                    <span className="text-[10px] text-muted mt-1 block">Yesterday</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-info ring-4 ring-white dark:ring-slate-900" />
                                    <p className="text-sm font-medium text-primary">System Updated</p>
                                    <p className="text-xs text-muted">Kiosk firmware auto-updated to v2.4.1</p>
                                    <span className="text-[10px] text-muted mt-1 block">3 days ago</span>
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
                                            ? <div className="p-2 bg-success/10 rounded-lg text-success"><Wifi className="w-4 h-4" /></div>
                                            : <div className="p-2 bg-danger/10 rounded-lg text-danger"><WifiOff className="w-4 h-4" /></div>
                                        }
                                        <div>
                                            <h4 className="font-bold text-primary text-sm">{kiosk.serialNumber}</h4>
                                            <p className="text-xs text-muted">{kiosk.model}</p>
                                        </div>
                                    </div>
                                    <Dropdown
                                        trigger={<button className="text-muted hover:text-secondary-text"><MoreVertical className="w-4 h-4" /></button>}
                                        align="right"
                                    >
                                        <DropdownItem>Reboot Device</DropdownItem>
                                        <DropdownItem>View Logs</DropdownItem>
                                    </Dropdown>
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted border-t border-glass pt-3">
                                    <span>v{kiosk.firmwareVersion}</span>
                                    <span>Last seen: {kiosk.lastHeartbeat}</span>
                                </div>
                            </GlassCard>
                        ))}
                        {hotel.kiosks.length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted">No kiosks assigned to this hotel.</div>
                        )}
                    </div>
                )}

                {activeTab === 'finance' && (
                    <GlassCard className="p-0 overflow-hidden">
                        <table className="table-glass text-sm text-left">
                            <thead className="surface-glass-soft text-muted uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Invoice</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-glass">
                                {hotel.invoices.map(inv => (
                                    <tr key={inv.id} className="glass-hover">
                                        <td className="px-6 py-4 font-mono font-medium text-primary">{inv.invoiceNumber}</td>
                                        <td className="px-6 py-4 text-muted">{new Date(inv.issueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right font-medium text-primary">₹{inv.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${inv.status === 'paid' ? 'badge-success' :
                                                inv.status === 'overdue' ? 'badge-danger' : 'badge-warning'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-muted hover:text-secondary-text"><Download className="w-4 h-4" /></button>
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
                            <h3 className="font-bold text-primary mb-4">Hotel Staff</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {hotel.users.map(user => (
                                    <GlassCard key={user.id} className="p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full surface-glass-soft flex items-center justify-center text-muted">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-primary text-sm">{user.name}</p>
                                            <p className="text-xs text-muted">{user.role}</p>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-primary mb-4">Support Tickets</h3>
                            <div className="space-y-3">
                                {hotel.tickets.map(ticket => (
                                    <GlassCard key={ticket.id} className="p-4 flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs text-muted">{ticket.ticketNumber}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'badge-info' : 'badge-default'
                                                    }`}>{ticket.status}</span>
                                            </div>
                                            <p className="font-medium text-primary text-sm">{ticket.subject}</p>
                                        </div>
                                        <button className="text-sm text-info hover:underline">View</button>
                                    </GlassCard>
                                ))}
                                {hotel.tickets.length === 0 && <p className="text-sm text-muted">No recent tickets.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
