'use client';

/**
 * RoomFilters Component
 * 
 * Floor and status filter controls using the toolbar system.
 */

import { Filter } from 'lucide-react';
import { FLOOR_FILTERS, STATUS_FILTERS } from '@/lib/services/hotelRoomService';
import {
    BaseToolbar,
    ToolbarFilterZone,
    ToolbarSelect,
    ToolbarTabs,
} from '@/components/hotel/shared';

interface RoomFiltersProps {
    floorFilter: string;
    onFloorChange: (floor: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
}

export function RoomFilters({ floorFilter, onFloorChange, statusFilter, onStatusChange }: RoomFiltersProps) {
    // Convert floor filters to select options
    const floorOptions = FLOOR_FILTERS.map(f => ({
        value: f.id,
        label: f.label,
    }));

    // Convert status filters to tab options
    const statusOptions = STATUS_FILTERS.map(f => ({
        id: f.id,
        label: f.label,
        color: f.color,
    }));

    return (
        <BaseToolbar density="comfortable">
            <ToolbarFilterZone>
                <ToolbarSelect
                    options={floorOptions}
                    value={floorFilter}
                    onChange={onFloorChange}
                    icon={Filter}
                />
                <ToolbarTabs
                    options={statusOptions}
                    value={statusFilter}
                    onChange={onStatusChange}
                />
            </ToolbarFilterZone>
        </BaseToolbar>
    );
}
