'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Cpu,
    Wifi,
    WifiOff,
    AlertTriangle,
    Clock,
    RefreshCw,
    Search,
    Eye,
    Building2,
    Settings,
    MoreVertical,
    Plus,
} from 'lucide-react';
import { MOCK_KIOSKS, MOCK_HOTELS } from '@/lib/admin/mock-data';
import type { KioskStatus, Kiosk } from '@/types/schema';
import { FilterChips, SearchFilter } from '@/components/shared/ui/Filters';
import { Pagination } from '@/components/shared/ui/Pagination';

function StatusIcon({ status }: { status: KioskStatus }) {
    const config: Record<KioskStatus, { icon: typeof Wifi; color: string; bg: string }> = {
        online: { icon: Wifi, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        offline: { icon: WifiOff, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
        warning: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    };

    const { icon: Icon, color, bg } = config[status];
    return (
        <div className={`p-2 rounded-lg ${bg}`}>
            <Icon className={`w-5 h-5 ${color}`} />
        </div>
    );
}

function StatusBadge({ status }: { status: KioskStatus }) {
    const styles: Record<KioskStatus, string> = {
        online: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        offline: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

// Parse heartbeat time and determine urgency
function getHeartbeatUrgency(heartbeat: string) {
    // Parse "X min ago" or "X hr ago" format
    const minMatch = heartbeat.match(/(\d+)\s*min/);
    const hrMatch = heartbeat.match(/(\d+)\s*hr/);

    let minutes = 0;
    if (minMatch) minutes = parseInt(minMatch[1]);
    if (hrMatch) minutes = parseInt(hrMatch[1]) * 60;

    if (minutes > 60) return { class: 'text-rose-600 dark:text-rose-400', urgent: true };
    if (minutes > 30) return { class: 'text-amber-600 dark:text-amber-400', urgent: true };
    return { class: 'text-slate-500 dark:text-slate-400', urgent: false };
}

const ITEMS_PER_PAGE = 6;

export default function FleetPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [modelFilter, setModelFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Get unique models
    const models = useMemo(() => {
        const unique = [...new Set(MOCK_KIOSKS.map((k) => k.model))];
        return unique.map((model) => ({
            value: model,
            label: model,
            count: MOCK_KIOSKS.filter((k) => k.model === model).length,
        }));
    }, []);

    // Status filter options with counts
    const statusOptions = useMemo(() => [
        { value: 'online', label: 'Online', count: MOCK_KIOSKS.filter((k) => k.status === 'online').length },
        { value: 'offline', label: 'Offline', count: MOCK_KIOSKS.filter((k) => k.status === 'offline').length },
        { value: 'warning', label: 'Warning', count: MOCK_KIOSKS.filter((k) => k.status === 'warning').length },
    ], []);

    // Filter kiosks
    const filteredKiosks = useMemo(() => {
        return MOCK_KIOSKS.filter((kiosk) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const hotel = MOCK_HOTELS.find((h) => h.id === kiosk.assignedHotelId);
                const matchesSearch =
                    kiosk.serialNumber.toLowerCase().includes(query) ||
                    kiosk.model.toLowerCase().includes(query) ||
                    hotel?.name.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Status filter
            if (statusFilter.length > 0 && !statusFilter.includes(kiosk.status)) {
                return false;
            }

            // Model filter
            if (modelFilter.length > 0 && !modelFilter.includes(kiosk.model)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, statusFilter, modelFilter]);

    // Paginate
    const totalPages = Math.ceil(filteredKiosks.length / ITEMS_PER_PAGE);
    const paginatedKiosks = filteredKiosks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset to page 1 when filters change
    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, values: string[]) => {
        setter(values);
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setStatusFilter([]);
        setModelFilter([]);
        setCurrentPage(1);
    };

    const hasActiveFilters = searchQuery || statusFilter.length > 0 || modelFilter.length > 0;

    // Stats
    const onlineCount = MOCK_KIOSKS.filter((k) => k.status === 'online').length;
    const offlineCount = MOCK_KIOSKS.filter((k) => k.status === 'offline').length;
    const warningCount = MOCK_KIOSKS.filter((k) => k.status === 'warning').length;

    return (
        <div className="p-6">
            {/* Page Header - Enhanced */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Kiosk Fleet</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage and monitor all deployed kiosks • {MOCK_KIOSKS.length} total
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Status Stats Bar */}
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <Wifi className="w-4 h-4" />
                            <span className="font-medium">{onlineCount}</span>
                        </span>
                        <span className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                        <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                            <WifiOff className="w-4 h-4" />
                            <span className="font-medium">{offlineCount}</span>
                        </span>
                        <span className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                        <span className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium">{warningCount}</span>
                        </span>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Register Kiosk
                    </button>
                </div>
            </div>

            {/* Filters - Updated with dark mode */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <SearchFilter
                            value={searchQuery}
                            onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
                            placeholder="Search serial, model, hotel..."
                        />
                        <FilterChips
                            label="Status"
                            options={statusOptions}
                            selected={statusFilter}
                            onChange={(v) => handleFilterChange(setStatusFilter, v)}
                        />
                    </div>
                    <FilterChips
                        label="Model"
                        options={models}
                        selected={modelFilter}
                        onChange={(v) => handleFilterChange(setModelFilter, v)}
                    />
                </div>

                {hasActiveFilters && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Showing {filteredKiosks.length} of {MOCK_KIOSKS.length} kiosks
                        </span>
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Kiosk Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {paginatedKiosks.map((kiosk) => {
                    const hotel = MOCK_HOTELS.find((h) => h.id === kiosk.assignedHotelId);
                    const heartbeatUrgency = getHeartbeatUrgency(kiosk.lastHeartbeat);

                    return (
                        <div
                            key={kiosk.id}
                            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <StatusIcon status={kiosk.status} />
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={kiosk.status} />
                                    <button
                                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Cpu className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {kiosk.serialNumber}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{kiosk.model}</p>
                            </div>

                            {hotel && (
                                <Link
                                    href={`/hotels/${hotel.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3 py-2 px-2 bg-slate-50 dark:bg-slate-700/50 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <Building2 className="w-3.5 h-3.5" />
                                    {hotel.name}
                                </Link>
                            )}

                            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-700">
                                <span className={`flex items-center gap-1 ${heartbeatUrgency.class}`}>
                                    <Clock className="w-3 h-3" />
                                    {kiosk.lastHeartbeat}
                                    {heartbeatUrgency.urgent && <AlertTriangle className="w-3 h-3" />}
                                </span>
                                <span className="font-mono text-slate-400 dark:text-slate-500">v{kiosk.firmwareVersion}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State - Dark mode */}
            {filteredKiosks.length === 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
                    <Cpu className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No kiosks found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Try adjusting your search or filters</p>
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Pagination - Dark mode */}
            {filteredKiosks.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredKiosks.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
