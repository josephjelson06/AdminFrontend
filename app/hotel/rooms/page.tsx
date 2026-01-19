'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/layout/HotelLayout';
import {
    Filter,
    RefreshCw,
    X,
    Check,
    Sparkles,
    User,
    Clock,
    BedDouble,
} from 'lucide-react';
import {
    MOCK_ROOMS,
    Room,
    RoomStatus,
    getRoomStatusColor,
    getRoomStatusLabel,
} from '@/lib/hotel-data';
import { useToast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

// Filter options
const FLOOR_FILTERS = [
    { id: 'all', label: 'All Floors' },
    { id: '1', label: 'Floor 1' },
    { id: '2', label: 'Floor 2' },
    { id: '3', label: 'Floor 3' },
];

const STATUS_FILTERS = [
    { id: 'all', label: 'All', color: 'bg-slate-500' },
    { id: 'ready', label: 'Ready', color: 'bg-emerald-500' },
    { id: 'cleaning', label: 'Cleaning', color: 'bg-amber-500' },
    { id: 'occupied', label: 'Occupied', color: 'bg-blue-500' },
    { id: 'dirty', label: 'Dirty', color: 'bg-rose-500' },
];

// Status cycle order for housekeeping
const STATUS_CYCLE: RoomStatus[] = ['dirty', 'cleaning', 'ready'];

// Room Card Component with enhanced animation
function RoomCard({
    room,
    onStatusChange,
    onViewDetails,
}: {
    room: Room;
    onStatusChange: (roomId: string, newStatus: RoomStatus) => void;
    onViewDetails: (room: Room) => void;
}) {
    const isClickable = room.status !== 'occupied';
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (!isClickable) {
            onViewDetails(room);
            return;
        }

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        const currentIndex = STATUS_CYCLE.indexOf(room.status);
        const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
        onStatusChange(room.id, STATUS_CYCLE[nextIndex]);
    };

    const statusStyles = {
        ready: {
            bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/50',
            border: 'border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600',
            badge: 'bg-emerald-500 text-white',
            icon: <Check className="w-4 h-4" />,
        },
        cleaning: {
            bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50',
            border: 'border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600',
            badge: 'bg-amber-500 text-white',
            icon: <Sparkles className="w-4 h-4" />,
        },
        occupied: {
            bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50',
            border: 'border-blue-300 dark:border-blue-700',
            badge: 'bg-blue-500 text-white',
            icon: <User className="w-4 h-4" />,
        },
        dirty: {
            bg: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-900/50',
            border: 'border-rose-300 dark:border-rose-700 hover:border-rose-400 dark:hover:border-rose-600',
            badge: 'bg-rose-500 text-white',
            icon: <BedDouble className="w-4 h-4" />,
        },
    };

    const style = statusStyles[room.status];

    return (
        <button
            onClick={handleClick}
            className={`
        relative p-4 rounded-2xl border-2 transition-all duration-200
        ${style.bg} ${style.border}
        ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95' : 'cursor-pointer'}
        ${isAnimating ? 'scale-95' : ''}
      `}
        >
            {/* Status Badge */}
            <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center ${style.badge} shadow-lg`}>
                {style.icon}
            </div>

            {/* Room Number */}
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {room.number}
            </div>

            {/* Room Type */}
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize font-medium mb-3">
                {room.type}
            </div>

            {/* Status Label */}
            <div className={`
        text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1
        ${style.badge}
      `}>
                {getRoomStatusLabel(room.status)}
            </div>

            {/* Updated Time */}
            <div className="mt-2 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {room.lastUpdated}
            </div>

            {/* Tap Hint */}
            {isClickable && (
                <div className="absolute bottom-2 right-2 text-xs text-slate-400 dark:text-slate-500">
                    tap
                </div>
            )}
        </button>
    );
}

// Room Detail Modal
function RoomDetailModal({
    room,
    onClose,
    onStatusChange,
}: {
    room: Room | null;
    onClose: () => void;
    onStatusChange: (status: RoomStatus) => void;
}) {
    if (!room) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
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
                            {(['dirty', 'cleaning', 'ready'] as RoomStatus[]).map((status) => (
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

export default function RoomsPage() {
    const { addToast } = useToast();
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [floorFilter, setFloorFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ room: Room; newStatus: RoomStatus } | null>(null);

    // Filter rooms
    const filteredRooms = rooms.filter((room) => {
        const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
        const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
        return matchesFloor && matchesStatus;
    });

    // Handle status change with confirmation for "ready"
    const handleStatusChange = (roomId: string, newStatus: RoomStatus) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        if (newStatus === 'ready') {
            setConfirmModal({ room, newStatus });
        } else {
            applyStatusChange(roomId, newStatus);
        }
    };

    const applyStatusChange = (roomId: string, newStatus: RoomStatus) => {
        setRooms(prev => prev.map(room =>
            room.id === roomId
                ? { ...room, status: newStatus, lastUpdated: 'Just now' }
                : room
        ));
        addToast('success', 'Room Updated', `Room marked as ${getRoomStatusLabel(newStatus)}`);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setRooms(MOCK_ROOMS);
        setIsRefreshing(false);
        addToast('success', 'Refreshed', 'Room statuses updated');
    };

    // Stats
    const stats = {
        ready: rooms.filter(r => r.status === 'ready').length,
        cleaning: rooms.filter(r => r.status === 'cleaning').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
        dirty: rooms.filter(r => r.status === 'dirty').length,
    };

    return (
        <HotelLayout>
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Room Status</h1>
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
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Ready', count: stats.ready, color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-600 dark:text-emerald-400' },
                        { label: 'Cleaning', count: stats.cleaning, color: 'from-amber-500 to-amber-600', textColor: 'text-amber-600 dark:text-amber-400' },
                        { label: 'Occupied', count: stats.occupied, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600 dark:text-blue-400' },
                        { label: 'Dirty', count: stats.dirty, color: 'from-rose-500 to-rose-600', textColor: 'text-rose-600 dark:text-rose-400' },
                    ].map((stat) => (
                        <button
                            key={stat.label}
                            onClick={() => setStatusFilter(statusFilter === stat.label.toLowerCase() ? 'all' : stat.label.toLowerCase())}
                            className={`relative overflow-hidden rounded-xl p-4 text-center transition-all hover:scale-105 ${statusFilter === stat.label.toLowerCase()
                                    ? `bg-gradient-to-br ${stat.color} text-white shadow-lg`
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            <div className={`text-2xl sm:text-3xl font-bold ${statusFilter === stat.label.toLowerCase() ? 'text-white' : stat.textColor}`}>
                                {stat.count}
                            </div>
                            <div className={`text-xs font-medium ${statusFilter === stat.label.toLowerCase() ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                {stat.label}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                value={floorFilter}
                                onChange={(e) => setFloorFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {FLOOR_FILTERS.map((filter) => (
                                    <option key={filter.id} value={filter.id}>{filter.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_FILTERS.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setStatusFilter(filter.id)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${statusFilter === filter.id
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${filter.color}`} />
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredRooms.map((room, index) => (
                        <div
                            key={room.id}
                            className="animate-in fade-in slide-in-from-bottom-2"
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            <RoomCard
                                room={room}
                                onStatusChange={handleStatusChange}
                                onViewDetails={setSelectedRoom}
                            />
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredRooms.length === 0 && (
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
            </div>

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
                onConfirm={() => {
                    if (confirmModal) {
                        applyStatusChange(confirmModal.room.id, 'ready');
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
