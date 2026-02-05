'use client';

/**
 * useHotelSettings Hook
 * 
 * Manages hotel settings state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
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
                const response = await api.hotels.getMe();
                if (response.success && response.data) {
                    const hotel = response.data as any; // Cast generic API response to allow access to fields
                    // Map API response to HotelProfile
                    setProfile({
                        id: hotel.id.toString(),
                        name: hotel.name,
                        address: hotel.location, // Mapping location to address
                        city: hotel.city || '',
                        state: hotel.state || '',
                        pincode: '', // Not in API response derived from Hotel schema yet, defaulting
                        phone: '', // Not in API directly, maybe in manager details? Using placeholder
                        email: '', // Not in API directly
                        subscriptionPlan: hotel.subscription_plan as any || 'standard',
                        status: hotel.status as any || 'active',
                        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Mock expiry for now
                    });
                    setDaysUntilExpiry(30); // Mock
                }
            } catch (err) {
                console.error('Failed to fetch hotel settings', err);
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
            const updateData = {
                name: profile.name,
                location: profile.address,
                city: profile.city,
                state: profile.state,
                // Other fields like phone/email/pincode might need backend schema updates to be saved
                // For now sending what we have mapped
            };
            
            const result = await api.hotels.updateMe(updateData);
            if (result.success) {
                setHasChanges(false);
            }
            return result.success;
        } catch (err) {
            console.error('Failed to update hotel settings', err);
            return false;
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
