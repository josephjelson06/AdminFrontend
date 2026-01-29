'use client';

/**
 * useHotelKioskConfig Hook
 * 
 * Manages kiosk configuration state and operations.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    hotelKioskConfigService,
    type KioskConfig,
} from '@/lib/services/hotelKioskConfigService';
import type { Language } from '@/lib/hotel/hotel-data';

export interface UseHotelKioskConfigReturn {
    // Data
    welcomeMessage: string;
    setWelcomeMessage: (msg: string) => void;
    enabledLanguages: string[];
    availableLanguages: Language[];
    maxLanguages: number;
    plan: string;
    logoPreview: string | null;

    // Actions
    toggleLanguage: (langId: string) => { success: boolean; error?: string };
    handleLogoUpload: (file: File) => Promise<boolean>;
    removelogo: () => void;
    saveConfig: () => Promise<boolean>;

    // State
    hasChanges: boolean;
    isLoading: boolean;
    isSaving: boolean;

    // Refs
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function useHotelKioskConfig(): UseHotelKioskConfigReturn {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [welcomeMessage, setWelcomeMessageState] = useState('');
    const [enabledLanguages, setEnabledLanguages] = useState<string[]>([]);
    const [maxLanguages, setMaxLanguages] = useState(4);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const availableLanguages = hotelKioskConfigService.getAvailableLanguages();
    const plan = hotelKioskConfigService.getHotelPlan();

    useEffect(() => {
        const fetchConfig = async () => {
            setIsLoading(true);
            try {
                const config = await hotelKioskConfigService.getConfig();
                setWelcomeMessageState(config.welcomeMessage);
                setEnabledLanguages(config.enabledLanguages);
                setMaxLanguages(config.maxLanguages);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const setWelcomeMessage = useCallback((msg: string) => {
        setWelcomeMessageState(msg);
        setHasChanges(true);
    }, []);

    const toggleLanguage = useCallback((langId: string): { success: boolean; error?: string } => {
        if (enabledLanguages.includes(langId)) {
            setEnabledLanguages(prev => prev.filter(l => l !== langId));
            setHasChanges(true);
            return { success: true };
        } else {
            if (enabledLanguages.length < maxLanguages) {
                setEnabledLanguages(prev => [...prev, langId]);
                setHasChanges(true);
                return { success: true };
            } else {
                return {
                    success: false,
                    error: `Your ${plan} plan allows up to ${maxLanguages} languages. Upgrade to add more.`,
                };
            }
        }
    }, [enabledLanguages, maxLanguages, plan]);

    const handleLogoUpload = useCallback(async (file: File): Promise<boolean> => {
        const result = await hotelKioskConfigService.uploadLogo(file);
        if (result.success && result.data) {
            setLogoPreview(result.data);
            setHasChanges(true);
            return true;
        }
        return false;
    }, []);

    const removelogo = useCallback(() => {
        setLogoPreview(null);
        setHasChanges(true);
    }, []);

    const saveConfig = useCallback(async (): Promise<boolean> => {
        setIsSaving(true);
        try {
            const result = await hotelKioskConfigService.saveConfig({
                welcomeMessage,
                enabledLanguages,
                logo: logoPreview || undefined,
            });
            if (result.success) {
                setHasChanges(false);
            }
            return result.success;
        } finally {
            setIsSaving(false);
        }
    }, [welcomeMessage, enabledLanguages, logoPreview]);

    return {
        welcomeMessage,
        setWelcomeMessage,
        enabledLanguages,
        availableLanguages,
        maxLanguages,
        plan,
        logoPreview,
        toggleLanguage,
        handleLogoUpload,
        removelogo,
        saveConfig,
        hasChanges,
        isLoading,
        isSaving,
        fileInputRef,
    };
}
