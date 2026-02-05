'use client';

import { useState, useEffect } from 'react';
import { X, Save, Layers, Home, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { Room } from './types';

interface EditRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
    onSave: (id: number, data: any) => Promise<boolean>;
}

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Ocean View', 'Family'];

export function EditRoomModal({ isOpen, onClose, room, onSave }: EditRoomModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        room_number: '',
        floor: '',
        room_type: 'Standard',
        status: 'available',
    });

    useEffect(() => {
        if (room) {
            setFormData({
                room_number: room.room_number,
                floor: room.floor.toString(),
                room_type: room.room_type,
                status: room.status,
            });
        }
    }, [room]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!room) return;

        setIsSaving(true);
        const success = await onSave(room.id, {
            ...formData,
            floor: parseInt(formData.floor) || 0,
        });
        setIsSaving(false);
        if (success) onClose();
    };

    if (!isOpen || !room) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h2 className="text-lg font-semibold text-white">Edit Room {room.room_number}</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Room Number</label>
                        <div className="relative">
                            <Home className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                required
                                value={formData.room_number}
                                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Floor</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.floor}
                                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Room Type</label>
                        <input
                            list="edit-room-types"
                            type="text"
                            required
                            value={formData.room_type}
                            onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                        <datalist id="edit-room-types">
                            {ROOM_TYPES.map((type) => (
                                <option key={type} value={type} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="cleaning">Cleaning</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
