'use client';

import { Monitor, X } from 'lucide-react';
import { AVAILABLE_LANGUAGES, MOCK_HOTEL_PROFILE } from '@/lib/hotel/hotel-data';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    welcomeMessage: string;
    languages: string[];
}

export function PreviewModal({ isOpen, onClose, welcomeMessage, languages }: PreviewModalProps) {
    if (!isOpen) return null;

    const enabledLangs = AVAILABLE_LANGUAGES.filter(l => languages.includes(l.id));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />
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
                            <h2 className="text-xl font-bold text-white mb-2">
                                {MOCK_HOTEL_PROFILE.name}
                            </h2>
                            <p className="text-white/80 text-sm leading-relaxed">
                                {welcomeMessage}
                            </p>
                        </div>

                        {/* Language Selection */}
                        <div className="px-6 pb-6">
                            <p className="text-white/60 text-xs text-center mb-3 uppercase tracking-wide">
                                Select Language
                            </p>
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
                    aria-label="Close preview"
                >
                    <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
            </div>
        </div>
    );
}
