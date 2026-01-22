'use client';

import { useState, useRef } from 'react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import {
    Monitor,
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
import {
    MOCK_KIOSK_CONFIG,
    AVAILABLE_LANGUAGES,
    MOCK_HOTEL_PROFILE,
} from '@/lib/hotel/hotel-data';
import { useToast } from '@/components/shared/ui/Toast';
import { ConfirmModal } from '@/components/shared/ui/ConfirmModal';

// Preview Modal for Kiosk Display
function PreviewModal({
    isOpen,
    onClose,
    welcomeMessage,
    languages,
}: {
    isOpen: boolean;
    onClose: () => void;
    welcomeMessage: string;
    languages: string[];
}) {
    if (!isOpen) return null;

    const enabledLangs = AVAILABLE_LANGUAGES.filter(l => languages.includes(l.id));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-300">
                {/* Kiosk Frame */}
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-3 shadow-2xl">
                    {/* Screen */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl overflow-hidden aspect-[3/4]">
                        {/* Header */}
                        <div className="p-6 text-center">
                            <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                <Monitor className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">{MOCK_HOTEL_PROFILE.name}</h2>
                            <p className="text-white/80 text-sm leading-relaxed">
                                {welcomeMessage}
                            </p>
                        </div>

                        {/* Language Selection */}
                        <div className="px-6 pb-6">
                            <p className="text-white/60 text-xs text-center mb-3 uppercase tracking-wide">Select Language</p>
                            <div className="grid grid-cols-2 gap-2">
                                {enabledLangs.map((lang) => (
                                    <button
                                        key={lang.id}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 text-center transition-colors"
                                    >
                                        <p className="text-white font-medium">{lang.name}</p>
                                        <p className="text-white/70 text-sm">{lang.native}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-6 pb-8">
                            <button className="w-full bg-white text-indigo-600 font-semibold py-4 rounded-xl shadow-lg">
                                Start Check-in
                            </button>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
            </div>
        </div>
    );
}

export default function KioskConfigPage() {
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [welcomeMessage, setWelcomeMessage] = useState(MOCK_KIOSK_CONFIG.welcomeMessage);
    const [enabledLanguages, setEnabledLanguages] = useState<string[]>(MOCK_KIOSK_CONFIG.enabledLanguages);
    const [hasChanges, setHasChanges] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const maxLanguages = MOCK_KIOSK_CONFIG.maxLanguages;
    const plan = MOCK_HOTEL_PROFILE.plan;

    const handleLanguageToggle = (langId: string) => {
        if (enabledLanguages.includes(langId)) {
            setEnabledLanguages(prev => prev.filter(l => l !== langId));
        } else {
            if (enabledLanguages.length < maxLanguages) {
                setEnabledLanguages(prev => [...prev, langId]);
            } else {
                addToast('warning', 'Language Limit', `Your ${plan} plan allows up to ${maxLanguages} languages. Upgrade to add more.`);
                return;
            }
        }
        setHasChanges(true);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoPreview(event.target?.result as string);
                setHasChanges(true);
                addToast('success', 'Logo Uploaded', 'Preview updated. Save to apply changes.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setShowSaveModal(true);
    };

    const confirmSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        addToast('success', 'Settings Saved', 'Kiosk configuration has been updated.');
        setHasChanges(false);
        setShowSaveModal(false);
    };

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
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                            <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hotel Logo</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Displayed on the kiosk welcome screen
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Preview */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full sm:w-40 h-40 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-500 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors overflow-hidden"
                        >
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-400 dark:text-slate-500 text-center px-2">
                                        Click to upload
                                    </span>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />

                        {/* Upload Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Logo
                                </button>
                                {logoPreview && (
                                    <button
                                        onClick={() => { setLogoPreview(null); setHasChanges(true); }}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                                <p>• Recommended: 400×400 pixels</p>
                                <p>• Max file size: 2MB</p>
                                <p>• Formats: PNG, JPG, SVG</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Welcome Message</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Greeting shown when guests approach the kiosk
                            </p>
                        </div>
                    </div>

                    <textarea
                        value={welcomeMessage}
                        onChange={(e) => { setWelcomeMessage(e.target.value); setHasChanges(true); }}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow"
                        placeholder="Enter your welcome message..."
                    />
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            This message will be displayed and spoken by the voice assistant.
                        </p>
                        <span className="text-xs text-slate-400">{welcomeMessage.length}/200</span>
                    </div>
                </div>

                {/* Languages */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Languages</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Select up to {maxLanguages} languages ({enabledLanguages.length}/{maxLanguages} selected)
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 capitalize">
                            {plan} Plan
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {AVAILABLE_LANGUAGES.map((lang) => {
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
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg shadow-indigo-100 dark:shadow-none'
                                            : isDisabled
                                                ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
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
                                            <Lock className="w-4 h-4 text-slate-400" />
                                        </div>
                                    )}
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">
                                        {lang.name}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        {lang.native}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {plan !== 'enterprise' && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Upgrade to Enterprise plan to unlock all 8 languages.
                            </p>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                            Preview
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
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
                </div>
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



