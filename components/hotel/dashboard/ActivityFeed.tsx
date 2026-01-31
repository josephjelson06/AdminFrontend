'use client';

/**
 * ActivityFeed Component
 * 
 * Recent activity list with filters and kiosk grouping.
 */

import { Clock } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { RecentCheckInItem } from './RecentCheckInItem';
import type { GuestCheckIn } from '@/lib/hotel/hotel-data';
import type { ActivityFilter } from '@/lib/services/hotelDashboardService';

interface ActivityFeedProps {
    activity: GuestCheckIn[];
    filter: ActivityFilter;
    onFilterChange: (filter: ActivityFilter) => void;
    getKioskName: (kioskId: string) => string;
}

const filters: ActivityFilter[] = ['All', 'Failed', 'Success'];

export function ActivityFeed({ activity, filter, onFilterChange, getKioskName }: ActivityFeedProps) {
    return (
        <GlassCard className="flex flex-col min-h-[400px] max-h-[600px]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0 px-5 pt-5">
                <h2 className="text-lg font-semibold text-primary">Recent Activity</h2>
                <div className="flex bg-white/10 rounded-lg p-1">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => onFilterChange(f)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === f
                                ? 'bg-white/20 text-primary shadow-sm'
                                : 'text-muted hover:text-primary'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 -mr-2 px-5 pb-5">
                {activity.length > 0 ? (
                    <div className="space-y-1">
                        {activity.map((guest, index) => {
                            const prevGuest = activity[index - 1];
                            const showGroupHeader = !prevGuest || prevGuest.kioskId !== guest.kioskId;

                            return (
                                <div key={guest.id}>
                                    {showGroupHeader && (
                                        <div className="sticky top-0 bg-transparent backdrop-blur-sm py-2 text-xs font-semibold text-muted uppercase tracking-wider z-10">
                                            {getKioskName(guest.kioskId)}
                                        </div>
                                    )}
                                    <RecentCheckInItem guest={guest} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted">
                        <Clock className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">No activity found</p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
