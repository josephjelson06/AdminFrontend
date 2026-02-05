'use client';

/**
 * useHotelProfile Hook
 * 
 * Manages hotel user profile state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface UserProfile {
    id: number;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    hotelId?: number;
}

export function useHotelProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                // Get token from storage
                const token = typeof window !== 'undefined' ? localStorage.getItem('atc_token') : null;
                if (!token) return;

                const data = await api.auth.me(token);
                setProfile({
                    id: data.id,
                    email: data.email,
                    fullName: data.full_name || '',
                    role: data.role,
                    isActive: data.is_active,
                    hotelId: data.hotel_id,
                });
            } catch (err) {
                console.error('Failed to fetch user profile', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const updateField = useCallback((field: keyof UserProfile, value: any) => {
        setProfile(prev => prev ? { ...prev, [field]: value } : null);
        setHasChanges(true);
    }, []);

    const saveProfile = useCallback(async (): Promise<boolean> => {
        if (!profile) return false;

        setIsSaving(true);
        try {
            const updateData = {
                full_name: profile.fullName,
                email: profile.email,
                // Add password update logic if UI supports it
            };

            const result = await api.users.update(profile.id, updateData);
            if (result.success) {
                setHasChanges(false);
            }
            return result.success;
        } catch (err) {
            console.error('Failed to update user profile', err);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [profile]);

    return {
        profile,
        isLoading,
        isSaving,
        hasChanges,
        updateField,
        saveProfile,
    };
}
