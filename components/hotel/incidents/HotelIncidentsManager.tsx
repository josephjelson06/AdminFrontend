'use client';

/**
 * HotelIncidentsManager Component
 * 
 * Main incidents management component with role-based views:
 * - Manager view: Review, prioritize, and assign incidents
 * - Staff view: View and resolve assigned incidents
 */

import {
    AlertTriangle,
    Camera,
    CheckCircle2,
    Clock,
    X,
    Send,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Calendar,
    SlidersHorizontal,
    ArrowUpDown,
    Filter,
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { Breadcrumbs } from '@/components/shared/ui/Breadcrumbs';
import { useAuth } from '@/lib/shared/auth';
import { useToast } from '@/components/shared/ui/Toast';
import { useHotelIncidents } from './useHotelIncidents';
import {
    type Incident,
    type IncidentPriority,
    type IncidentStatus,
    getIncidentPriorityColor,
    getIncidentStatusColor,
} from '@/lib/hotel/hotel-data';
import {
    SORT_OPTIONS,
    STATUS_OPTIONS,
    PRIORITY_FILTER_OPTIONS,
    PRIORITY_OPTIONS,
    type SortOption,
} from '@/lib/services/hotelIncidentsService';

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
    onClearFilters,
    activeFilterCount,
}: FilterToolbarProps) {
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

    const sortRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const priorityRef = useRef<HTMLDivElement>(null);

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
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

// ============================================
// INCIDENT CARDS
// ============================================

function IncidentCard({
    incident,
    onSetPriority,
    onAssign,
    onClick,
    showActions = false,
}: {
    incident: Incident;
    onSetPriority?: (id: string, priority: IncidentPriority) => void;
    onAssign?: (id: string) => void;
    onClick?: () => void;
    showActions?: boolean;
}) {
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const priorityColor = getIncidentPriorityColor(incident.priority);
    const statusColor = getIncidentStatusColor(incident.status);
    const needsPriority = incident.priority === null;
    const isResolved = incident.status === 'Resolved';

    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all ${onClick ? 'cursor-pointer' : ''} ${isResolved ? 'opacity-60' : ''}`}
        >
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
                        {!showActions && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor}`}>
                                {incident.status}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                        {incident.description}
                    </p>

                    {/* Priority & Actions */}
                    {showActions ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            {needsPriority && onSetPriority ? (
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPriorityDropdown(!showPriorityDropdown);
                                        }}
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                            ) : incident.priority && (
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${priorityColor}`}>
                                    {incident.priority}
                                </span>
                            )}

                            {/* Assign Button */}
                            {onAssign && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAssign(incident.id);
                                    }}
                                    disabled={needsPriority}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${needsPriority
                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Assign to Staff
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {incident.priority && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColor}`}>
                                    {incident.priority}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================
// INCIDENT DETAIL MODAL
// ============================================

function IncidentModal({
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
// MAIN MANAGER COMPONENT
// ============================================

export function HotelIncidentsManager() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const {
        incidents,
        filteredIncidents,
        paginatedIncidents,
        totalPages,
        currentPage,
        rowsPerPage,
        setCurrentPage,
        setRowsPerPage,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        activeFilterCount,
        clearFilters,
        setPriority,
        assignIncident,
        resolveIncident,
        selectedIncident,
        setSelectedIncident,
        isLoading,
    } = useHotelIncidents();

    const [modalOpen, setModalOpen] = useState(false);

    const isManager = user?.role === 'hotel_manager';

    // Split incidents for manager view
    const incomingIncidents = incidents.filter(inc => inc.assignedToUserId === null && inc.status === 'Reported');
    const assignedIncidents = incidents.filter(inc => inc.assignedToUserId !== null);

    // Split incidents for staff view
    const myIncidents = incidents.filter(inc => inc.assignedToUserId === user?.id);
    const activeStaffIncidents = myIncidents.filter(inc => inc.status !== 'Resolved');
    const resolvedStaffIncidents = myIncidents.filter(inc => inc.status === 'Resolved');

    const handleSetPriority = async (incidentId: string, priority: IncidentPriority) => {
        const success = await setPriority(incidentId, priority);
        if (success) {
            addToast('success', 'Priority Set', `Incident priority updated to "${priority}".`);
        }
    };

    const handleAssign = async (incidentId: string) => {
        const success = await assignIncident(incidentId);
        if (success) {
            addToast('success', 'Incident Assigned', 'Incident has been sent to maintenance staff.');
        }
    };

    const handleResolve = async (incidentId: string) => {
        const success = await resolveIncident(incidentId);
        if (success) {
            addToast('success', 'Incident Resolved', 'Great work! The incident has been marked as completed.');
        }
    };

    const handleOpenIncident = (incident: Incident) => {
        setSelectedIncident(incident);
        setModalOpen(true);
    };

    if (isLoading) {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    // ========== MANAGER VIEW ==========
    if (isManager) {
        return (
            <HotelLayout>
                <div className="max-w-full mx-auto">
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

                    <FilterToolbar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        priorityFilter={priorityFilter}
                        onPriorityChange={setPriorityFilter}
                        onClearFilters={clearFilters}
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
                        </div>
                        {incomingIncidents.length > 0 ? (
                            <div className="space-y-3">
                                {incomingIncidents.map(incident => (
                                    <IncidentCard
                                        key={incident.id}
                                        incident={incident}
                                        onSetPriority={handleSetPriority}
                                        onAssign={handleAssign}
                                        showActions
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400">No pending incidents to review</p>
                            </div>
                        )}
                    </div>

                    {/* Assigned Incidents */}
                    <div>
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                            Assigned ({assignedIncidents.length})
                        </h2>
                        <div className="space-y-2">
                            {assignedIncidents.map(incident => (
                                <IncidentCard key={incident.id} incident={incident} />
                            ))}
                        </div>
                    </div>
                </div>
            </HotelLayout>
        );
    }

    // ========== MAINTENANCE STAFF VIEW ==========
    return (
        <HotelLayout>
            <div className="max-w-full mx-auto">
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

                <FilterToolbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    priorityFilter={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                    onClearFilters={clearFilters}
                    activeFilterCount={activeFilterCount}
                />

                {activeStaffIncidents.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                            Active Tasks ({activeStaffIncidents.length})
                        </h2>
                        <div className="space-y-3">
                            {activeStaffIncidents.map(incident => (
                                <IncidentCard
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
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">All caught up!</h3>
                        <p className="text-slate-500 dark:text-slate-400">You have no active incidents assigned to you.</p>
                    </div>
                )}

                {resolvedStaffIncidents.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                            Completed ({resolvedStaffIncidents.length})
                        </h2>
                        <div className="space-y-3">
                            {resolvedStaffIncidents.map(incident => (
                                <IncidentCard
                                    key={incident.id}
                                    incident={incident}
                                    onClick={() => handleOpenIncident(incident)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <IncidentModal
                incident={selectedIncident}
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedIncident(null);
                }}
                onResolve={handleResolve}
            />
        </HotelLayout>
    );
}
