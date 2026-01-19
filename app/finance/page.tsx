import { IndianRupee, TrendingUp, Building2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { MOCK_HOTELS } from '@/lib/mock-data';
import { AMCProgress, AMCBadge } from '@/components/ui/AMCProgress';

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function getDaysRemaining(dateStr: string): number {
    const end = new Date(dateStr).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

export default function FinancePage() {
    // Calculate totals from mock data
    const totalMRR = MOCK_HOTELS.reduce((sum, h) => sum + h.mrr, 0);
    const activeHotels = MOCK_HOTELS.filter((h) => h.status === 'active');
    const activeMRR = activeHotels.reduce((sum, h) => sum + h.mrr, 0);
    const suspendedMRR = MOCK_HOTELS.filter((h) => h.status === 'suspended').reduce((sum, h) => sum + h.mrr, 0);
    const avgRevenuePerHotel = totalMRR / MOCK_HOTELS.filter(h => h.mrr > 0).length;

    // Sort hotels by MRR for table
    const sortedHotels = [...MOCK_HOTELS].sort((a, b) => b.mrr - a.mrr);

    // Contracts expiring soon
    const expiringContracts = MOCK_HOTELS
        .filter(h => getDaysRemaining(h.contractRenewalDate) <= 30)
        .sort((a, b) => getDaysRemaining(a.contractRenewalDate) - getDaysRemaining(b.contractRenewalDate));

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-slate-900">Subscriptions</h1>
                <p className="text-sm text-slate-500">Revenue overview, contracts, and AMC status</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total MRR</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalMRR)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-100">
                            <IndianRupee className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        Across {MOCK_HOTELS.filter(h => h.mrr > 0).length} paying hotels
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Revenue</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(activeMRR)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-100">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        From {activeHotels.length} active hotels
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">At-Risk Revenue</p>
                            <p className="text-2xl font-bold text-rose-600 mt-1">{formatCurrency(suspendedMRR)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-rose-100">
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        From suspended accounts
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg. per Hotel</p>
                            <p className="text-2xl font-bold text-slate-700 mt-1">{formatCurrency(avgRevenuePerHotel)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-100">
                            <Building2 className="w-5 h-5 text-slate-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        Average MRR per paying hotel
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Contracts Expiring Soon */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <h2 className="text-sm font-semibold text-slate-900">Expiring Soon</h2>
                        <span className="ml-auto px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                            {expiringContracts.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                        {expiringContracts.length > 0 ? expiringContracts.map((hotel) => (
                            <div key={hotel.id} className="px-4 py-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-900">{hotel.name}</span>
                                    <AMCBadge daysRemaining={getDaysRemaining(hotel.contractRenewalDate)} />
                                </div>
                                <AMCProgress
                                    startDate="2025-01-01"
                                    endDate={hotel.contractRenewalDate}
                                    label="Contract"
                                />
                            </div>
                        )) : (
                            <div className="px-4 py-6 text-center text-sm text-slate-500">
                                No contracts expiring in next 30 days
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue by Hotel - Compact */}
                <div className="col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200">
                        <h2 className="text-sm font-semibold text-slate-900">Revenue by Hotel</h2>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Hotel</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Status</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Plan</th>
                                <th className="text-right px-4 py-2 text-xs font-semibold text-slate-600 uppercase">MRR</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Contract</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedHotels.slice(0, 5).map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-900">{hotel.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${hotel.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                hotel.status === 'suspended' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {hotel.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${hotel.plan === 'advanced'
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                                                : 'bg-slate-700 text-white'
                                            }`}>
                                            {hotel.plan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <span className="text-sm font-semibold text-emerald-600">
                                            {formatCurrency(hotel.mrr)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <AMCBadge daysRemaining={getDaysRemaining(hotel.contractRenewalDate)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
