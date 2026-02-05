'use client';

/**
 * Report Export Page
 * 
 * Dynamic route for individual report type exports.
 * Provides date range, format selection, filters, and preview.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { subDays } from 'date-fns';
import { reportsService } from '@/lib/services/reportsService';
import {
    Building2,
    CreditCard,
    FileText,
    Users,
    ClipboardList,
    DollarSign,
} from 'lucide-react';
import {
    ExportPageLayout,
    DateRangeSelector,
    FormatSelector,
    ExportFilters,
    ExportPreview,
} from '@/components/admin/reports/export';
import type { DateRange, ExportFormat, FilterOption, Column } from '@/components/admin/reports/export';
import { useToast } from '@/components/shared/ui/Toast';

// Report type configurations
const reportConfigs = {
    hotels: {
        title: 'Hotels Report',
        description: 'Export complete hotel registry data including status, ratings, and amenities.',
        icon: Building2,
        formats: ['csv', 'pdf', 'xlsx'] as ExportFormat[],
        filters: [
            { id: 'search', label: 'Search', type: 'search' as const },
            {
                id: 'status',
                label: 'Status',
                type: 'select' as const,
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'onboarding', label: 'Onboarding' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'suspended', label: 'Suspended' },
                ],
            },
            {
                id: 'plan',
                label: 'Plan',
                type: 'select' as const,
                options: [
                    { value: 'basic', label: 'Basic' },
                    { value: 'standard', label: 'Standard' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'enterprise', label: 'Enterprise' },
                ],
            },
        ] as FilterOption[],
        columns: [
            { id: 'name', label: 'Hotel Name', sortable: true },
            { id: 'city', label: 'City', sortable: true },
            { id: 'state', label: 'State', sortable: true },
            { id: 'status', label: 'Status', sortable: true },
            { id: 'plan', label: 'Plan', sortable: true },
            { id: 'kiosks', label: 'Kiosks', sortable: true },
            { id: 'createdAt', label: 'Created', sortable: true },
        ] as Column[],
        mockData: [
            { name: 'Grand Hyatt Mumbai', city: 'Mumbai', state: 'MH', status: 'Active', plan: 'Premium', kiosks: 12, createdAt: '2024-01-15' },
            { name: 'Taj Palace Delhi', city: 'Delhi', state: 'DL', status: 'Active', plan: 'Enterprise', kiosks: 18, createdAt: '2024-02-20' },
            { name: 'Oberoi Bangalore', city: 'Bangalore', state: 'KA', status: 'Onboarding', plan: 'Standard', kiosks: 6, createdAt: '2024-03-10' },
            { name: 'ITC Grand Chola', city: 'Chennai', state: 'TN', status: 'Active', plan: 'Premium', kiosks: 14, createdAt: '2024-01-25' },
            { name: 'The Leela Palace', city: 'Udaipur', state: 'RJ', status: 'Active', plan: 'Enterprise', kiosks: 10, createdAt: '2024-02-05' },
        ],
    },
    subscriptions: {
        title: 'Subscriptions Report',
        description: 'Export subscription data with plan details, status, and renewal information.',
        icon: CreditCard,
        formats: ['csv', 'pdf', 'xlsx'] as ExportFormat[],
        filters: [
            { id: 'search', label: 'Search', type: 'search' as const },
            {
                id: 'plan',
                label: 'Plan',
                type: 'select' as const,
                options: [
                    { value: 'basic', label: 'Basic' },
                    { value: 'standard', label: 'Standard' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'enterprise', label: 'Enterprise' },
                ],
            },
            {
                id: 'status',
                label: 'Status',
                type: 'select' as const,
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'cancelled', label: 'Cancelled' },
                ],
            },
        ] as FilterOption[],
        columns: [
            { id: 'hotel', label: 'Hotel', sortable: true },
            { id: 'plan', label: 'Plan', sortable: true },
            { id: 'status', label: 'Status', sortable: true },
            { id: 'amount', label: 'Amount', sortable: true },
            { id: 'startDate', label: 'Start Date', sortable: true },
            { id: 'renewalDate', label: 'Renewal Date', sortable: true },
        ] as Column[],
        mockData: [
            { hotel: 'Grand Hyatt Mumbai', plan: 'Premium', status: 'Active', amount: '₹25,000', startDate: '2024-01-15', renewalDate: '2025-01-15' },
            { hotel: 'Taj Palace Delhi', plan: 'Enterprise', status: 'Active', amount: '₹50,000', startDate: '2024-02-20', renewalDate: '2025-02-20' },
            { hotel: 'Oberoi Bangalore', plan: 'Standard', status: 'Pending', amount: '₹15,000', startDate: '2024-03-10', renewalDate: '2025-03-10' },
        ],
    },
    invoices: {
        title: 'Invoices Report',
        description: 'Export invoice data with payment status, amounts, and hotel details.',
        icon: FileText,
        formats: ['csv', 'pdf', 'xlsx'] as ExportFormat[],
        filters: [
            { id: 'search', label: 'Search', type: 'search' as const },
            {
                id: 'status',
                label: 'Status',
                type: 'select' as const,
                options: [
                    { value: 'paid', label: 'Paid' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'overdue', label: 'Overdue' },
                ],
            },
        ] as FilterOption[],
        columns: [
            { id: 'invoiceNo', label: 'Invoice #', sortable: true },
            { id: 'hotel', label: 'Hotel', sortable: true },
            { id: 'amount', label: 'Amount', sortable: true },
            { id: 'status', label: 'Status', sortable: true },
            { id: 'dueDate', label: 'Due Date', sortable: true },
            { id: 'paidDate', label: 'Paid Date', sortable: true },
        ] as Column[],
        mockData: [
            { invoiceNo: 'INV-2024-001', hotel: 'Grand Hyatt Mumbai', amount: '₹25,000', status: 'Paid', dueDate: '2024-02-15', paidDate: '2024-02-10' },
            { invoiceNo: 'INV-2024-002', hotel: 'Taj Palace Delhi', amount: '₹50,000', status: 'Pending', dueDate: '2024-03-20', paidDate: '-' },
        ],
    },
    users: {
        title: 'Users Report',
        description: 'Export user accounts data with roles, status, and activity information.',
        icon: Users,
        formats: ['csv', 'xlsx'] as ExportFormat[],
        filters: [
            { id: 'search', label: 'Search', type: 'search' as const },
            {
                id: 'role',
                label: 'Role',
                type: 'select' as const,
                options: [
                    { value: 'admin', label: 'Admin' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'staff', label: 'Staff' },
                ],
            },
            {
                id: 'status',
                label: 'Status',
                type: 'select' as const,
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ],
            },
        ] as FilterOption[],
        columns: [
            { id: 'name', label: 'Name', sortable: true },
            { id: 'email', label: 'Email', sortable: true },
            { id: 'role', label: 'Role', sortable: true },
            { id: 'hotel', label: 'Hotel', sortable: true },
            { id: 'status', label: 'Status', sortable: true },
            { id: 'lastActive', label: 'Last Active', sortable: true },
        ] as Column[],
        mockData: [
            { name: 'Raj Sharma', email: 'raj@hyatt.com', role: 'Admin', hotel: 'Grand Hyatt Mumbai', status: 'Active', lastActive: '2024-03-15' },
            { name: 'Priya Patel', email: 'priya@taj.com', role: 'Manager', hotel: 'Taj Palace Delhi', status: 'Active', lastActive: '2024-03-14' },
        ],
    },
    audit: {
        title: 'Audit Logs Report',
        description: 'Export system audit logs with user actions and timestamps.',
        icon: ClipboardList,
        formats: ['csv', 'xlsx'] as ExportFormat[],
        filters: [
            { id: 'search', label: 'Search', type: 'search' as const },
            {
                id: 'action',
                label: 'Action Type',
                type: 'select' as const,
                options: [
                    { value: 'create', label: 'Create' },
                    { value: 'update', label: 'Update' },
                    { value: 'delete', label: 'Delete' },
                    { value: 'login', label: 'Login' },
                ],
            },
        ] as FilterOption[],
        columns: [
            { id: 'timestamp', label: 'Timestamp', sortable: true },
            { id: 'user', label: 'User', sortable: true },
            { id: 'action', label: 'Action', sortable: true },
            { id: 'resource', label: 'Resource', sortable: true },
            { id: 'details', label: 'Details', sortable: false },
        ] as Column[],
        mockData: [
            { timestamp: '2024-03-15 10:30:45', user: 'raj@hyatt.com', action: 'Update', resource: 'Hotel Settings', details: 'Updated contact email' },
            { timestamp: '2024-03-15 09:15:22', user: 'admin@hms.com', action: 'Create', resource: 'User', details: 'Created new manager account' },
        ],
    },
    revenue: {
        title: 'Revenue Report',
        description: 'Export financial summary with revenue breakdown by hotel and period.',
        icon: DollarSign,
        formats: ['pdf', 'xlsx'] as ExportFormat[],
        filters: [
            { id: 'search', label: 'Search', type: 'search' as const },
            {
                id: 'period',
                label: 'Period',
                type: 'select' as const,
                options: [
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'quarterly', label: 'Quarterly' },
                    { value: 'yearly', label: 'Yearly' },
                ],
            },
        ] as FilterOption[],
        columns: [
            { id: 'hotel', label: 'Hotel', sortable: true },
            { id: 'period', label: 'Period', sortable: true },
            { id: 'subscriptions', label: 'Subscriptions', sortable: true },
            { id: 'addons', label: 'Add-ons', sortable: true },
            { id: 'total', label: 'Total Revenue', sortable: true },
        ] as Column[],
        mockData: [
            { hotel: 'Grand Hyatt Mumbai', period: 'Mar 2024', subscriptions: '₹25,000', addons: '₹5,000', total: '₹30,000' },
            { hotel: 'Taj Palace Delhi', period: 'Mar 2024', subscriptions: '₹50,000', addons: '₹10,000', total: '₹60,000' },
        ],
    },
};

type ReportType = keyof typeof reportConfigs;

// Helper to map API data to table format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapReportData(type: ReportType, data: any[]): Record<string, unknown>[] {
    switch (type) {
        case 'hotels':
            return data.map((item) => ({
                name: item.name,
                city: item.city || '-',
                state: item.state || '-',
                status: item.status,
                plan: item.plan,
                kiosks: item.kiosks || 0,
                createdAt: item.created_at ? new Date(item.created_at as string).toLocaleDateString() : '-',
            }));
        case 'invoices':
            return data.map((item) => ({
                invoiceNo: item.invoice_number,
                hotel: item.hotel_name,
                amount: `₹${(item.amount as number).toLocaleString()}`,
                status: item.status,
                dueDate: item.due_date || '-',
                paidDate: item.paid_date || '-',
            }));
        case 'subscriptions':
            return data.map((item) => ({
                hotel: item.hotel_name,
                plan: item.plan,
                status: item.status,
                amount: `₹${(item.amount as number).toLocaleString()}`,
                startDate: item.start_date || '-',
                renewalDate: item.renewal_date || '-',
            }));
        case 'users':
            return data.map((item) => ({
                name: item.name,
                email: item.email,
                role: item.role,
                hotel: item.hotel_name || '-',
                status: item.status,
                lastActive: item.last_active || '-',
            }));
        case 'audit':
            return data.map((item) => ({
                timestamp: item.timestamp ? new Date(item.timestamp as string).toLocaleString() : '-',
                user: item.user_email || '-',
                action: item.action,
                resource: item.resource,
                details: item.details || '-',
            }));
        case 'revenue':
            return data.map((item) => ({
                hotel: item.hotel_name,
                period: item.period,
                subscriptions: `₹${(item.subscriptions as number).toLocaleString()}`,
                addons: `₹${(item.addons as number).toLocaleString()}`,
                total: `₹${(item.total as number).toLocaleString()}`,
            }));
        default:
            return data;
    }
}

export default function ReportExportPage() {
    const params = useParams();
    const { addToast } = useToast();
    const reportType = params.type as string;

    // Validate report type
    if (!reportConfigs[reportType as ReportType]) {
        notFound();
    }

    const config = reportConfigs[reportType as ReportType];
    const Icon = config.icon;

    // State
    const [dateRange, setDateRange] = useState<DateRange>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });
    const [format, setFormat] = useState<ExportFormat>(config.formats[0]);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [isExporting, setIsExporting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState<Record<string, unknown>[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch data from API
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                search: filterValues.search,
                status: filterValues.status,
                plan: filterValues.plan,
                role: filterValues.role,
                action: filterValues.action,
                period: filterValues.period,
                dateFrom: dateRange.from?.toISOString().split('T')[0],
                dateTo: dateRange.to?.toISOString().split('T')[0],
            };

            let result: { data: unknown[]; total: number };
            
            switch (reportType as ReportType) {
                case 'hotels':
                    result = await reportsService.getHotelsReport(params) as unknown as { data: unknown[]; total: number };
                    break;
                case 'invoices':
                    result = await reportsService.getInvoicesReport(params) as unknown as { data: unknown[]; total: number };
                    break;
                case 'subscriptions':
                    result = await reportsService.getSubscriptionsReport(params) as unknown as { data: unknown[]; total: number };
                    break;
                case 'users':
                    result = await reportsService.getUsersReport(params) as unknown as { data: unknown[]; total: number };
                    break;
                case 'audit':
                    result = await reportsService.getAuditReport(params) as unknown as { data: unknown[]; total: number };
                    break;
                case 'revenue':
                    result = await reportsService.getRevenueReport(params) as unknown as { data: unknown[]; total: number };
                    break;
                default:
                    result = { data: [], total: 0 };
            }

            setReportData(mapReportData(reportType as ReportType, result.data as Record<string, unknown>[]));
            setTotalCount(result.total);
        } catch (error) {
            console.error('Failed to fetch report data:', error);
            addToast('error', 'Error', 'Failed to load report data');
        } finally {
            setIsLoading(false);
        }
    }, [reportType, filterValues, dateRange, addToast]);

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (id: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleClearFilters = () => {
        setFilterValues({});
    };

    const handleExport = async () => {
        setIsExporting(true);
        // TODO: Implement real export with backend
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsExporting(false);
        addToast('success', 'Export Complete', `${config.title} has been exported as ${format.toUpperCase()}.`);
    };

    return (
        <ExportPageLayout
            title={config.title}
            description={config.description}
            icon={<Icon className="w-7 h-7 text-white" />}
        >
            {/* Left Column - Settings */}
            <div className="space-y-6">
                <DateRangeSelector value={dateRange} onChange={setDateRange} />
                <FormatSelector
                    value={format}
                    onChange={setFormat}
                    availableFormats={config.formats}
                />
                <ExportFilters
                    filters={config.filters}
                    values={filterValues}
                    onChange={handleFilterChange}
                    onClear={handleClearFilters}
                />
            </div>

            {/* Right Column - Preview */}
            <ExportPreview
                columns={config.columns}
                data={reportData}
                isLoading={isLoading}
                onExport={handleExport}
                isExporting={isExporting}
                totalCount={totalCount}
            />
        </ExportPageLayout>
    );
}

