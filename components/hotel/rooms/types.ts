export interface Room {
    id: number;
    hotel_id: number;
    room_number: string;
    floor: number;
    room_type: string;
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
    created_at: string;
    updated_at: string;
}

export interface RoomFilters {
    floor?: number;
    room_type?: string;
    status?: string;
}
