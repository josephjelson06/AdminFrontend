'use client';

import { useState, useMemo } from 'react';
import { Cpu, Wifi, WifiOff, AlertTriangle, Clock, RefreshCw, Search } from 'lucide-react';
import { MOCK_KIOSKS, MOCK_HOTELS } from '@/lib/mock-data';
import type { KioskStatus } from '@/types/schema';
import { FilterChips, SearchFilter } from '@/components/ui/Filters';
import { Pagination } from '@/components/ui/Pagination';

function StatusIcon({ status }: { status: KioskStatus }) {
    const config: Record<KioskStatus, { icon: typeof Wifi; color: string; bg: string }> = {
        online: { icon: Wifi, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        offline: { icon: WifiOff, color: 'text-rose-600', bg: 'bg-rose-100' },
        warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
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
        online: 'bg-emerald-100 text-emerald-700',
        offline: 'bg-rose-100 text-rose-700',
        warning: 'bg-amber-100 text-amber-700',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
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

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Kiosk Fleet</h1>
                    <p className="text-sm text-slate-500">Manage and monitor all deployed kiosks</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                            <Wifi className="w-4 h-4" />
                            {onlineCount} online
                        </span>
                        <span className="flex items-center gap-1.5 text-rose-500">
                            <WifiOff className="w-4 h-4" />
                            {offlineCount} offline
                        </span>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
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
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-sm text-slate-500">
                            Showing {filteredKiosks.length} of {MOCK_KIOSKS.length} kiosks
                        </span>
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-slate-500 hover:text-slate-700 underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Kiosk Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {paginatedKiosks.map((kiosk) => {
                    const hotel = MOCK_HOTELS.find((h) => h.id === kiosk.assignedHotelId);

                    return (
                        <div
                            key={kiosk.id}
                            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <StatusIcon status={kiosk.status} />
                                <StatusBadge status={kiosk.status} />
                            </div>

                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Cpu className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-900">{kiosk.serialNumber}</span>
                                </div>
                                <p className="text-xs text-slate-500">{kiosk.model}</p>
                            </div>

                            {hotel && (
                                <div className="text-xs text-slate-600 mb-3 py-2 px-2 bg-slate-50 rounded">
                                    📍 {hotel.name}
                                </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {kiosk.lastHeartbeat}
                                </span>
                                <span className="font-mono text-slate-400">v{kiosk.firmwareVersion}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredKiosks.length === 0 && (
                <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No kiosks found</h3>
                    <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Pagination */}
            {filteredKiosks.length > 0 && (
                <div className="bg-white rounded-lg border border-slate-200">
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
