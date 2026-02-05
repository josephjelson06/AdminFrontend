'use client';

import { Edit, Trash2, Home, Layers } from 'lucide-react';
import type { Room } from './types';

interface RoomCardProps {
    room: Room;
    onEdit: (room: Room) => void;
    onDelete: (room: Room) => void;
}

const statusColors = {
    available: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    occupied: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    maintenance: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    cleaning: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
    return (
        <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
                        <Home className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-none mb-1">
                            {room.room_number}
                        </h3>
                        <p className="text-xs text-white/50 font-medium">
                            {room.room_type}
                        </p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[room.status as keyof typeof statusColors] || statusColors.available}`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </div>
            </div>

            <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                <Layers className="w-4 h-4" />
                <span>Floor {room.floor}</span>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                <button
                    onClick={() => onEdit(room)}
                    className="flex-1 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Edit className="w-3 h-3" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(room)}
                    className="h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors flex items-center justify-center"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
