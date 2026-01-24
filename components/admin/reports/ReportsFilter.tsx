"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { GlassCalendar, ViewMode } from "@/components/shared/ui/glass-calendar";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { DateRange } from "./DateRangeFilter";

interface ReportsFilterProps {
    date: DateRange;
    onDateChange: (range: DateRange) => void;
}

export function ReportsFilter({ date, onDateChange }: ReportsFilterProps) {
    const [viewMode, setViewMode] = React.useState<ViewMode>("Day");
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

    // Formatting the button text based on selection
    const getButtonText = () => {
        if (!date.from) return "Select Date";
        if (!date.to) return format(date.from, viewMode === 'Yearly' ? 'yyyy' : 'MMM d, yyyy');
        return `${format(date.from, 'MMM d')} - ${format(date.to, 'MMM d, yyyy')}`;
    };

    return (
        <div className="relative z-50 flex items-center gap-3">
            {/* 1. View Mode Select */}
            <div className="relative">
                <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as ViewMode)}
                    className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg pl-3 pr-8 py-2 font-medium focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                    <option value="Day">Day</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>

            {/* 2. Calendar Toggle Button */}
            <button
                onClick={toggleCalendar}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isCalendarOpen
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 ring-2 ring-emerald-500/20"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    }`}
            >
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline-block">{getButtonText()}</span>
            </button>

            {/* 3. Expandable Glass Calendar */}
            <AnimatePresence>
                {isCalendarOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 z-50 origin-top-right w-[360px]"
                    >
                        <div className="relative">
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsCalendarOpen(false)}
                            />

                            <div className="relative z-50">
                                <GlassCalendar
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    selected={date}
                                    onRangeSelect={onDateChange}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
