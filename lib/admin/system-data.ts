export interface SystemMetric {
    label: string;
    value: string;
    trend: string;
    status: 'healthy' | 'warning' | 'critical';
}

export interface FeatureFlag {
    id: string;
    name: string;
    key: string;
    description: string;
    status: 'active' | 'inactive' | 'beta';
    rolloutPercentage: number;
}

export const SYSTEM_METRICS: SystemMetric[] = [
    { label: 'API Latency', value: '45ms', trend: '-2ms vs last hour', status: 'healthy' },
    { label: 'Error Rate', value: '0.02%', trend: 'Stable', status: 'healthy' },
    { label: 'Database Load', value: '34%', trend: '+5% peak traffic', status: 'healthy' },
    { label: 'Active WebSockets', value: '1,240', trend: 'Live connections', status: 'healthy' },
];

export const FEATURE_FLAGS: FeatureFlag[] = [
    {
        id: 'flag-001',
        name: 'Voice AI Check-in',
        key: 'feat_voice_ai',
        description: 'Enable voice-based check-in flow using Whisper model.',
        status: 'beta',
        rolloutPercentage: 20,
    },
    {
        id: 'flag-002',
        name: 'Dark Mode V2',
        key: 'feat_ui_dark_v2',
        description: 'New high-contrast dark theme for accessibility.',
        status: 'active',
        rolloutPercentage: 100,
    },
    {
        id: 'flag-003',
        name: 'Predictive Maintenance',
        key: 'feat_ml_maintenance',
        description: 'ML model to predict printer paper jams.',
        status: 'inactive',
        rolloutPercentage: 0,
    }
];
