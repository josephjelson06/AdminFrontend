'use client';

import { useState } from 'react';
import {
    DownloadCloud,
    Upload,
    MoreVertical,
    FileCode,
    Smartphone,
    XCircle
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';

// Mock Data for Firmware
const MOCK_FIRMWARE = [
    {
        id: 'fw-001',
        version: 'v3.0.1',
        name: 'KioskOS 3.0 (Performance)',
        description: 'Major performance update, reduced boot time by 40%.',
        model: 'Kiosk-V3-Pro',
        status: 'stable',
        installCount: 14,
        checksum: 'sha256:8f43...',
    },
    {
        id: 'fw-002',
        version: 'v2.5.0',
        name: 'Voice AI Beta',
        description: 'Introduces Hindi voice support for check-in.',
        model: 'Kiosk-V2-Voice',
        status: 'beta',
        installCount: 3,
        checksum: 'sha256:9a21...',
    }
];

export function FirmwareList() {
    const { addToast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const handlePushUpdate = (version: string) => {
        addToast('info', 'Update Queued', `Pushing ${version} to eligible devices...`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Firmware Repository</h2>
                    <p className="text-sm text-slate-500">Manage OTA updates and release channels</p>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Upload className="w-4 h-4" />
                    Upload Firmware
                </button>
            </div>

            <div className="grid gap-4">
                {MOCK_FIRMWARE.map((fw) => (
                    <GlassCard key={fw.id} className="p-0 group overflow-visible">
                        <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                <FileCode className="w-6 h-6 text-slate-500" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{fw.version}</h3>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${fw.status === 'stable' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {fw.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{fw.name}</p>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-slate-500 sm:border-l sm:border-slate-200 sm:pl-6">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5 font-medium text-slate-900 dark:text-white">
                                        <Smartphone className="w-4 h-4" /> {fw.model}
                                    </div>
                                    <span className="text-xs">Target Model</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5 font-medium text-slate-900 dark:text-white">
                                        <DownloadCloud className="w-4 h-4" /> {fw.installCount}
                                    </div>
                                    <span className="text-xs">Active Installs</span>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <Dropdown
                                    trigger={
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                            <MoreVertical className="w-5 h-5 text-slate-400" />
                                        </button>
                                    }
                                    align="right"
                                >
                                    <DropdownItem onClick={() => handlePushUpdate(fw.version)}>
                                        <DownloadCloud className="w-4 h-4" /> Push to Fleet
                                    </DropdownItem>
                                    <DropdownItem className="text-rose-600">
                                        <XCircle className="w-4 h-4" /> Deprecate
                                    </DropdownItem>
                                </Dropdown>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
