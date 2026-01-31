'use client';

/**
 * HotelKioskConfigManager Component
 * 
 * Main kiosk configuration management component.
 */

import { useState } from 'react';
import {
    Upload,
    Globe,
    Check,
    Lock,
    Info,
    Image as ImageIcon,
    X,
    Save,
    Eye,
    Sparkles,
} from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useHotelKioskConfig } from './useHotelKioskConfig';
import { useToast } from '@/components/shared/ui/Toast';
import { ConfirmModal } from '@/components/shared/ui/ConfirmModal';
import { PreviewModal } from './PreviewModal';
import { GlassCard } from '@/components/shared/ui/GlassCard';

export function HotelKioskConfigManager() {
    const { addToast } = useToast();
    const {
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
    } = useHotelKioskConfig();

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleLanguageToggle = (langId: string) => {
        const result = toggleLanguage(langId);
        if (!result.success && result.error) {
            addToast('warning', 'Language Limit', result.error);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const success = await handleLogoUpload(file);
            if (success) {
                addToast('success', 'Logo Uploaded', 'Preview updated. Save to apply changes.');
            }
        }
    };

    const confirmSave = async () => {
        const success = await saveConfig();
        if (success) {
            addToast('success', 'Settings Saved', 'Kiosk configuration has been updated.');
        }
        setShowSaveModal(false);
    };

    if (isLoading) {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    return (
        <HotelLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kiosk Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Customize the appearance and language options
                    </p>
                </div>
                <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:shadow-lg"
                >
                    <Eye className="w-4 h-4" />
                    Preview Kiosk
                </button>
            </div>

            <div className="space-y-6">
                {/* Logo Upload */}
                <GlassCard padding="lg">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                            <ImageIcon className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Hotel Logo</h2>
                            <p className="text-sm text-muted">
                                Displayed on the kiosk welcome screen
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Preview */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full sm:w-40 h-40 rounded-2xl bg-slate-800/50 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden group"
                        >
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-500 transition-colors mb-2" />
                                    <span className="text-sm text-slate-500 group-hover:text-slate-300 text-center px-2">
                                        Click to upload
                                    </span>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Upload Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Logo
                                </button>
                                {logoPreview && (
                                    <button
                                        onClick={removelogo}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1 text-xs text-muted">
                                <p>• Recommended: 400×400 pixels</p>
                                <p>• Max file size: 2MB</p>
                                <p>• Formats: PNG, JPG, SVG</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Welcome Message */}
                <GlassCard padding="lg">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Welcome Message</h2>
                            <p className="text-sm text-muted">
                                Greeting shown when guests approach the kiosk
                            </p>
                        </div>
                    </div>

                    <textarea
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-600 rounded-xl text-sm bg-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                        placeholder="Enter your welcome message..."
                    />
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted">
                            This message will be displayed and spoken by the voice assistant.
                        </p>
                        <span className="text-xs text-slate-500">{welcomeMessage.length}/200</span>
                    </div>
                </GlassCard>

                {/* Languages */}
                <GlassCard padding="lg">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-500/10 rounded-xl">
                                <Globe className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-primary">Languages</h2>
                                <p className="text-sm text-muted">
                                    Select up to {maxLanguages} languages ({enabledLanguages.length}/{maxLanguages} selected)
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 capitalize">
                            {plan} Plan
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {availableLanguages.map((lang) => {
                            const isEnabled = enabledLanguages.includes(lang.id);
                            const isDisabled = !isEnabled && enabledLanguages.length >= maxLanguages;

                            return (
                                <button
                                    key={lang.id}
                                    onClick={() => handleLanguageToggle(lang.id)}
                                    disabled={isDisabled}
                                    className={`
                                        relative p-4 rounded-xl border-2 transition-all text-left group
                                        ${isEnabled
                                            ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                                            : isDisabled
                                                ? 'border-slate-700 bg-slate-800/30 opacity-50 cursor-not-allowed'
                                                : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-700/30'
                                        }
                                    `}
                                >
                                    {isEnabled && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    {isDisabled && (
                                        <div className="absolute top-2 right-2">
                                            <Lock className="w-4 h-4 text-slate-500" />
                                        </div>
                                    )}
                                    <div className="text-sm font-semibold text-white mb-0.5">
                                        {lang.name}
                                    </div>
                                    <div className="text-xs text-muted">
                                        {lang.native}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {plan !== 'enterprise' && (
                        <div className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <p className="text-sm text-amber-500 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Upgrade to Enterprise plan to unlock all 8 languages.
                            </p>
                        </div>
                    )}
                </GlassCard>

                {/* Save Button */}
                <GlassCard padding="lg" variant="soft" className="flex items-center justify-between">
                    <p className="text-sm text-muted">
                        {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700/50 rounded-xl transition-colors"
                        >
                            Preview
                        </button>
                        <button
                            onClick={() => setShowSaveModal(true)}
                            disabled={!hasChanges || isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                </GlassCard>
            </div>

            {/* Save Confirmation */}
            <ConfirmModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={confirmSave}
                title="Save Kiosk Settings"
                message="These changes will be applied to all kiosks immediately. Guests will see the updated settings on their next check-in."
                confirmLabel="Save Changes"
                variant="default"
            />

            {/* Preview Modal */}
            <PreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                welcomeMessage={welcomeMessage}
                languages={enabledLanguages}
            />
        </HotelLayout>
    );
}
