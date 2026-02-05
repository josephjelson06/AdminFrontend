export interface HotelRole {
    id: number;
    name: string;
    description?: string;
    permissions?: Record<string, any>;
    is_system_role: boolean;
    user_count: number;
    hotel_id?: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface RoleFilters {
    search?: string;
}
