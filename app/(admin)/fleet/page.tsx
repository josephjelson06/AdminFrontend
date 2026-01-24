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
    MoreVertical,
    Plus,
    LayoutGrid,
    FileCode,
    Building2,
    Power
} from 'lucide-react';
import { MOCK_KIOSKS, MOCK_HOTELS } from '@/lib/admin/mock-data';
import type { KioskStatus } from '@/types/schema';
import { FilterChips, SearchFilter } from '@/components/shared/ui/Filters';
import { Pagination } from '@/components/shared/ui/Pagination';
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

    if (minutes > 60) return { class: 'text-rose-600 dark:text-rose-400', urgent: true };
    if (minutes > 30) return { class: 'text-amber-600 dark:text-amber-400', urgent: true };
    return { class: 'text-slate-500 dark:text-slate-400', urgent: false };
}

const ITEMS_PER_PAGE = 6;

export default function FleetPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'devices' | 'firmware'>('devices');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [modelFilter, setModelFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

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

    const paginatedKiosks = filteredKiosks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const onlineCount = MOCK_KIOSKS.filter((k) => k.status === 'online').length;
    const offlineCount = MOCK_KIOSKS.filter((k) => k.status === 'offline').length;

    return (
        <div className="p-6 space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kiosk Fleet</h1>
                    <p className="text-sm text-slate-500">Manage devices, firmware, and remote commands</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('devices')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'devices'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4 inline-block mr-2" />
                        Devices
                    </button>
                    <button
                        onClick={() => setActiveTab('firmware')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'firmware'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
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
                            <span className="text-emerald-600 flex items-center gap-1">
                                <Wifi className="w-4 h-4" /> {onlineCount} Online
                            </span>
                            <span className="text-rose-600 flex items-center gap-1">
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
                                <GlassCard key={kiosk.id} className="p-5 hover:border-emerald-500/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${kiosk.status === 'online' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {kiosk.status === 'online' ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                                        </div>
                                        <Dropdown
                                            trigger={
                                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                                    <MoreVertical className="w-4 h-4 text-slate-400" />
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
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Cpu className="w-4 h-4 text-slate-400" />
                                            {kiosk.serialNumber}
                                        </h3>
                                        <p className="text-xs text-slate-500 ml-6">{kiosk.model}</p>
                                    </div>

                                    {hotel && (
                                        <Link href={`/hotels/${hotel.id}`} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg hover:bg-slate-100 transition-colors mb-4">
                                            <Building2 className="w-3 h-3" />
                                            {hotel.name}
                                        </Link>
                                    )}

                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                                        <span className={`flex items-center gap-1 font-medium ${urgency.class}`}>
                                            <Clock className="w-3 h-3" /> {kiosk.lastHeartbeat}
                                        </span>
                                        <span className="font-mono text-slate-400">v{kiosk.firmwareVersion}</span>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredKiosks.length / ITEMS_PER_PAGE)}
                        totalItems={filteredKiosks.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
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
