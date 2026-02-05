'use client';

import { RoomList } from '@/components/hotel/rooms/RoomList';

export default function RoomsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Room Management</h1>
                    <p className="text-white/60 mt-1">
                        Manage your hotel rooms, floors, and statuses.
                    </p>
                </div>
            </div>

            <RoomList />
        </div>
    );
}
