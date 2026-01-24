'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { GlassCalendar } from '@/components/shared/ui/glass-calendar';

export interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

interface DateRangeFilterProps {
    date: DateRange;
    onDateChange: (range: DateRange) => void;
}

export function DateRangeFilter({ date, onDateChange }: DateRangeFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDateDisplay = () => {
        if (date.from && date.to) {
            return `${format(date.from, 'MMM d, yyyy')} - ${format(date.to, 'MMM d, yyyy')}`;
        }
        if (date.from) {
            return format(date.from, 'MMM d, yyyy');
        }
        return 'Select dates';
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDateChange({ from: undefined, to: undefined });
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-medium
                    ${isOpen
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'
                    }
                `}
            >
                <Calendar className="w-4 h-4 opacity-70" />
                <span>{formatDateDisplay()}</span>
                {date.from ? (
                    <div
                        role="button"
                        onClick={handleReset}
                        className="ml-1 p-0.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </div>
                ) : (
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Using the GlassCalendar component you uploaded */}
                    <GlassCalendar
                        selected={date}
                        onRangeSelect={(range) => {
                            // If user selects both dates, we can optionally close
                            // But keeping it open allows for corrections.
                            onDateChange(range);
                        }}
                        className="w-[320px] shadow-2xl border-slate-200/50 dark:border-slate-700"
                    />
                </div>
            )}
        </div>
    );
}
