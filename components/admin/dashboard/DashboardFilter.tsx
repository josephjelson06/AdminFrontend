"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { GlassCalendar, ViewMode } from "@/components/shared/ui/glass-calendar";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

export function DashboardFilter() {
    const [viewMode, setViewMode] = React.useState<ViewMode>("Day");
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
    const [isViewModeOpen, setIsViewModeOpen] = React.useState(false);

    const viewModeRef = React.useRef<HTMLDivElement>(null);
    useOnClickOutside(viewModeRef, () => setIsViewModeOpen(false));

    // Date selection state
    const [selectedRange, setSelectedRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
        from: new Date(),
        to: undefined
    });

    const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

    // Formatting the button text based on selection
    const getButtonText = () => {
        if (!selectedRange.from) return "Select Date";
        if (!selectedRange.to) return format(selectedRange.from, viewMode === 'Yearly' ? 'yyyy' : 'MMM d, yyyy');
        return `${format(selectedRange.from, 'MMM d')} - ${format(selectedRange.to, 'MMM d, yyyy')}`;
    };

    const viewModes: ViewMode[] = ["Day", "Weekly", "Monthly", "Yearly"];

    return (
        <div className="relative z-40 flex items-center gap-3">
            {/* 1. View Mode Select (glassy dropdown) */}
            <div className="relative" ref={viewModeRef}>
                <button
                    onClick={() => setIsViewModeOpen((open) => !open)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium ${isViewModeOpen
                        ? "bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/70 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-200 shadow-sm"
                        : "surface-glass-soft border-glass text-slate-700 dark:text-slate-200 hover:bg-glass-soft"
                        }`}
                >
                    <span>{viewMode}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isViewModeOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                    {isViewModeOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 mt-2 w-36 z-50 surface-glass-strong rounded-xl border border-glass overflow-hidden"
                        >
                            {viewModes.map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => {
                                        setViewMode(mode);
                                        setIsViewModeOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${viewMode === mode
                                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                                        : "text-slate-700 dark:text-slate-200 hover:bg-glass-soft"
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
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
                        className="absolute top-full right-0 mt-2 z-50 origin-top-right"
                    >
                        <div className="relative">
                            {/* Click outside closer overlay (optional - usually handled by global click listener but simple backdrop works for modal feel if needed, usually transparent absolute is tricky without fixed) */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsCalendarOpen(false)}
                            />

                            {/* The Calendar itself */}
                            <div className="relative z-50">
                                <GlassCalendar
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    selected={selectedRange}
                                    onRangeSelect={setSelectedRange}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
