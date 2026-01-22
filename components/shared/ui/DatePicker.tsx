'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date) => void;
    placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Select date' }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value || new Date());

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);

        return days;
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleSelectDate = (day: number) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(selected);
        setIsOpen(false);
    };

    const isSelected = (day: number) => {
        if (!value) return false;
        return value.getDate() === day &&
            value.getMonth() === viewDate.getMonth() &&
            value.getFullYear() === viewDate.getFullYear();
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === viewDate.getMonth() &&
            today.getFullYear() === viewDate.getFullYear();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm hover:border-slate-300 transition-colors"
            >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className={value ? 'text-slate-900' : 'text-slate-400'}>
                    {value
                        ? value.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : placeholder
                    }
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 w-64">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded">
                            <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="text-sm font-medium text-slate-900">
                            {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </span>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded">
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>

                    {/* Days header */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {days.map((day) => (
                            <div key={day} className="text-center text-xs font-medium text-slate-400 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(viewDate).map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => day && handleSelectDate(day)}
                                disabled={!day}
                                className={`text-center text-sm py-1.5 rounded transition-colors ${!day
                                        ? 'invisible'
                                        : isSelected(day)
                                            ? 'bg-slate-900 text-white'
                                            : isToday(day)
                                                ? 'bg-emerald-100 text-emerald-700 font-medium'
                                                : 'hover:bg-slate-100 text-slate-700'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
