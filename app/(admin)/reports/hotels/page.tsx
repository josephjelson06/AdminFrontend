'use client';

import Link from 'next/link';
import {
    ChevronRight,
    Building2,
    Trophy,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Star,
    Percent,
} from 'lucide-react';
import { BarChartComponent } from '@/components/shared/ui/Charts';

// Mock hotel performance data
const MOCK_TOP_HOTELS = [
    { id: 'h-001', name: 'Royal Orchid Bangalore', checkins: 1250, selfCheckInRate: 78, trend: 12.5, category: 'Luxury' },
    { id: 'h-010', name: 'The Leela Palace', checkins: 1180, selfCheckInRate: 85, trend: 15.2, category: 'Luxury' },
    { id: 'h-005', name: 'Taj Palace', checkins: 980, selfCheckInRate: 82, trend: 8.3, category: 'Luxury' },
    { id: 'h-003', name: 'Ginger Hotel, Panjim', checkins: 520, selfCheckInRate: 72, trend: 5.1, category: 'Budget' },
    { id: 'h-008', name: 'Marriott Suites', checkins: 890, selfCheckInRate: 76, trend: 10.8, category: 'Business' },
];

const MOCK_UNDERPERFORMING = [
    { id: 'h-009', name: 'Holiday Inn', checkins: 180, selfCheckInRate: 42, issue: 'Low adoption rate', severity: 'warning' },
    { id: 'h-007', name: 'Radisson Blu', checkins: 220, selfCheckInRate: 38, issue: 'Declining usage -15%', severity: 'critical' },
    { id: 'h-012', name: 'Trident Nariman', checkins: 290, selfCheckInRate: 55, issue: 'Below average', severity: 'info' },
];

const CATEGORY_PERFORMANCE = [
    { name: 'Luxury', value: 85 },
    { name: 'Business', value: 70 },
    { name: 'Budget', value: 62 },
];

export default function HotelPerformancePage() {
    return (
        <div className="p-4 sm:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/reports" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                    Reports
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Hotel Performance</span>
            </div>

            <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Hotel Performance Analytics</h1>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top Performing Hotels */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Top Performing Hotels</h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {MOCK_TOP_HOTELS.map((hotel, idx) => (
                            <Link
                                key={hotel.id}
                                href={`/hotels/${hotel.id}`}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                                        idx === 1 ? 'bg-slate-100 text-slate-600' :
                                            idx === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-50 text-slate-500'
                                    }`}>
                                    {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{hotel.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{hotel.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{hotel.checkins.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">check-ins</p>
                                </div>
                                <div className="text-right w-16">
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{hotel.selfCheckInRate}%</p>
                                    <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600">
                                        <TrendingUp className="w-3 h-3" />
                                        +{hotel.trend}%
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Needs Attention */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Needs Attention</h3>
                        <span className="ml-auto px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded">
                            {MOCK_UNDERPERFORMING.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {MOCK_UNDERPERFORMING.map((hotel) => (
                            <Link
                                key={hotel.id}
                                href={`/hotels/${hotel.id}`}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full ${hotel.severity === 'critical' ? 'bg-rose-500' :
                                        hotel.severity === 'warning' ? 'bg-amber-500' :
                                            'bg-blue-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{hotel.name}</p>
                                    <p className={`text-xs ${hotel.severity === 'critical' ? 'text-rose-600 dark:text-rose-400' :
                                            hotel.severity === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                                                'text-blue-600 dark:text-blue-400'
                                        }`}>{hotel.issue}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{hotel.selfCheckInRate}%</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">self check-in</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                        ))}
                    </div>
                    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Hotels with self check-in rate below 60% or declining usage patterns
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                    <Percent className="w-4 h-4 text-slate-400" />
                    Self Check-in Rate by Hotel Category
                </h3>
                <div className="space-y-4">
                    {CATEGORY_PERFORMANCE.map((cat) => (
                        <div key={cat.name} className="flex items-center gap-4">
                            <span className="w-20 text-sm text-slate-600 dark:text-slate-400">{cat.name}</span>
                            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-4 relative overflow-hidden">
                                <div
                                    className={`h-4 rounded-full ${cat.value >= 80 ? 'bg-emerald-500' :
                                            cat.value >= 65 ? 'bg-blue-500' :
                                                'bg-amber-500'
                                        }`}
                                    style={{ width: `${cat.value}%` }}
                                />
                            </div>
                            <span className="w-12 text-right text-sm font-semibold text-slate-900 dark:text-white">{cat.value}%</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Benchmark: 70% for optimal kiosk ROI</span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Excellent
                        <span className="w-2 h-2 rounded-full bg-blue-500 ml-2" /> Good
                        <span className="w-2 h-2 rounded-full bg-amber-500 ml-2" /> Needs improvement
                    </span>
                </div>
            </div>
        </div>
    );
}
