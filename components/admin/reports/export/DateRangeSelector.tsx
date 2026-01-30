'use client';

/**
 * DateRangeSelector Component
 * 
 * Date range picker with quick presets for report exports.
 */

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear } from 'date-fns';
import { GlassCard } from '@/components/shared/ui/GlassCard';

export interface DateRange {
    from: Date;
    to: Date;
}

interface DateRangeSelectorProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}

const presets = [
    { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: 'Last 30 days', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: 'This month', getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
    { label: 'Last month', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
    { label: 'Last 3 months', getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
    { label: 'This year', getValue: () => ({ from: startOfYear(new Date()), to: new Date() }) },
];

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
    const [activePreset, setActivePreset] = useState<string | null>('Last 30 days');

    const handlePresetClick = (preset: typeof presets[0]) => {
        setActivePreset(preset.label);
        onChange(preset.getValue());
    };

    const handleDateChange = (field: 'from' | 'to', dateStr: string) => {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            setActivePreset(null);
            onChange({ ...value, [field]: date });
        }
    };

    return (
        <GlassCard>
            <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-info" />
                    <h3 className="text-base font-semibold text-primary">Date Range</h3>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                        <button
                            key={preset.label}
                            onClick={() => handlePresetClick(preset)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${activePreset === preset.label
                                    ? 'bg-info/20 text-info border border-info/30'
                                    : 'surface-glass-soft text-muted hover:text-primary'
                                }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                {/* Custom Date Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted uppercase tracking-wide">From</label>
                        <input
                            type="date"
                            value={format(value.from, 'yyyy-MM-dd')}
                            onChange={(e) => handleDateChange('from', e.target.value)}
                            className="input-glass w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted uppercase tracking-wide">To</label>
                        <input
                            type="date"
                            value={format(value.to, 'yyyy-MM-dd')}
                            onChange={(e) => handleDateChange('to', e.target.value)}
                            className="input-glass w-full"
                        />
                    </div>
                </div>

                {/* Selected Range Display */}
                <div className="p-3 rounded-xl surface-glass-soft text-center">
                    <p className="text-xs text-muted">Selected range</p>
                    <p className="text-sm font-medium text-primary">
                        {format(value.from, 'MMM d, yyyy')} – {format(value.to, 'MMM d, yyyy')}
                    </p>
                </div>
            </div>
        </GlassCard>
    );
}
