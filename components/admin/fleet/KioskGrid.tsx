'use client';

/**
 * KioskGrid Component
 * 
 * Main component for displaying the kiosk fleet grid.
 */

import { useState } from 'react';
import { LayoutGrid, FileCode } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useKiosks } from './useKiosks';
import { KioskFiltersBar } from './KioskFilters';
import { KioskCard } from './KioskCard';
import { FirmwareList } from '@/components/admin/fleet/FirmwareList';
import { useToast } from '@/components/shared/ui/Toast';
import { kioskService } from '@/lib/services/kioskService';
import { MOCK_HOTELS } from '@/lib/admin/mock-data';
import type { Kiosk } from '@/types/schema';

interface KioskGridProps {
    pageSize?: number;
}

export function KioskGrid({ pageSize = 9 }: KioskGridProps) {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'devices' | 'firmware'>('devices');

    const {
        kiosks,
        isLoading,
        error,
        stats,
        models,
        page,
        totalPages,
        totalItems,
        pageSize: currentPageSize,
        setPage,
        setPageSize,
        filters,
        setFilter,
        clearFilters,
        refresh,
    } = useKiosks({ initialPageSize: pageSize });

    const hasActiveFilters = Boolean(filters.search || filters.status || filters.model);

    // Get hotel names for cards
    const getHotelName = (hotelId: string | null) => {
        if (!hotelId) return undefined;
        const hotel = MOCK_HOTELS.find(h => h.id === hotelId);
        return hotel?.name;
    };

    // Reboot handler
    const handleReboot = async (kiosk: Kiosk) => {
        const result = await kioskService.reboot(kiosk.id);
        if (result.success) {
            addToast('success', 'Reboot Sent', `Restarting ${kiosk.serialNumber}...`);
        } else {
            addToast('error', 'Error', result.error || 'Failed to reboot');
        }
    };

    return (
        <div className="space-y-6">
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
                    <Card padding="none">
                        <KioskFiltersBar
                            filters={filters}
                            onFilterChange={setFilter}
                            onClearFilters={clearFilters}
                            hasActiveFilters={hasActiveFilters}
                            stats={stats}
                            models={models}
                        />
                    </Card>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kiosks.map((kiosk) => (
                                <KioskCard
                                    key={kiosk.id}
                                    kiosk={kiosk}
                                    hotelName={getHotelName(kiosk.assignedHotelId)}
                                    onReboot={handleReboot}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <PaginationBar
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={currentPageSize}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        pageSizeOptions={[6, 9, 12, 15]}
                    />
                </>
            )}

            {/* TAB: FIRMWARE */}
            {activeTab === 'firmware' && <FirmwareList />}

            {/* Error display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error.message}
                </div>
            )}
        </div>
    );
}
