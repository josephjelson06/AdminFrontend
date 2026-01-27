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
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/reports" className="text-muted hover:text-secondary-text">
                    Reports
                </Link>
                <ChevronRight className="w-4 h-4 text-muted" />
                <span className="font-medium text-primary">Hotel Performance</span>
            </div>

            <h1 className="text-xl font-semibold text-primary mb-6">Hotel Performance Analytics</h1>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top Performing Hotels */}
                <div className="surface-glass-strong rounded-lg border border-glass">
                    <div className="px-4 py-3 border-b border-glass flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-warning" />
                        <h3 className="text-sm font-semibold text-primary">Top Performing Hotels</h3>
                    </div>
                    <div className="divide-y divide-glass">
                        {MOCK_TOP_HOTELS.map((hotel, idx) => (
                            <Link
                                key={hotel.id}
                                href={`/hotels/${hotel.id}`}
                                className="flex items-center gap-4 px-4 py-3 glass-hover transition-colors"
                            >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-warning/20 text-warning' :
                                        idx === 1 ? 'surface-glass-soft text-secondary-text' :
                                            idx === 2 ? 'bg-warning/10 text-warning' :
                                                'surface-glass-soft text-muted'
                                    }`}>
                                    {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-primary truncate">{hotel.name}</p>
                                    <p className="text-xs text-muted">{hotel.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-primary">{hotel.checkins.toLocaleString()}</p>
                                    <p className="text-xs text-muted">check-ins</p>
                                </div>
                                <div className="text-right w-16">
                                    <p className="text-sm font-semibold text-success">{hotel.selfCheckInRate}%</p>
                                    <span className="inline-flex items-center gap-0.5 text-xs text-success">
                                        <TrendingUp className="w-3 h-3" />
                                        +{hotel.trend}%
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Needs Attention */}
                <div className="surface-glass-strong rounded-lg border border-glass">
                    <div className="px-4 py-3 border-b border-glass flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <h3 className="text-sm font-semibold text-primary">Needs Attention</h3>
                        <span className="ml-auto badge-warning">
                            {MOCK_UNDERPERFORMING.length}
                        </span>
                    </div>
                    <div className="divide-y divide-glass">
                        {MOCK_UNDERPERFORMING.map((hotel) => (
                            <Link
                                key={hotel.id}
                                href={`/hotels/${hotel.id}`}
                                className="flex items-center gap-4 px-4 py-3 glass-hover transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full ${hotel.severity === 'critical' ? 'bg-danger' :
                                        hotel.severity === 'warning' ? 'bg-warning' :
                                            'bg-info'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-primary truncate">{hotel.name}</p>
                                    <p className={`text-xs ${hotel.severity === 'critical' ? 'text-danger' :
                                            hotel.severity === 'warning' ? 'text-warning' :
                                                'text-info'
                                        }`}>{hotel.issue}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-danger">{hotel.selfCheckInRate}%</p>
                                    <p className="text-xs text-muted">self check-in</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted" />
                            </Link>
                        ))}
                    </div>
                    <div className="px-4 py-3 border-t border-glass">
                        <p className="text-xs text-muted">
                            Hotels with self check-in rate below 60% or declining usage patterns
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Performance */}
            <div className="surface-glass-strong rounded-lg border border-glass p-6">
                <h3 className="text-sm font-semibold text-primary flex items-center gap-2 mb-6">
                    <Percent className="w-4 h-4 text-muted" />
                    Self Check-in Rate by Hotel Category
                </h3>
                <div className="space-y-4">
                    {CATEGORY_PERFORMANCE.map((cat) => (
                        <div key={cat.name} className="flex items-center gap-4">
                            <span className="w-20 text-sm text-secondary-text">{cat.name}</span>
                            <div className="flex-1 surface-glass-soft rounded-full h-4 relative overflow-hidden">
                                <div
                                    className={`h-4 rounded-full ${cat.value >= 80 ? 'bg-success' :
                                            cat.value >= 65 ? 'bg-info' :
                                                'bg-warning'
                                        }`}
                                    style={{ width: `${cat.value}%` }}
                                />
                            </div>
                            <span className="w-12 text-right text-sm font-semibold text-primary">{cat.value}%</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-glass flex items-center justify-between text-xs text-muted">
                    <span>Benchmark: 70% for optimal kiosk ROI</span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-success" /> Excellent
                        <span className="w-2 h-2 rounded-full bg-info ml-2" /> Good
                        <span className="w-2 h-2 rounded-full bg-warning ml-2" /> Needs improvement
                    </span>
                </div>
            </div>
        </div>
    );
}
