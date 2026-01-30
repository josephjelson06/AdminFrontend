'use client';

/**
 * FormatSelector Component
 * 
 * Export format selection with format-specific options.
 */

import { FileText, FileSpreadsheet, File } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';

export type ExportFormat = 'csv' | 'pdf' | 'xlsx';

interface FormatSelectorProps {
    value: ExportFormat;
    onChange: (format: ExportFormat) => void;
    availableFormats?: ExportFormat[];
}

const formats = [
    {
        id: 'csv' as ExportFormat,
        label: 'CSV',
        description: 'Comma-separated values for spreadsheets',
        icon: FileText,
    },
    {
        id: 'pdf' as ExportFormat,
        label: 'PDF',
        description: 'Formatted document for printing',
        icon: File,
    },
    {
        id: 'xlsx' as ExportFormat,
        label: 'Excel',
        description: 'Microsoft Excel workbook',
        icon: FileSpreadsheet,
    },
];

export function FormatSelector({
    value,
    onChange,
    availableFormats = ['csv', 'pdf', 'xlsx'],
}: FormatSelectorProps) {
    const filteredFormats = formats.filter((f) => availableFormats.includes(f.id));

    return (
        <GlassCard>
            <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-success" />
                    <h3 className="text-base font-semibold text-primary">Export Format</h3>
                </div>

                <div className="space-y-3">
                    {filteredFormats.map((format) => {
                        const Icon = format.icon;
                        const isSelected = value === format.id;

                        return (
                            <button
                                key={format.id}
                                onClick={() => onChange(format.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${isSelected
                                        ? 'bg-success/10 border-2 border-success/30'
                                        : 'surface-glass-soft border-2 border-transparent hover:border-glass'
                                    }`}
                            >
                                <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-success/20' : 'surface-glass-strong'}`}>
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-success' : 'text-muted'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold ${isSelected ? 'text-success' : 'text-primary'}`}>
                                        {format.label}
                                    </p>
                                    <p className="text-xs text-muted truncate">
                                        {format.description}
                                    </p>
                                </div>
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </GlassCard>
    );
}
