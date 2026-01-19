'use client';

import { useState } from 'react';

interface StateData {
    id: string;
    name: string;
    kiosks: number;
    checkins: number;
}

interface IndiaHeatmapProps {
    data: StateData[];
}

// Simplified India map paths for major states
const STATE_PATHS: Record<string, { d: string; cx: number; cy: number }> = {
    'KA': { d: 'M145,280 L165,260 L185,270 L195,290 L180,320 L155,330 L135,310 L145,280', cx: 165, cy: 295 },
    'MH': { d: 'M120,220 L175,210 L195,230 L195,270 L165,260 L145,280 L120,270 L110,240 L120,220', cx: 155, cy: 245 },
    'GJ': { d: 'M80,200 L120,190 L130,210 L120,240 L90,250 L60,230 L80,200', cx: 100, cy: 220 },
    'RJ': { d: 'M90,140 L140,130 L165,150 L160,190 L120,190 L80,200 L70,170 L90,140', cx: 120, cy: 165 },
    'UP': { d: 'M165,150 L220,145 L250,165 L235,200 L190,200 L160,190 L165,150', cx: 205, cy: 175 },
    'MP': { d: 'M130,210 L190,200 L235,200 L230,240 L195,250 L175,230 L130,235 L130,210', cx: 180, cy: 225 },
    'TN': { d: 'M180,320 L210,310 L230,330 L215,370 L185,375 L170,350 L180,320', cx: 198, cy: 345 },
    'KL': { d: 'M165,345 L180,330 L185,375 L165,395 L155,370 L165,345', cx: 170, cy: 365 },
    'AP': { d: 'M195,270 L230,260 L250,285 L235,320 L210,310 L180,320 L195,290 L195,270', cx: 218, cy: 293 },
    'TS': { d: 'M195,250 L230,240 L250,255 L230,260 L195,270 L195,250', cx: 220, cy: 255 },
    'WB': { d: 'M270,200 L295,210 L290,260 L265,275 L250,250 L255,220 L270,200', cx: 272, cy: 240 },
    'OR': { d: 'M250,250 L290,260 L295,295 L270,305 L250,285 L250,250', cx: 272, cy: 278 },
    'BR': { d: 'M250,185 L285,180 L290,200 L270,200 L255,220 L235,210 L250,185', cx: 265, cy: 198 },
    'JH': { d: 'M255,220 L285,215 L290,240 L265,245 L250,250 L255,220', cx: 270, cy: 232 },
    'DL': { d: 'M160,150 L175,145 L180,160 L168,165 L160,150', cx: 168, cy: 155 },
    'GA': { d: 'M145,300 L160,295 L165,310 L155,320 L145,310 L145,300', cx: 155, cy: 308 },
    'PB': { d: 'M130,100 L155,95 L165,115 L150,130 L130,125 L130,100', cx: 148, cy: 113 },
    'HR': { d: 'M140,130 L165,120 L175,145 L160,150 L150,145 L140,130', cx: 158, cy: 138 },
};

export function IndiaHeatmap({ data }: IndiaHeatmapProps) {
    const [hoveredState, setHoveredState] = useState<StateData | null>(null);

    // Calculate max for color scaling
    const maxKiosks = Math.max(...data.map(d => d.kiosks), 1);

    // Get color intensity based on kiosk count
    const getColor = (kiosks: number) => {
        const intensity = kiosks / maxKiosks;
        if (intensity > 0.7) return 'fill-emerald-500';
        if (intensity > 0.4) return 'fill-emerald-400';
        if (intensity > 0.2) return 'fill-emerald-300';
        if (intensity > 0) return 'fill-emerald-200';
        return 'fill-slate-100';
    };

    // Create a map for quick lookup
    const dataMap = new Map(data.map(d => [d.id, d]));

    return (
        <div className="relative">
            <svg viewBox="40 80 280 340" className="w-full h-auto">
                {/* Background */}
                <rect x="40" y="80" width="280" height="340" fill="#f8fafc" rx="8" />

                {/* State paths */}
                {Object.entries(STATE_PATHS).map(([id, { d, cx, cy }]) => {
                    const stateData = dataMap.get(id);
                    const colorClass = stateData ? getColor(stateData.kiosks) : 'fill-slate-100';

                    return (
                        <g key={id}>
                            <path
                                d={d}
                                className={`${colorClass} stroke-slate-300 stroke-1 cursor-pointer transition-all hover:stroke-slate-500 hover:stroke-2`}
                                onMouseEnter={() => stateData && setHoveredState(stateData)}
                                onMouseLeave={() => setHoveredState(null)}
                            />
                            {/* Kiosk count label */}
                            {stateData && stateData.kiosks > 0 && (
                                <text
                                    x={cx}
                                    y={cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-[10px] font-bold fill-slate-700 pointer-events-none"
                                >
                                    {stateData.kiosks}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Map title */}
                <text x="180" y="100" textAnchor="middle" className="text-xs font-semibold fill-slate-600">
                    Kiosk Distribution
                </text>
            </svg>

            {/* Tooltip */}
            {hoveredState && (
                <div className="absolute top-4 right-4 bg-white border border-slate-200 rounded-lg shadow-lg p-3 min-w-[140px]">
                    <p className="text-sm font-semibold text-slate-900">{hoveredState.name}</p>
                    <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Kiosks</span>
                            <span className="font-medium text-emerald-600">{hoveredState.kiosks}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Check-ins</span>
                            <span className="font-medium text-slate-700">{hoveredState.checkins.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-200" />
                    <span className="text-xs text-slate-500">1-3</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-300" />
                    <span className="text-xs text-slate-500">4-6</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-400" />
                    <span className="text-xs text-slate-500">7-9</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-xs text-slate-500">10+</span>
                </div>
            </div>
        </div>
    );
}
