'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
    AlertTriangle,
    Camera,
    CheckCircle2,
    Clock,
    X,
    Send,
    User,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Calendar,
    SlidersHorizontal,
    ArrowUpDown,
    Filter,
} from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { Breadcrumbs } from '@/components/shared/ui/Breadcrumbs';
import { useAuth } from '@/lib/shared/auth';
import { useToast } from '@/components/shared/ui/Toast';
import {
    MOCK_INCIDENTS,
    Incident,
    IncidentPriority,
    IncidentStatus,
    getIncidentPriorityColor,
    getIncidentStatusColor,
    MAINTENANCE_STAFF_USER_ID,
} from '@/lib/hotel/hotel-data';

// ============================================
// FILTER & SORT TYPES
// ============================================

type SortOption = 'date-desc' | 'date-asc' | 'priority-high' | 'priority-low' | 'room-asc' | 'room-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'priority-high', label: 'Priority: High to Low' },
    { value: 'priority-low', label: 'Priority: Low to High' },
    { value: 'room-asc', label: 'Room: A-Z' },
    { value: 'room-desc', label: 'Room: Z-A' },
];

const STATUS_OPTIONS: { value: IncidentStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'Reported', label: 'Reported' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
];

const PRIORITY_FILTER_OPTIONS: { value: IncidentPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'Immediate Fix', label: 'Immediate Fix' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
    { value: null, label: 'Unset' },
];

// ============================================
// FILTER TOOLBAR COMPONENT
// ============================================

interface FilterToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sortBy: SortOption;
    onSortChange: (value: SortOption) => void;
    statusFilter: IncidentStatus | 'all';
    onStatusChange: (value: IncidentStatus | 'all') => void;
    priorityFilter: IncidentPriority | 'all';
    onPriorityChange: (value: IncidentPriority | 'all') => void;
    dateFrom: Date | null;
    dateTo: Date | null;
    onDateFromChange: (date: Date | null) => void;
    onDateToChange: (date: Date | null) => void;
    onClearFilters: () => void;
    activeFilterCount: number;
}

function FilterToolbar({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    onClearFilters,
    activeFilterCount,
}: FilterToolbarProps) {
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState<'from' | 'to'>('from');
    const [viewDate, setViewDate] = useState(new Date());

    const sortRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const priorityRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setShowStatusDropdown(false);
            }
            if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
                setShowPriorityDropdown(false);
            }
            if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysArray: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) daysArray.push(null);
        for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);
        return daysArray;
    };

    const handleSelectDate = (day: number) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        if (datePickerMode === 'from') {
            onDateFromChange(selected);
            if (dateTo && selected > dateTo) {
                onDateToChange(null);
            }
        } else {
            onDateToChange(selected);
        }
        setShowDatePicker(false);
    };

    const isSelectedDate = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const checkDate = datePickerMode === 'from' ? dateFrom : dateTo;
        if (!checkDate) return false;
        return checkDate.getDate() === day &&
            checkDate.getMonth() === viewDate.getMonth() &&
            checkDate.getFullYear() === viewDate.getFullYear();
    };

    const isInRange = (day: number) => {
        if (!dateFrom || !dateTo) return false;
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return date >= dateFrom && date <= dateTo;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === viewDate.getMonth() &&
            today.getFullYear() === viewDate.getFullYear();
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by room, guest name, or description..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Date Range Picker */}
                    <div ref={dateRef} className="relative">
                        <button
                            onClick={() => {
                                setShowDatePicker(!showDatePicker);
                                setDatePickerMode('from');
                            }}
                            className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-colors ${dateFrom || dateTo
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>
                                {dateFrom && dateTo
                                    ? `${formatDate(dateFrom)} - ${formatDate(dateTo)}`
                                    : dateFrom
                                        ? `From ${formatDate(dateFrom)}`
                                        : 'Date Range'}
                            </span>
                            {(dateFrom || dateTo) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDateFromChange(null);
                                        onDateToChange(null);
                                    }}
                                    className="ml-1 p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-full"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </button>

                        {showDatePicker && (
                            <div className="absolute z-50 mt-1 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4 w-72">
                                {/* Date Range Tabs */}
                                <div className="flex gap-1 mb-3 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <button
                                        onClick={() => setDatePickerMode('from')}
                                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${datePickerMode === 'from'
                                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                                : 'text-slate-600 dark:text-slate-400'
                                            }`}
                                    >
                                        From: {dateFrom ? formatDate(dateFrom) : 'Select'}
                                    </button>
                                    <button
                                        onClick={() => setDatePickerMode('to')}
                                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${datePickerMode === 'to'
                                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                                : 'text-slate-600 dark:text-slate-400'
                                            }`}
                                    >
                                        To: {dateTo ? formatDate(dateTo) : 'Select'}
                                    </button>
                                </div>

                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <button
                                        onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </button>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                                    </span>
                                    <button
                                        onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </button>
                                </div>

                                {/* Days Header */}
                                <div className="grid grid-cols-7 gap-1 mb-1">
                                    {days.map((day) => (
                                        <div key={day} className="text-center text-xs font-medium text-slate-400 py-1">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-1">
                                    {getDaysInMonth(viewDate).map((day, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => day && handleSelectDate(day)}
                                            disabled={!day}
                                            className={`text-center text-sm py-2 rounded-lg transition-colors ${!day
                                                    ? 'invisible'
                                                    : isSelectedDate(day)
                                                        ? 'bg-indigo-600 text-white font-medium'
                                                        : isInRange(day)
                                                            ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                                                            : isToday(day)
                                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium'
                                                                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>

                                {/* Quick Selections */}
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1">
                                    <button
                                        onClick={() => {
                                            const today = new Date();
                                            onDateFromChange(today);
                                            onDateToChange(today);
                                            setShowDatePicker(false);
                                        }}
                                        className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => {
                                            const today = new Date();
                                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                            onDateFromChange(weekAgo);
                                            onDateToChange(today);
                                            setShowDatePicker(false);
                                        }}
                                        className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Last 7 Days
                                    </button>
                                    <button
                                        onClick={() => {
                                            const today = new Date();
                                            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                                            onDateFromChange(monthAgo);
                                            onDateToChange(today);
                                            setShowDatePicker(false);
                                        }}
                                        className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Last 30 Days
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div ref={statusRef} className="relative">
                        <button
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-colors ${statusFilter !== 'all'
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>{statusFilter === 'all' ? 'Status' : statusFilter}</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {showStatusDropdown && (
                            <div className="absolute z-40 mt-1 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[150px]">
                                {STATUS_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onStatusChange(opt.value);
                                            setShowStatusDropdown(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between ${statusFilter === opt.value ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {opt.label}
                                        {statusFilter === opt.value && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Priority Filter */}
                    <div ref={priorityRef} className="relative">
                        <button
                            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                            className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-colors ${priorityFilter !== 'all'
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                                }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>{priorityFilter === 'all' ? 'Priority' : (priorityFilter === null ? 'Unset' : priorityFilter)}</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {showPriorityDropdown && (
                            <div className="absolute z-40 mt-1 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[160px]">
                                {PRIORITY_FILTER_OPTIONS.map(opt => (
                                    <button
                                        key={String(opt.value)}
                                        onClick={() => {
                                            onPriorityChange(opt.value);
                                            setShowPriorityDropdown(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between ${priorityFilter === opt.value ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {opt.value !== 'all' && opt.value !== null ? (
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getIncidentPriorityColor(opt.value)}`}>
                                                {opt.label}
                                            </span>
                                        ) : (
                                            opt.label
                                        )}
                                        {priorityFilter === opt.value && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div ref={sortRef} className="relative">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">Sort</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {showSortDropdown && (
                            <div className="absolute z-40 mt-1 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[180px]">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onSortChange(opt.value);
                                            setShowSortDropdown(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between ${sortBy === opt.value ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {opt.label}
                                        {sortBy === opt.value && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear Filters */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={onClearFilters}
                            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear ({activeFilterCount})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Priority options for dropdown
const PRIORITY_OPTIONS: { value: IncidentPriority; label: string }[] = [
    { value: 'Immediate Fix', label: 'Immediate Fix' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
];

// Priority sort order
const PRIORITY_ORDER: Record<string, number> = {
    'Immediate Fix': 0,
    'Medium': 1,
    'Low': 2,
    'null': 3,
};

// ============================================
// MANAGER VIEW COMPONENTS
// ============================================

function ManagerIncidentCard({
    incident,
    onSetPriority,
    onAssign,
}: {
    incident: Incident;
    onSetPriority: (id: string, priority: IncidentPriority) => void;
    onAssign: (id: string) => void;
}) {
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const priorityColor = getIncidentPriorityColor(incident.priority);
    const needsPriority = incident.priority === null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all">
            <div className="flex gap-4">
                {/* Guest Photo Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                    <img
                        src={incident.guestReportPhoto}
                        alt="Incident"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">
                                    #{incident.roomNumber}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    • {incident.guestName}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Clock className="w-3.5 h-3.5" />
                                {incident.reportedAt}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                        {incident.description}
                    </p>

                    {/* Priority & Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Priority Badge or Selector */}
                        {needsPriority ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                                >
                                    Set Priority
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                {showPriorityDropdown && (
                                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                                        {PRIORITY_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    onSetPriority(incident.id, opt.value);
                                                    setShowPriorityDropdown(false);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getIncidentPriorityColor(opt.value)}`}>
                                                    {opt.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${priorityColor}`}>
                                {incident.priority}
                            </span>
                        )}

                        {/* Assign Button */}
                        <button
                            onClick={() => onAssign(incident.id)}
                            disabled={needsPriority}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${needsPriority
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            <Send className="w-3.5 h-3.5" />
                            Assign to Staff
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AssignedIncidentCard({ incident }: { incident: Incident }) {
    const priorityColor = getIncidentPriorityColor(incident.priority);
    const statusColor = getIncidentStatusColor(incident.status);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 opacity-80">
            <div className="flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                    <img
                        src={incident.guestReportPhoto}
                        alt="Incident"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                                #{incident.roomNumber}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                • {incident.guestName}
                            </span>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor}`}>
                            {incident.status}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">
                        {incident.description}
                    </p>
                    <div className="flex items-center gap-2">
                        {incident.priority && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColor}`}>
                                {incident.priority}
                            </span>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {incident.reportedAt}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAINTENANCE STAFF VIEW COMPONENTS
// ============================================

function StaffIncidentCard({
    incident,
    onClick,
}: {
    incident: Incident;
    onClick: () => void;
}) {
    const priorityColor = getIncidentPriorityColor(incident.priority);
    const statusColor = getIncidentStatusColor(incident.status);
    const isResolved = incident.status === 'Resolved';

    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all cursor-pointer ${isResolved ? 'opacity-60' : ''
                }`}
        >
            <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                    <img
                        src={incident.guestReportPhoto}
                        alt="Incident"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                #{incident.roomNumber}
                            </span>
                            {incident.priority && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColor}`}>
                                    {incident.priority}
                                </span>
                            )}
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor}`}>
                            {incident.status}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {incident.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {incident.reportedAt}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StaffIncidentModal({
    incident,
    isOpen,
    onClose,
    onResolve,
}: {
    incident: Incident | null;
    isOpen: boolean;
    onClose: () => void;
    onResolve: (incidentId: string) => void;
}) {
    const [proofUploaded, setProofUploaded] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen || !incident) return null;

    const priorityColor = getIncidentPriorityColor(incident.priority);
    const statusColor = getIncidentStatusColor(incident.status);
    const isResolved = incident.status === 'Resolved';
    const canResolve = proofUploaded || incident.resolvedPhoto || isResolved;

    const handleUploadProof = () => {
        setIsUploading(true);
        setTimeout(() => {
            setProofUploaded(true);
            setIsUploading(false);
        }, 1000);
    };

    const handleMarkCompleted = () => {
        onResolve(incident.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Room #{incident.roomNumber}
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                        <div className="flex gap-2 mb-4">
                            {incident.priority && (
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${priorityColor}`}>
                                    {incident.priority}
                                </span>
                            )}
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                                {incident.status}
                            </span>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Issue Description
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">{incident.description}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Guest Report Photo
                            </h3>
                            <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                <img src={incident.guestReportPhoto} alt="Guest reported issue" className="w-full h-48 object-cover" />
                            </div>
                        </div>

                        {!isResolved && (
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Proof of Work
                                </h3>
                                {proofUploaded ? (
                                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-sm text-emerald-700 dark:text-emerald-300">
                                            Proof photo uploaded successfully
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleUploadProof}
                                        disabled={isUploading}
                                        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Camera className="w-5 h-5 text-slate-400" />
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Upload Proof Photo</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        {incident.resolvedPhoto && (
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Resolution Photo</h3>
                                <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                    <img src={incident.resolvedPhoto} alt="Resolution proof" className="w-full h-48 object-cover" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Close
                            </button>
                            {!isResolved && (
                                <button
                                    onClick={handleMarkCompleted}
                                    disabled={!canResolve}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${canResolve
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                        }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Mark Completed
                                </button>
                            )}
                        </div>
                        {!canResolve && !isResolved && (
                            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                                Upload proof photo to enable completion
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function IncidentsPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Filter & Sort state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');
    const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | 'all'>('all');
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);

    const isManager = user?.role === 'hotel_manager';
    const isMaintenanceStaff = user?.role === 'maintenance_staff';

    // Calculate active filter count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (statusFilter !== 'all') count++;
        if (priorityFilter !== 'all') count++;
        if (dateFrom || dateTo) count++;
        return count;
    }, [searchQuery, statusFilter, priorityFilter, dateFrom, dateTo]);

    // Clear all filters
    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setPriorityFilter('all');
        setDateFrom(null);
        setDateTo(null);
        setSortBy('date-desc');
    };

    // Helper function to parse relative time strings for sorting
    const parseReportedTime = (timeStr: string): number => {
        const now = new Date().getTime();
        if (timeStr.includes('min')) {
            const mins = parseInt(timeStr) || 0;
            return now - mins * 60 * 1000;
        }
        if (timeStr.includes('hour')) {
            const hours = parseInt(timeStr) || 0;
            return now - hours * 60 * 60 * 1000;
        }
        if (timeStr.includes('day')) {
            const days = parseInt(timeStr) || 0;
            return now - days * 24 * 60 * 60 * 1000;
        }
        return now;
    };

    // Apply filters and sorting
    const applyFiltersAndSort = (incidentList: Incident[]): Incident[] => {
        let filtered = [...incidentList];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(inc =>
                inc.roomNumber.toLowerCase().includes(query) ||
                inc.guestName.toLowerCase().includes(query) ||
                inc.description.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(inc => inc.status === statusFilter);
        }

        // Priority filter
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(inc => inc.priority === priorityFilter);
        }

        // Date filter (simulated - since we have relative times, we'll approximate)
        // In a real app, you'd have actual Date objects
        if (dateFrom || dateTo) {
            // For demo purposes, we'll skip date filtering on mock data
            // In production, filter based on actual timestamp comparison
        }

        // Sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return parseReportedTime(b.reportedAt) - parseReportedTime(a.reportedAt);
                case 'date-asc':
                    return parseReportedTime(a.reportedAt) - parseReportedTime(b.reportedAt);
                case 'priority-high':
                    return (PRIORITY_ORDER[String(a.priority)] ?? 3) - (PRIORITY_ORDER[String(b.priority)] ?? 3);
                case 'priority-low':
                    return (PRIORITY_ORDER[String(b.priority)] ?? 3) - (PRIORITY_ORDER[String(a.priority)] ?? 3);
                case 'room-asc':
                    return a.roomNumber.localeCompare(b.roomNumber);
                case 'room-desc':
                    return b.roomNumber.localeCompare(a.roomNumber);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    // Manager: Filter incoming (unassigned) and assigned incidents
    const incomingIncidents = useMemo(() => {
        const baseList = incidents.filter(inc => inc.assignedToUserId === null && inc.status === 'Reported');
        return applyFiltersAndSort(baseList);
    }, [incidents, searchQuery, sortBy, statusFilter, priorityFilter, dateFrom, dateTo]);

    const assignedIncidents = useMemo(() => {
        const baseList = incidents.filter(inc => inc.assignedToUserId !== null);
        return applyFiltersAndSort(baseList);
    }, [incidents, searchQuery, sortBy, statusFilter, priorityFilter, dateFrom, dateTo]);

    // Maintenance Staff: Filter only their assigned incidents
    const myIncidents = useMemo(() => {
        const baseList = incidents.filter(inc => inc.assignedToUserId === user?.id);
        return applyFiltersAndSort(baseList);
    }, [incidents, user?.id, searchQuery, sortBy, statusFilter, priorityFilter, dateFrom, dateTo]);

    const activeStaffIncidents = myIncidents.filter(inc => inc.status !== 'Resolved');
    const resolvedStaffIncidents = myIncidents.filter(inc => inc.status === 'Resolved');

    // Pagination for manager view (assigned incidents)
    const totalPagesAssigned = Math.max(1, Math.ceil(assignedIncidents.length / rowsPerPage));
    const paginatedAssignedIncidents = assignedIncidents.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Reset page when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [rowsPerPage]);

    // Manager Actions
    const handleSetPriority = (incidentId: string, priority: IncidentPriority) => {
        setIncidents(prev =>
            prev.map(inc =>
                inc.id === incidentId ? { ...inc, priority } : inc
            )
        );
        addToast('success', 'Priority Set', `Incident priority updated to "${priority}".`);
    };

    const handleAssignToStaff = (incidentId: string) => {
        setIncidents(prev =>
            prev.map(inc =>
                inc.id === incidentId
                    ? { ...inc, assignedToUserId: MAINTENANCE_STAFF_USER_ID, status: 'Assigned' as const }
                    : inc
            )
        );
        addToast('success', 'Incident Assigned', 'Incident has been sent to maintenance staff.');
    };

    // Maintenance Staff Actions
    const handleOpenIncident = (incident: Incident) => {
        setSelectedIncident(incident);
        setModalOpen(true);
    };

    const handleResolveIncident = (incidentId: string) => {
        setIncidents(prev =>
            prev.map(inc =>
                inc.id === incidentId
                    ? { ...inc, status: 'Resolved' as const, resolvedPhoto: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=400' }
                    : inc
            )
        );
        addToast('success', 'Incident Resolved', 'Great work! The incident has been marked as completed.');
    };

    // ========== MANAGER VIEW ==========
    if (isManager) {
        return (
            <HotelLayout>
                <div className="max-w-5xl mx-auto">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/hotel' },
                            { label: 'Incidents' },
                        ]}
                    />

                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Incident Management</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Review guest-reported incidents and assign to maintenance staff
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Toolbar */}
                    <FilterToolbar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        priorityFilter={priorityFilter}
                        onPriorityChange={setPriorityFilter}
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        onDateFromChange={setDateFrom}
                        onDateToChange={setDateTo}
                        onClearFilters={handleClearFilters}
                        activeFilterCount={activeFilterCount}
                    />

                    {/* Incoming Incidents */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold rounded-full">
                                {incomingIncidents.length}
                            </span>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Incoming Reports
                            </h2>
                            {activeFilterCount > 0 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    (filtered)
                                </span>
                            )}
                        </div>
                        {incomingIncidents.length > 0 ? (
                            <div className="space-y-3">
                                {incomingIncidents.map(incident => (
                                    <ManagerIncidentCard
                                        key={incident.id}
                                        incident={incident}
                                        onSetPriority={handleSetPriority}
                                        onAssign={handleAssignToStaff}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                {activeFilterCount > 0 ? (
                                    <>
                                        <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                        <p className="text-slate-500 dark:text-slate-400">No incidents match your filters</p>
                                        <button
                                            onClick={handleClearFilters}
                                            className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Clear filters
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                                        <p className="text-slate-500 dark:text-slate-400">No pending incidents to review</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Assigned Incidents */}
                    <div>
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                            Assigned ({assignedIncidents.length})
                        </h2>
                        <div className="space-y-2">
                            {paginatedAssignedIncidents.map(incident => (
                                <AssignedIncidentCard key={incident.id} incident={incident} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {assignedIncidents.length > 0 && (
                            <div className="mt-4 py-3 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Rows per page:</span>
                                    <select
                                        value={rowsPerPage}
                                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                        className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {assignedIncidents.length > 0 
                                            ? `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, assignedIncidents.length)} of ${assignedIncidents.length}` 
                                            : '0 items'}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4 text-slate-500" />
                                        </button>
                                        <span className="px-2 text-sm text-slate-700 dark:text-slate-300">
                                            {currentPage} / {totalPagesAssigned}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPagesAssigned}
                                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4 text-slate-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </HotelLayout>
        );
    }

    // ========== MAINTENANCE STAFF VIEW ==========
    return (
        <HotelLayout>
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/hotel' },
                        { label: 'Incidents' },
                    ]}
                />

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Incidents</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {activeStaffIncidents.length} active task{activeStaffIncidents.length !== 1 ? 's' : ''} assigned to you
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <FilterToolbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    priorityFilter={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    onDateFromChange={setDateFrom}
                    onDateToChange={setDateTo}
                    onClearFilters={handleClearFilters}
                    activeFilterCount={activeFilterCount}
                />

                {activeStaffIncidents.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Active Tasks ({activeStaffIncidents.length})
                            </h2>
                            {activeFilterCount > 0 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    (filtered)
                                </span>
                            )}
                        </div>
                        <div className="space-y-3">
                            {activeStaffIncidents.map(incident => (
                                <StaffIncidentCard
                                    key={incident.id}
                                    incident={incident}
                                    onClick={() => handleOpenIncident(incident)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeStaffIncidents.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
                        {activeFilterCount > 0 ? (
                            <>
                                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No matching incidents</h3>
                                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
                                <button
                                    onClick={handleClearFilters}
                                    className="mt-3 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">All caught up!</h3>
                                <p className="text-slate-500 dark:text-slate-400">You have no active incidents assigned to you.</p>
                            </>
                        )}
                    </div>
                )}

                {resolvedStaffIncidents.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                            Completed ({resolvedStaffIncidents.length})
                        </h2>
                        <div className="space-y-3">
                            {resolvedStaffIncidents.map(incident => (
                                <StaffIncidentCard
                                    key={incident.id}
                                    incident={incident}
                                    onClick={() => handleOpenIncident(incident)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <StaffIncidentModal
                incident={selectedIncident}
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedIncident(null);
                }}
                onResolve={handleResolveIncident}
            />
        </HotelLayout>
    );
}


