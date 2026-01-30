'use client';

/**
 * DashboardHeader Component
 * 
 * Header with date filters and refresh.
 */

import { useState } from 'react';
import { Calendar, ChevronDown, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCalendar, ViewMode } from '@/components/shared/ui/glass-calendar';

type DateRangeOption = 'Today' | 'Last 7 Days' | 'Custom';

interface DashboardHeaderProps {
    userName: string;
    lastUpdated: Date;
    onRefresh: () => void;
}

export function DashboardHeader({ userName, lastUpdated, onRefresh }: DashboardHeaderProps) {
    const [dateRange, setDateRange] = useState<DateRangeOption>('Today');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('Day');
    const [customDate, setCustomDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: new Date(),
        to: undefined,
    });

    const handleDateRangeChange = (value: string) => {
        setDateRange(value as DateRangeOption);
        if (value === 'Custom') {
            setIsCalendarOpen(true);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Welcome back, {userName}!
                    </p>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">
                        Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                        onClick={onRefresh}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        title="Refresh Data"
                    >
                        <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative z-20">
                    <select
                        value={dateRange}
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                        className="appearance-none pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option>Today</option>
                        <option>Last 7 Days</option>
                        <option>Custom</option>
                    </select>
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                    <AnimatePresence>
                        {isCalendarOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full right-0 mt-2 z-30 origin-top-right"
                            >
                                <div className="relative">
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setIsCalendarOpen(false)}
                                    />
                                    <div className="relative z-30">
                                        <GlassCalendar
                                            viewMode={viewMode}
                                            onViewModeChange={setViewMode}
                                            selected={customDate}
                                            onRangeSelect={setCustomDate}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
