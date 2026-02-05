'use client';

import { useState } from 'react';
import { Plus, Search, Home } from 'lucide-react';
import { useRooms } from './useRooms';
import { RoomCard } from './RoomCard';
import { RoomFilters } from './RoomFilters';
import { AddRoomModal } from './AddRoomModal';
import { EditRoomModal } from './EditRoomModal';
import type { Room } from './types';

export function RoomList() {
    const {
        rooms,
        isLoading,
        filters,
        setFilters,
        addRoom,
        updateRoom,
        deleteRoom,
    } = useRooms();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/50 text-sm">Loading rooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full md:w-auto">
                    <RoomFilters filters={filters} onChange={setFilters} />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary w-full md:w-auto justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add Room
                </button>
            </div>

            {/* Room Grid */}
            {rooms.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            onEdit={setEditingRoom}
                            onDelete={(r) => {
                                if (confirm(`Are you sure you want to delete Room ${r.room_number}?`)) {
                                    deleteRoom(r.id);
                                }
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-white/10 rounded-xl bg-white/5">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Home className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No rooms found</h3>
                    <p className="text-white/50 text-sm max-w-sm text-center">
                        {Object.keys(filters).length > 0
                            ? "Try adjusting your filters to see more results."
                            : "Get started by adding your first room to the hotel."}
                    </p>
                    {Object.keys(filters).length === 0 && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-6 btn-primary"
                        >
                            <Plus className="w-4 h-4" />
                            Add Room
                        </button>
                    )}
                </div>
            )}

            {/* Modals */}
            <AddRoomModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={addRoom}
            />

            <EditRoomModal
                isOpen={!!editingRoom}
                onClose={() => setEditingRoom(null)}
                room={editingRoom}
                onSave={updateRoom}
            />
        </div>
    );
}
