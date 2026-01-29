'use client';

/**
 * ActivityFeed Component
 * 
 * Recent activity list with filters and kiosk grouping.
 */

import { Clock } from 'lucide-react';
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
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
                <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => onFilterChange(f)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === f
                                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 -mr-2">
                {activity.length > 0 ? (
                    <div className="space-y-1">
                        {activity.map((guest, index) => {
                            const prevGuest = activity[index - 1];
                            const showGroupHeader = !prevGuest || prevGuest.kioskId !== guest.kioskId;

                            return (
                                <div key={guest.id}>
                                    {showGroupHeader && (
                                        <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                                            {getKioskName(guest.kioskId)}
                                        </div>
                                    )}
                                    <RecentCheckInItem guest={guest} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Clock className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">No activity found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
