export interface HotelUser {
    id: number;
    email: string;
    full_name: string;
    role: string;
    role_id?: number;
    is_active: boolean;
    hotel_id?: number;
    created_at?: string;
    last_login?: string;
}

export interface HotelRole {
    id: number;
    name: string;
    description?: string;
    permissions?: Record<string, any>;
}

export interface TeamFilters {
    search?: string;
    role?: string;
    status?: string;
}
