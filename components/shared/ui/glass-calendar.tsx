
import * as React from "react";
import { Settings, ChevronLeft, ChevronRight, Check } from "lucide-react";
import {
    format,
    addMonths,
    subMonths,
    isSameDay,
    isToday,
    getDate,
    getDaysInMonth,
    startOfMonth,
    startOfWeek,
    endOfWeek,
    isWithinInterval,
    addYears,
    subYears,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    eachYearOfInterval,
    isSameMonth,
    isSameYear,
    addWeeks,
    subWeeks
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS ---
export type ViewMode = "Day" | "Weekly" | "Monthly" | "Yearly";

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

interface GlassCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
    mode?: "single" | "range" | "multiple"; // For now we focus on range as per request
    selected?: DateRange;
    onSelect?: (range: DateRange) => void;
    className?: string;
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
}

// --- HELPER TO HIDE SCROLLBAR ---
const ScrollbarHide = () => (
    <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

// --- MAIN COMPONENT ---
export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
    ({ className, selected: propSelected, onSelect, viewMode = "Day", onViewModeChange, ...props }, ref) => {
        const [currentDate, setCurrentDate] = React.useState(new Date());
        const [selectedRange, setSelectedRange] = React.useState<DateRange>(propSelected || { from: undefined, to: undefined });
        const [hoverDate, setHoverDate] = React.useState<Date | undefined>(undefined);

        // Update internal state if prop changes
        React.useEffect(() => {
            if (propSelected) {
                setSelectedRange(propSelected);
            }
        }, [propSelected]);

        // --- NAVIGATION HANDLERS ---
        const handlePrev = () => {
            if (viewMode === "Day" || viewMode === "Weekly") {
                setCurrentDate(subMonths(currentDate, 1));
            } else if (viewMode === "Monthly") {
                setCurrentDate(subYears(currentDate, 1));
            } else if (viewMode === "Yearly") {
                setCurrentDate(subYears(currentDate, 12));
            }
        };

        const handleNext = () => {
            if (viewMode === "Day" || viewMode === "Weekly") {
                setCurrentDate(addMonths(currentDate, 1));
            } else if (viewMode === "Monthly") {
                setCurrentDate(addYears(currentDate, 1));
            } else if (viewMode === "Yearly") {
                setCurrentDate(addYears(currentDate, 12));
            }
        };

        // --- SELECTION HANDLERS ---
        const handleDayClick = (date: Date) => {
            let newRange = { ...selectedRange };

            if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
                // Start new selection
                newRange = { from: date, to: undefined };
            } else {
                // Complete selection
                if (date < selectedRange.from) {
                    newRange = { from: date, to: selectedRange.from };
                } else {
                    newRange = { from: selectedRange.from, to: date };
                }
            }
            setSelectedRange(newRange);
            onSelect?.(newRange);
        };

        const handleWeekClick = (weekStart: Date, weekEnd: Date) => {
            // Logic for selecting a week or range of weeks
            // For simplicity in this iteration: If no start selected, select this week. 
            // If start selected, extend to this week end.
            let newRange = { ...selectedRange };

            if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
                newRange = { from: weekStart, to: weekEnd };
            } else {
                if (weekStart < selectedRange.from) {
                    newRange = { from: weekStart, to: selectedRange.from }; // Should strictly be end of that week but keeping simple
                    // Actually better: from new week start to old range end (or old range from)
                    // Let's just set specific logic: selecting multiple weeks
                    // If clicking, select that week. Implementation can be complex for range of weeks.
                    // Let'sstick to: Click selects that week. Shift+Click or subsequent click extends?
                    // User said: "range of weeks which can expand..."
                    // Let's treat week blocks as the unit.

                    // If we are "extending", we need to know if we are selecting 'to'.
                    // Let's keep it consistent: First click starts range (week start), second click ends range (week end).
                    if (weekEnd < selectedRange.from) {
                        newRange = { from: weekStart, to: selectedRange.to || selectedRange.from };
                        // Re-orient
                        newRange = { from: weekStart, to: selectedRange.from };  // Wait, if existing was a week, it has a 'to'.
                        // Resetting for simplicity user experience:
                        // Click 1: Select 1 week.
                        // Click 2 (if separate): Select new range? Or extend?
                        // Standard date picker: Click 1 resets and starts.
                    } else {
                        // Extending forward
                        newRange = { from: selectedRange.from, to: weekEnd };
                    }
                } else {
                    newRange = { from: selectedRange.from, to: weekEnd };
                }
            }

            // Override for "Week" mode: Always ensure we snap to week boundaries if we want "Week" feel?
            // Actually, the handleDayClick logic is generic. Let's just use specific Week handler.
            setSelectedRange(newRange);
            onSelect?.(newRange);
        };

        const handleMonthClick = (monthStart: Date) => {
            // Select distinct month or range of months
            // Range logic same as days
            const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0); // End of month

            let newRange = { ...selectedRange };
            if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
                newRange = { from: monthStart, to: monthEnd };
            } else {
                // Determine total range
                if (monthStart < selectedRange.from) {
                    newRange = { from: monthStart, to: selectedRange.to || selectedRange.from }; // Extend backward
                    // Fix end date consistency if previous was single month
                    if (!selectedRange.to) {
                        // If only from existed (e.g. start of a month), set to to end of that month
                        const oldFromEnd = new Date(selectedRange.from.getFullYear(), selectedRange.from.getMonth() + 1, 0);
                        newRange = { from: monthStart, to: oldFromEnd };
                    }
                } else {
                    newRange = { from: selectedRange.from, to: monthEnd };
                }
            }
            setSelectedRange(newRange);
            onSelect?.(newRange);
        };

        const handleYearClick = (yearStart: Date) => {
            const yearEnd = endOfYear(yearStart);
            let newRange = { ...selectedRange };
            if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
                newRange = { from: yearStart, to: yearEnd };
            } else {
                if (yearStart < selectedRange.from) {
                    if (!selectedRange.to) {
                        const oldFromEnd = endOfYear(selectedRange.from);
                        newRange = { from: yearStart, to: oldFromEnd };
                    } else {
                        newRange = { from: yearStart, to: selectedRange.to };
                    }
                } else {
                    newRange = { from: selectedRange.from, to: yearEnd };
                }
            }
            setSelectedRange(newRange);
            onSelect?.(newRange);
        };


        // --- RENDERERS ---

        const renderDayView = () => {
            const start = startOfMonth(currentDate);
            const totalDays = getDaysInMonth(currentDate);
            const firstDayOfWeek = start.getDay(); // 0 (Sun) to 6 (Sat)
            const days = [];

            // Empty slots for previous month
            for (let i = 0; i < firstDayOfWeek; i++) {
                days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
            }

            for (let i = 1; i <= totalDays; i++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                const isSelected = selectedRange.from && selectedRange.to
                    ? isWithinInterval(date, { start: selectedRange.from, end: selectedRange.to })
                    : isSameDay(date, selectedRange.from!);

                const isRangeStart = selectedRange.from && isSameDay(date, selectedRange.from);
                const isRangeEnd = selectedRange.to && isSameDay(date, selectedRange.to);
                const isMiddle = isSelected && !isRangeStart && !isRangeEnd;

                days.push(
                    <button
                        key={i}
                        onClick={() => handleDayClick(date)}
                        onMouseEnter={() => setHoverDate(date)}
                        className={cn(
                            "relative flex h-8 w-8 items-center justify-center text-sm font-medium transition-all duration-200 rounded-full z-10",
                            {
                                "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30": isRangeStart || isRangeEnd || (isSelected && !selectedRange.to),
                                "text-slate-300 hover:bg-white/10 mt-[2px]": !isSelected,
                                "bg-emerald-500/20 text-emerald-100 rounded-none": isMiddle,
                                "rounded-l-full rounded-r-none": isRangeStart && selectedRange.to,
                                "rounded-r-full rounded-l-none": isRangeEnd && selectedRange.from,
                            }
                        )}
                    >
                        {i}
                        {isToday(date) && !isSelected && (
                            <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />
                        )}
                    </button>
                );
            }
            return (
                <div className="grid grid-cols-7 gap-y-2 place-items-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <span key={i} className="text-xs font-bold text-slate-500 mb-2">{d}</span>
                    ))}
                    {days}
                </div>
            );
        };

        const renderWeeklyView = () => {
            // Render full month but interaction is row-based
            const start = startOfMonth(currentDate);
            const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const startWeek = startOfWeek(start);
            const endWeek = endOfWeek(end);

            // Generate distinct weeks
            const weeks = [];
            let current = startWeek;

            while (current <= endWeek) {
                weeks.push(current);
                current = addWeeks(current, 1);
            }

            return (
                <div className="space-y-1">
                    <div className="grid grid-cols-7 gap-y-2 place-items-center mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <span key={i} className="text-xs font-bold text-slate-500">{d}</span>
                        ))}
                    </div>
                    {weeks.map((weekStart, idx) => {
                        const weekEnd = endOfWeek(weekStart);
                        // Check if this week is fully or partially in selected range
                        // If range spans this week
                        const isSelected = selectedRange.from && selectedRange.to
                            ? (weekStart >= selectedRange.from && weekEnd <= selectedRange.to) || // Fully inside
                            (selectedRange.from <= weekEnd && selectedRange.to >= weekStart) // Overlap (simplified)
                            : false; // For simplicty strictly check selection

                        // Strict check for visualization
                        const isStartWeek = selectedRange.from && isSameDay(weekStart, startOfWeek(selectedRange.from));

                        // Let's render the days for visual
                        const days = [];
                        for (let i = 0; i < 7; i++) {
                            const day = new Date(weekStart);
                            day.setDate(weekStart.getDate() + i);

                            const isDaySelected = selectedRange.from && selectedRange.to
                                ? isWithinInterval(day, { start: selectedRange.from, end: selectedRange.to })
                                : (selectedRange.from && isSameDay(day, selectedRange.from)); // Fallback

                            const isCurrentMonth = isSameMonth(day, currentDate);

                            days.push(
                                <div
                                    key={i}
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center text-sm rounded-full",
                                        {
                                            "text-white bg-emerald-500": isDaySelected && isCurrentMonth,
                                            "text-emerald-500/50 bg-emerald-500/10": isDaySelected && !isCurrentMonth,
                                            "text-slate-500/50": !isCurrentMonth && !isDaySelected,
                                            "text-white": isCurrentMonth && !isDaySelected
                                        }
                                    )}
                                >
                                    {getDate(day)}
                                </div>
                            );
                        }

                        return (
                            <div
                                key={idx}
                                onClick={() => handleWeekClick(weekStart, weekEnd)}
                                className={cn(
                                    "grid grid-cols-7 place-items-center p-1 rounded-xl cursor-pointer transition-colors",
                                    "hover:bg-white/10"
                                )}
                            >
                                {days}
                            </div>
                        )
                    })}
                </div>
            )
        };

        const renderMonthlyView = () => {
            const months = eachMonthOfInterval({
                start: startOfYear(currentDate),
                end: endOfYear(currentDate)
            });

            return (
                <div className="grid grid-cols-3 gap-3">
                    {months.map((month) => {
                        const isSelected = selectedRange.from && selectedRange.to
                            ? isWithinInterval(month, { start: startOfMonth(selectedRange.from), end: endOfMonth(selectedRange.to) })
                            : (selectedRange.from && isSameMonth(month, selectedRange.from));

                        return (
                            <button
                                key={month.toString()}
                                onClick={() => handleMonthClick(month)}
                                className={cn(
                                    "h-10 rounded-lg text-sm font-medium transition-all",
                                    {
                                        "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30": isSelected,
                                        "text-slate-300 hover:bg-white/10": !isSelected
                                    }
                                )}
                            >
                                {format(month, "MMM")}
                            </button>
                        )
                    })}
                </div>
            );
        };

        const renderYearlyView = () => {
            // 12 Year window around current date
            const start = subYears(currentDate, 6);
            const end = addYears(currentDate, 5);
            const years = eachYearOfInterval({ start, end });

            return (
                <div className="grid grid-cols-3 gap-3">
                    {years.map((year) => {
                        const isSelected = selectedRange.from && selectedRange.to
                            ? isWithinInterval(year, { start: startOfYear(selectedRange.from), end: endOfYear(selectedRange.to) })
                            : (selectedRange.from && isSameYear(year, selectedRange.from));

                        return (
                            <button
                                key={year.toString()}
                                onClick={() => handleYearClick(year)}
                                className={cn(
                                    "h-10 rounded-lg text-sm font-medium transition-all",
                                    {
                                        "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30": isSelected,
                                        "text-slate-300 hover:bg-white/10": !isSelected
                                    }
                                )}
                            >
                                {format(year, "yyyy")}
                            </button>
                        )
                    })}
                </div>
            )
        }


        // --- DYNAMIC HEADER TEXT ---
        const getHeaderText = () => {
            if (viewMode === "Day" || viewMode === "Weekly") return format(currentDate, "MMMM yyyy");
            if (viewMode === "Monthly") return format(currentDate, "yyyy");
            if (viewMode === "Yearly") {
                const start = subYears(currentDate, 6);
                const end = addYears(currentDate, 5);
                return `${format(start, "yyyy")} - ${format(end, "yyyy")}`;
            }
            return "";
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "w-full max-w-[360px] p-5 overflow-hidden",
                    "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-2xl",
                    "rounded-3xl text-white font-sans",
                    className
                )}
                {...props}
            >
                <ScrollbarHide />
                {/* Header: Tabs */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 rounded-xl bg-black/20 p-1 w-full relative">
                        {/* Tab Sliders could go here, for now simple buttons */}
                        {(['Day', 'Weekly', 'Monthly', 'Yearly'] as ViewMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => onViewModeChange?.(m)}
                                className={cn(
                                    "flex-1 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all z-10 uppercase",
                                    viewMode === m ? "bg-white text-black shadow-md" : "text-slate-300 hover:bg-white/10"
                                )}
                            >
                                {m === "Weekly" ? "Week" : m === "Monthly" ? "Month" : m === "Yearly" ? "Year" : "Day"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Display and Navigation */}
                <div className="mb-6 flex items-center justify-between px-2">
                    <motion.p
                        key={getHeaderText()}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl font-bold tracking-tight text-white"
                    >
                        {getHeaderText()}
                    </motion.p>
                    <div className="flex items-center space-x-1">
                        <button onClick={handlePrev} className="p-1.5 rounded-full text-white/70 transition-colors hover:bg-white/20">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={handleNext} className="p-1.5 rounded-full text-white/70 transition-colors hover:bg-white/20">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="min-h-[280px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={viewMode + currentDate.toString()}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            {viewMode === "Day" && renderDayView()}
                            {viewMode === "Weekly" && renderWeeklyView()}
                            {viewMode === "Monthly" && renderMonthlyView()}
                            {viewMode === "Yearly" && renderYearlyView()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Divider */}
                <div className="mt-4 h-px bg-white/10" />

                {/* Footer Actions */}
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                        {selectedRange.from ? (
                            <>
                                {format(selectedRange.from, "MMM d")}
                                {selectedRange.to ? ` - ${format(selectedRange.to, "MMM d")}` : ""}
                            </>
                        ) : "Select date"}
                    </p>

                    <button className="flex items-center space-x-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-500">
                        <Check className="h-3 w-3" />
                        <span>Apply</span>
                    </button>
                </div>
            </div>
        );
    }
);

GlassCalendar.displayName = "GlassCalendar";
