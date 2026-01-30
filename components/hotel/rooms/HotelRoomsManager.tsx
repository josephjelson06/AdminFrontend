'use client';

/**
 * HotelRoomsManager Component
 * 
 * Main rooms management component.
 */

import { useState } from 'react';
import { RefreshCw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useHotelRooms } from './useHotelRooms';
import { RoomCard } from './RoomCard';
import { RoomDetailModal } from './RoomDetailModal';
import { RoomFilters } from './RoomFilters';
import { RoomStatusSummary } from './RoomStatusSummary';
import { ConfirmModal } from '@/components/shared/ui/ConfirmModal';
import { useToast } from '@/components/shared/ui/Toast';
import { STATUS_FILTERS } from '@/lib/services/hotelRoomService';
import type { Room, RoomStatus } from '@/lib/hotel/hotel-data';
import { getRoomStatusLabel } from '@/lib/hotel/hotel-data';

export function HotelRoomsManager() {
    const { addToast } = useToast();
    const {
        rooms,
        stats,
        floorFilter,
        setFloorFilter,
        statusFilter,
        setStatusFilter,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        paginatedRooms,
        updateRoomStatus,
        getNextStatus,
        refresh,
        isLoading,
        isRefreshing,
    } = useHotelRooms();

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ room: Room; newStatus: RoomStatus } | null>(null);

    const handleStatusChange = async (roomId: string, newStatus: RoomStatus) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        if (newStatus === 'ready') {
            setConfirmModal({ room, newStatus });
        } else {
            await applyStatusChange(roomId, newStatus);
        }
    };

    const applyStatusChange = async (roomId: string, newStatus: RoomStatus) => {
        const success = await updateRoomStatus(roomId, newStatus);
        if (success) {
            addToast('success', 'Room Updated', `Room marked as ${getRoomStatusLabel(newStatus)}`);
        } else {
            addToast('error', 'Update Failed', 'Could not update room status');
        }
    };

    const handleRefresh = async () => {
        await refresh();
        addToast('success', 'Refreshed', 'Room statuses updated');
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

    return (
        <HotelLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Room Status</h1>
                        {statusFilter !== 'all' && (
                            <span className="text-sm font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                Showing: {STATUS_FILTERS.find(f => f.id === statusFilter)?.label} Rooms
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Tap a room to update its status
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Status Summary */}
            <RoomStatusSummary stats={stats} activeFilter={statusFilter} onFilterChange={setStatusFilter} />

            {/* Filters */}
            <RoomFilters
                floorFilter={floorFilter}
                onFloorChange={setFloorFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {/* Room Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                {paginatedRooms.map((room, index) => (
                    <div
                        key={room.id}
                        className="animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <RoomCard
                            room={room}
                            onStatusChange={handleStatusChange}
                            onViewDetails={setSelectedRoom}
                            getNextStatus={getNextStatus}
                        />
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {rooms.length === 0 && (
                <div className="py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <Filter className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No rooms match filters
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Try adjusting your floor or status filters
                    </p>
                    <button
                        onClick={() => { setFloorFilter('all'); setStatusFilter('all'); }}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Pagination */}
            {rooms.length > 0 && (
                <div className="mt-6 py-3 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={18}>18</option>
                            <option value={24}>24</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {rooms.length > 0
                                ? `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, rooms.length)} of ${rooms.length}`
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
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Room Detail Modal */}
            <RoomDetailModal
                room={selectedRoom}
                onClose={() => setSelectedRoom(null)}
                onStatusChange={(status) => {
                    if (selectedRoom) {
                        applyStatusChange(selectedRoom.id, status);
                    }
                }}
            />

            {/* Confirm Ready Modal */}
            <ConfirmModal
                isOpen={!!confirmModal}
                onClose={() => setConfirmModal(null)}
                onConfirm={async () => {
                    if (confirmModal) {
                        await applyStatusChange(confirmModal.room.id, 'ready');
                        setConfirmModal(null);
                    }
                }}
                title="Mark Room as Ready?"
                message={`Room ${confirmModal?.room.number} will be marked as ready for the next guest. Please confirm the room has been fully cleaned and inspected.`}
                confirmLabel="Yes, Room is Ready"
                variant="default"
            />
        </HotelLayout>
    );
}
