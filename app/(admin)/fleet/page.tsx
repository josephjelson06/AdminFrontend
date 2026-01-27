'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    Cpu,
    Wifi,
    WifiOff,
    AlertTriangle,
    Clock,
    RefreshCw,
    MoreVertical,
    Plus,
    LayoutGrid,
    FileCode,
    Building2,
    Power,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { MOCK_KIOSKS, MOCK_HOTELS } from '@/lib/admin/mock-data';
import type { KioskStatus } from '@/types/schema';
import { FilterChips, SearchFilter } from '@/components/shared/ui/Filters';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';
import { FirmwareList } from '@/components/admin/fleet/FirmwareList';

// Helper: Heartbeat Logic
function getHeartbeatUrgency(heartbeat: string) {
    const minMatch = heartbeat.match(/(\d+)\s*min/);
    const hrMatch = heartbeat.match(/(\d+)\s*hr/);
    let minutes = 0;
    if (minMatch) minutes = parseInt(minMatch[1]);
    if (hrMatch) minutes = parseInt(hrMatch[1]) * 60;

    if (minutes > 60) return { class: 'text-danger', urgent: true };
    if (minutes > 30) return { class: 'text-warning', urgent: true };
    return { class: 'text-muted', urgent: false };
}

// Pagination Footer Component
function PaginationFooter({
    currentPage,
    totalPages,
    rowsPerPage,
    totalItems,
    onPageChange,
    onRowsPerPageChange,
}: {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
}) {
    const startItem = totalItems > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <div className="py-3 px-4 border-t border-glass surface-glass-soft rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Rows per page:</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="input-glass !w-auto !py-1"
                >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={15}>15</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted">
                    {totalItems > 0 ? `${startItem}–${endItem} of ${totalItems}` : '0 items'}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast"
                    >
                        <ChevronLeft className="w-4 h-4 text-muted" />
                    </button>
                    <span className="px-2 text-sm text-secondary-text">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-1.5 rounded-lg glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast"
                    >
                        <ChevronRight className="w-4 h-4 text-muted" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FleetPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'devices' | 'firmware'>('devices');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [modelFilter, setModelFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    // Reset to page 1 when filters or rowsPerPage change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, modelFilter, rowsPerPage]);

    // -- Filter Logic --
    const models = useMemo(() => {
        const unique = [...new Set(MOCK_KIOSKS.map((k) => k.model))];
        return unique.map((model) => ({
            value: model,
            label: model,
            count: MOCK_KIOSKS.filter((k) => k.model === model).length,
        }));
    }, []);

    const filteredKiosks = useMemo(() => {
        return MOCK_KIOSKS.filter((kiosk) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const hotel = MOCK_HOTELS.find((h) => h.id === kiosk.assignedHotelId);
                const matchesSearch =
                    kiosk.serialNumber.toLowerCase().includes(query) ||
                    kiosk.model.toLowerCase().includes(query) ||
                    hotel?.name.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }
            if (statusFilter.length > 0 && !statusFilter.includes(kiosk.status)) return false;
            if (modelFilter.length > 0 && !modelFilter.includes(kiosk.model)) return false;
            return true;
        });
    }, [searchQuery, statusFilter, modelFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredKiosks.length / rowsPerPage));
    const paginatedKiosks = filteredKiosks.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const onlineCount = MOCK_KIOSKS.filter((k) => k.status === 'online').length;
    const offlineCount = MOCK_KIOSKS.filter((k) => k.status === 'offline').length;

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-normal">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Kiosk Fleet</h1>
                    <p className="text-sm text-muted">Manage devices, firmware, and remote commands</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex surface-glass-soft p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('devices')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-fast ${activeTab === 'devices'
                                ? 'surface-glass-strong text-primary shadow-sm'
                                : 'text-muted hover:text-secondary-text'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4 inline-block mr-2" />
                        Devices
                    </button>
                    <button
                        onClick={() => setActiveTab('firmware')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-fast ${activeTab === 'firmware'
                                ? 'surface-glass-strong text-primary shadow-sm'
                                : 'text-muted hover:text-secondary-text'
                            }`}
                    >
                        <FileCode className="w-4 h-4 inline-block mr-2" />
                        Firmware
                    </button>
                </div>
            </div>

            {/* TAB: DEVICES */}
            {activeTab === 'devices' && (
                <>
                    {/* Filters */}
                    <GlassCard className="p-4 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <SearchFilter
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search serial or hotel..."
                            />
                            <FilterChips
                                label="Status"
                                selected={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'online', label: 'Online' },
                                    { value: 'offline', label: 'Offline' }
                                ]}
                            />
                        </div>
                        <div className="flex gap-3 text-sm font-medium">
                            <span className="text-success flex items-center gap-1">
                                <Wifi className="w-4 h-4" /> {onlineCount} Online
                            </span>
                            <span className="text-danger flex items-center gap-1">
                                <WifiOff className="w-4 h-4" /> {offlineCount} Offline
                            </span>
                        </div>
                    </GlassCard>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedKiosks.map((kiosk) => {
                            const hotel = MOCK_HOTELS.find((h) => h.id === kiosk.assignedHotelId);
                            const urgency = getHeartbeatUrgency(kiosk.lastHeartbeat);

                            return (
                                <GlassCard key={kiosk.id} className="p-5 hover:border-primary/50 transition-all duration-normal group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${kiosk.status === 'online' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                            {kiosk.status === 'online' ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                                        </div>
                                        <Dropdown
                                            trigger={
                                                <button className="p-1 glass-hover rounded-lg transition-all duration-fast">
                                                    <MoreVertical className="w-4 h-4 text-muted" />
                                                </button>
                                            }
                                            align="right"
                                        >
                                            <DropdownItem onClick={() => addToast('success', 'Reboot Sent', `Restarting ${kiosk.serialNumber}...`)}>
                                                <Power className="w-4 h-4" /> Reboot Device
                                            </DropdownItem>
                                            <DropdownItem>View Logs</DropdownItem>
                                        </Dropdown>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="font-bold text-primary flex items-center gap-2">
                                            <Cpu className="w-4 h-4 text-muted" />
                                            {kiosk.serialNumber}
                                        </h3>
                                        <p className="text-xs text-muted ml-6">{kiosk.model}</p>
                                    </div>

                                    {hotel && (
                                        <Link href={`/hotels/${hotel.id}`} className="flex items-center gap-2 text-xs text-secondary-text surface-glass-soft p-2 rounded-lg glass-hover transition-all duration-fast mb-4">
                                            <Building2 className="w-3 h-3" />
                                            {hotel.name}
                                        </Link>
                                    )}

                                    <div className="flex justify-between items-center pt-3 border-t border-glass text-xs">
                                        <span className={`flex items-center gap-1 font-medium ${urgency.class}`}>
                                            <Clock className="w-3 h-3" /> {kiosk.lastHeartbeat}
                                        </span>
                                        <span className="font-mono text-muted">v{kiosk.firmwareVersion}</span>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>

                    <PaginationFooter
                        currentPage={currentPage}
                        totalPages={totalPages}
                        rowsPerPage={rowsPerPage}
                        totalItems={filteredKiosks.length}
                        onPageChange={setCurrentPage}
                        onRowsPerPageChange={setRowsPerPage}
                    />
                </>
            )}

            {/* TAB: FIRMWARE */}
            {activeTab === 'firmware' && (
                <FirmwareList />
            )}
        </div>
    );
}
