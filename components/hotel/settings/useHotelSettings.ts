'use client';

/**
 * useHotelSettings Hook
 * 
 * Manages hotel settings state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    hotelSettingsService,
    type HotelSettingsData,
} from '@/lib/services/hotelSettingsService';
import type { HotelProfile } from '@/lib/hotel/hotel-data';

export interface UseHotelSettingsReturn {
    // Data
    profile: HotelProfile | null;
    daysUntilExpiry: number;

    // Actions
    updateField: (field: string, value: string) => void;
    saveProfile: () => Promise<boolean>;

    // State
    hasChanges: boolean;
    isLoading: boolean;
    isSaving: boolean;
}

export function useHotelSettings(): UseHotelSettingsReturn {
    const [profile, setProfile] = useState<HotelProfile | null>(null);
    const [daysUntilExpiry, setDaysUntilExpiry] = useState(0);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await hotelSettingsService.getProfile();
                setProfile(data.profile);
                setDaysUntilExpiry(data.daysUntilExpiry);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const updateField = useCallback((field: string, value: string) => {
        setProfile(prev => prev ? { ...prev, [field]: value } : null);
        setHasChanges(true);
    }, []);

    const saveProfile = useCallback(async (): Promise<boolean> => {
        if (!profile) return false;

        setIsSaving(true);
        try {
            const result = await hotelSettingsService.updateProfile(profile);
            if (result.success) {
                setHasChanges(false);
            }
            return result.success;
        } finally {
            setIsSaving(false);
        }
    }, [profile]);

    return {
        profile,
        daysUntilExpiry,
        updateField,
        saveProfile,
        hasChanges,
        isLoading,
        isSaving,
    };
}
