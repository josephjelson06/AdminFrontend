export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLog {
    id: string;
    actor: {
        name: string;
        email: string;
        role: string;
    };
    action: string;
    target: string; // The entity being affected (e.g., "Grand Hyatt", "Kiosk-99")
    module: 'auth' | 'hotels' | 'fleet' | 'finance' | 'system';
    severity: AuditSeverity;
    timestamp: string;
    ipAddress: string;
    details?: string;
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
        id: 'log-001',
        actor: { name: 'Admin User', email: 'admin@atc.in', role: 'Super Admin' },
        action: 'Impersonated Hotel Admin',
        target: 'Grand Hyatt Mumbai',
        module: 'auth',
        severity: 'critical',
        timestamp: 'Just now',
        ipAddress: '192.168.1.45',
        details: 'Session started via Admin Console',
    },
    {
        id: 'log-002',
        actor: { name: 'Priya Menon', email: 'ops@atc.in', role: 'Operations' },
        action: 'Reboot Command Sent',
        target: 'ATC-SN-7766',
        module: 'fleet',
        severity: 'warning',
        timestamp: '2 hours ago',
        ipAddress: '10.0.0.12',
    },
    {
        id: 'log-003',
        actor: { name: 'Amit Patel', email: 'finance@atc.in', role: 'Finance' },
        action: 'Invoice Generated',
        target: 'INV-2024-001',
        module: 'finance',
        severity: 'info',
        timestamp: '5 hours ago',
        ipAddress: '10.0.0.8',
    },
    {
        id: 'log-004',
        actor: { name: 'Admin User', email: 'admin@atc.in', role: 'Super Admin' },
        action: 'Role Permission Updated',
        target: 'Hotel Manager Role',
        module: 'system',
        severity: 'critical',
        timestamp: '1 day ago',
        ipAddress: '192.168.1.45',
        details: 'Added "Delete Kiosk" permission',
    },
    {
        id: 'log-005',
        actor: { name: 'System', email: 'system@internal', role: 'System' },
        action: 'Auto-Scaling Triggered',
        target: 'Database Cluster',
        module: 'system',
        severity: 'info',
        timestamp: '2 days ago',
        ipAddress: 'localhost',
    },
];
