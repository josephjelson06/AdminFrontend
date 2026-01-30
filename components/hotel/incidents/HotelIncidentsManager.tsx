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
import { motion } from 'framer-motion';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { Breadcrumbs } from '@/components/shared/ui/Breadcrumbs';
import { useAuth } from '@/lib/shared/auth';
import { useToast } from '@/components/shared/ui/Toast';
import { useHotelIncidents } from './useHotelIncidents';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    type Incident,
    type IncidentPriority,
    type IncidentStatus,
    getIncidentPriorityColor,
    getIncidentStatusColor,
} from '@/lib/hotel/hotel-data';
import {
    type SortOption,
} from '@/lib/services/hotelIncidentsService';
import { IncidentCard } from './IncidentCard';
import { IncidentFilterToolbar } from './IncidentFilterToolbar';



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
        <div className="fixed inset-0 z-[60] overflow-y-auto">
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
        isLoading,
    } = useHotelIncidents();

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

                    <IncidentFilterToolbar
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                <IncidentFilterToolbar
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeStaffIncidents.map(incident => (
                                <IncidentCard
                                    key={incident.id}
                                    incident={incident}
                                    onResolve={handleResolve}
                                    showActions
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resolvedStaffIncidents.map(incident => (
                                <IncidentCard
                                    key={incident.id}
                                    incident={incident}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </HotelLayout>
    );
}
