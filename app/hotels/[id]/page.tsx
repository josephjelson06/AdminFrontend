import { notFound } from 'next/navigation';
import {
    Building2, MapPin, Mail, Calendar,
    Cpu, Wifi, WifiOff, AlertTriangle, IndianRupee
} from 'lucide-react';
import { MOCK_HOTELS, MOCK_KIOSKS } from '@/lib/mock-data';
import type { Status, HotelPlan, KioskStatus } from '@/types/schema';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function StatusBadge({ status }: { status: Status }) {
    const styles: Record<Status, string> = {
        active: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        inactive: 'bg-slate-100 text-slate-600 border border-slate-200',
        suspended: 'bg-rose-100 text-rose-700 border border-rose-200',
        pending: 'bg-amber-100 text-amber-700 border border-amber-200',
        onboarding: 'bg-blue-100 text-blue-700 border border-blue-200',
    };

    return (
        <span className={`px-2.5 py-1 rounded text-sm font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

function PlanBadge({ plan }: { plan: HotelPlan }) {
    const styles: Record<HotelPlan, string> = {
        standard: 'bg-slate-700 text-white',
        advanced: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    };

    return (
        <span className={`px-2.5 py-1 rounded text-sm font-medium capitalize ${styles[plan]}`}>
            {plan}
        </span>
    );
}

function KioskStatusIcon({ status }: { status: KioskStatus }) {
    const config: Record<KioskStatus, { icon: typeof Wifi; color: string }> = {
        online: { icon: Wifi, color: 'text-emerald-500' },
        offline: { icon: WifiOff, color: 'text-rose-500' },
        warning: { icon: AlertTriangle, color: 'text-amber-500' },
    };

    const { icon: Icon, color } = config[status];
    return <Icon className={`w-4 h-4 ${color}`} />;
}

export default async function HotelDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const hotel = MOCK_HOTELS.find((h) => h.id === id);

    if (!hotel) {
        notFound();
    }

    const assignedKiosks = MOCK_KIOSKS.filter((k) => k.assignedHotelId === hotel.id);
    const onlineKiosks = assignedKiosks.filter((k) => k.status === 'online').length;

    return (
        <div className="p-6">
            {/* Breadcrumbs */}
            <Breadcrumbs
                items={[
                    { label: 'Hotels', href: '/hotels' },
                    { label: hotel.name },
                ]}
            />

            {/* Header */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Building2 className="w-7 h-7 text-slate-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-xl font-semibold text-slate-900">{hotel.name}</h1>
                                <StatusBadge status={hotel.status} />
                                <PlanBadge plan={hotel.plan} />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {hotel.location}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-4 h-4" />
                                    {hotel.contactEmail}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Card */}
                    <div className="text-right">
                        <div className="text-sm text-slate-500">Monthly Revenue</div>
                        <div className="text-2xl font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <IndianRupee className="w-5 h-5" />
                            {hotel.mrr.toLocaleString('en-IN')}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Total Kiosks</div>
                        <div className="text-lg font-semibold text-slate-900 mt-1">{hotel.kioskCount}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Online</div>
                        <div className="text-lg font-semibold text-emerald-600 mt-1">{onlineKiosks}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Offline</div>
                        <div className="text-lg font-semibold text-rose-600 mt-1">{assignedKiosks.length - onlineKiosks}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Contract Renewal</div>
                        <div className="text-lg font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(hotel.contractRenewalDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assigned Kiosks */}
            <div className="bg-white rounded-lg border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-200">
                    <h2 className="text-sm font-semibold text-slate-900">Assigned Kiosks</h2>
                </div>

                {assignedKiosks.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Serial Number
                                </th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Model
                                </th>
                                <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Firmware
                                </th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    Last Heartbeat
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assignedKiosks.map((kiosk) => (
                                <tr key={kiosk.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Cpu className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-900">{kiosk.serialNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{kiosk.model}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <KioskStatusIcon status={kiosk.status} />
                                            <span className={`text-sm font-medium capitalize ${kiosk.status === 'online' ? 'text-emerald-600' :
                                                    kiosk.status === 'offline' ? 'text-rose-600' : 'text-amber-600'
                                                }`}>
                                                {kiosk.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                                            {kiosk.firmwareVersion}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {new Date(kiosk.lastHeartbeat).toLocaleString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No kiosks assigned to this hotel yet.
                    </div>
                )}
            </div>
        </div>
    );
}
