'use client';

/**
 * RoomDetailModal Component
 * 
 * Modal for viewing and changing room status.
 */

import { X } from 'lucide-react';
import type { Room, RoomStatus } from '@/lib/hotel/hotel-data';
import { getRoomStatusColor, getRoomStatusLabel } from '@/lib/hotel/hotel-data';

interface RoomDetailModalProps {
    room: Room | null;
    onClose: () => void;
    onStatusChange: (status: RoomStatus) => void;
}

const statusChangeOptions: RoomStatus[] = ['dirty', 'cleaning', 'ready'];

export function RoomDetailModal({ room, onClose, onStatusChange }: RoomDetailModalProps) {
    if (!room) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Room {room.number}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{room.type} • Floor {room.floor}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Current Status */}
                <div className="p-5">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Current Status</p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${room.status === 'ready' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        room.status === 'cleaning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                            room.status === 'occupied' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                        }`}>
                        <div className={`w-3 h-3 rounded-full ${getRoomStatusColor(room.status)}`} />
                        <span className="font-semibold">{getRoomStatusLabel(room.status)}</span>
                    </div>
                </div>

                {/* Change Status */}
                {room.status !== 'occupied' && (
                    <div className="px-5 pb-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Change Status</p>
                        <div className="grid grid-cols-3 gap-2">
                            {statusChangeOptions.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        onStatusChange(status);
                                        onClose();
                                    }}
                                    disabled={room.status === status}
                                    className={`py-2.5 px-3 text-sm font-medium rounded-xl transition-all ${room.status === status
                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : status === 'ready'
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                            : status === 'cleaning'
                                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                                : 'bg-rose-500 text-white hover:bg-rose-600'
                                        }`}
                                >
                                    {getRoomStatusLabel(status)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Occupied Message */}
                {room.status === 'occupied' && (
                    <div className="px-5 pb-5">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                This room is currently occupied. Status will change automatically on checkout.
                            </p>
                        </div>
                    </div>
                )}

                {/* Close Button */}
                <div className="p-5 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
