import { Invoice, HotelSubscription, RevenueData, AtRiskItem, FinancialMetrics, CashFlowSummary } from '@/types/finance';

// Financial Metrics
export const MOCK_FINANCIAL_METRICS: FinancialMetrics = {
    mrr: 420000,
    arr: 5040000,
    mrrGrowthQoQ: 12.5,
    mrrGrowthYoY: 45.2,
    totalCollected: 385000,
    totalOutstanding: 35000,
    totalOverdue: 25000,
    activeSubscriptions: 10,
    newSubscriptionsThisMonth: 2,
    churnedThisMonth: 0,
};

export const MOCK_CASH_FLOW: CashFlowSummary = {
    collected: 385000,
    outstanding: 35000,
    overdue: 25000,
};

// Revenue by Stream (6 months)
export const MOCK_REVENUE_DATA: RevenueData[] = [
    { name: 'Aug', subscription: 320000, hardware: 150000, amc: 45000, total: 515000 },
    { name: 'Sep', subscription: 340000, hardware: 80000, amc: 48000, total: 468000 },
    { name: 'Oct', subscription: 360000, hardware: 200000, amc: 50000, total: 610000 },
    { name: 'Nov', subscription: 380000, hardware: 120000, amc: 52000, total: 552000 },
    { name: 'Dec', subscription: 400000, hardware: 250000, amc: 55000, total: 705000 },
    { name: 'Jan', subscription: 420000, hardware: 100000, amc: 58000, total: 578000 },
];

// MRR Trend (sparkline data)
export const MOCK_MRR_TREND = [
    { month: 'Aug', value: 320000 },
    { month: 'Sep', value: 340000 },
    { month: 'Oct', value: 360000 },
    { month: 'Nov', value: 380000 },
    { month: 'Dec', value: 400000 },
    { month: 'Jan', value: 420000 },
];

// Hotel Subscriptions with detailed payment info
export const MOCK_SUBSCRIPTIONS: HotelSubscription[] = [
    {
        hotelId: 'h-001',
        hotelName: 'Royal Orchid Bangalore',
        location: 'Bangalore, KA',
        plan: 'advanced',
        status: 'active',
        paymentMethod: 'auto',
        paymentStatus: 'active',
        mrr: 50000,
        startDate: '2024-01-15',
        nextBillingDate: '2026-02-01',
        contractEndDate: '2025-12-01',
        cardLast4: '4242',
        cardBrand: 'Visa',
        kioskUsage: 4,
        kioskLimit: 5,
    },
    {
        hotelId: 'h-002',
        hotelName: 'Lemon Tree Premier',
        location: 'Mumbai, MH',
        plan: 'standard',
        status: 'suspended',
        paymentMethod: 'manual',
        paymentStatus: 'failed',
        mrr: 25000,
        startDate: '2023-06-01',
        nextBillingDate: '2026-01-10',
        contractEndDate: '2024-03-01',
        failedAttempts: 3,
        lastFailureReason: 'Payment overdue - 9 days',
        kioskUsage: 2,
        kioskLimit: 2,
    },
    {
        hotelId: 'h-003',
        hotelName: 'Ginger Hotel, Panjim',
        location: 'Goa',
        plan: 'standard',
        status: 'active',
        paymentMethod: 'auto',
        paymentStatus: 'active',
        mrr: 15000,
        startDate: '2024-03-01',
        nextBillingDate: '2026-01-25',
        contractEndDate: '2026-02-15',
        cardLast4: '1234',
        cardBrand: 'Mastercard',
        kioskUsage: 1,
        kioskLimit: 2,
    },
    {
        hotelId: 'h-005',
        hotelName: 'Taj Palace',
        location: 'New Delhi',
        plan: 'advanced',
        status: 'active',
        paymentMethod: 'auto',
        paymentStatus: 'active',
        mrr: 75000,
        startDate: '2023-09-15',
        nextBillingDate: '2026-02-15',
        contractEndDate: '2026-03-15',
        cardLast4: '5678',
        cardBrand: 'Amex',
        kioskUsage: 3,
        kioskLimit: 5,
    },
    {
        hotelId: 'h-006',
        hotelName: 'ITC Maratha',
        location: 'Mumbai, MH',
        plan: 'advanced',
        status: 'active',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'active',
        mrr: 50000,
        startDate: '2024-02-01',
        nextBillingDate: '2026-02-01',
        contractEndDate: '2026-04-01',
        kioskUsage: 2,
        kioskLimit: 5,
    },
    {
        hotelId: 'h-007',
        hotelName: 'Radisson Blu',
        location: 'Chennai, TN',
        plan: 'standard',
        status: 'grace_period',
        paymentMethod: 'manual',
        paymentStatus: 'grace_period',
        mrr: 30000,
        startDate: '2024-05-20',
        nextBillingDate: '2026-01-20',
        contractEndDate: '2026-05-20',
        gracePeriodDaysRemaining: 5,
        kioskUsage: 2,
        kioskLimit: 3,
    },
    {
        hotelId: 'h-008',
        hotelName: 'Marriott Suites',
        location: 'Hyderabad, TS',
        plan: 'advanced',
        status: 'active',
        paymentMethod: 'auto',
        paymentStatus: 'active',
        mrr: 60000,
        startDate: '2024-01-10',
        nextBillingDate: '2026-02-10',
        contractEndDate: '2026-07-10',
        cardLast4: '9012',
        cardBrand: 'Visa',
        kioskUsage: 4,
        kioskLimit: 5,
    },
    {
        hotelId: 'h-009',
        hotelName: 'Holiday Inn',
        location: 'Pune, MH',
        plan: 'standard',
        status: 'active',
        paymentMethod: 'upi',
        paymentStatus: 'active',
        mrr: 15000,
        startDate: '2024-08-01',
        nextBillingDate: '2026-02-01',
        contractEndDate: '2026-08-01',
        kioskUsage: 1,
        kioskLimit: 2,
    },
    {
        hotelId: 'h-010',
        hotelName: 'The Leela Palace',
        location: 'Udaipur, RJ',
        plan: 'advanced',
        status: 'active',
        paymentMethod: 'auto',
        paymentStatus: 'active',
        mrr: 80000,
        startDate: '2024-03-15',
        nextBillingDate: '2026-02-15',
        contractEndDate: '2026-09-15',
        cardLast4: '3456',
        cardBrand: 'Visa',
        kioskUsage: 5,
        kioskLimit: 8,
    },
    {
        hotelId: 'h-012',
        hotelName: 'Trident Nariman',
        location: 'Mumbai, MH',
        plan: 'standard',
        status: 'active',
        paymentMethod: 'cheque',
        paymentStatus: 'active',
        mrr: 20000,
        startDate: '2024-05-20',
        nextBillingDate: '2026-02-20',
        contractEndDate: '2026-11-20',
        kioskUsage: 2,
        kioskLimit: 3,
    },
];

// At-Risk Revenue items
export const MOCK_AT_RISK_ITEMS: AtRiskItem[] = [
    {
        id: 'risk-001',
        hotelId: 'h-002',
        hotelName: 'Lemon Tree Premier',
        type: 'overdue_payment',
        severity: 'critical',
        amount: 25000,
        message: 'Payment overdue by 9 days',
        daysOverdue: 9,
    },
    {
        id: 'risk-002',
        hotelId: 'h-003',
        hotelName: 'Ginger Hotel, Panjim',
        type: 'expiring_contract',
        severity: 'warning',
        amount: 15000,
        message: 'Contract expires in 26 days',
        daysToExpiry: 26,
    },
    {
        id: 'risk-003',
        hotelId: 'h-007',
        hotelName: 'Radisson Blu',
        type: 'payment_failed',
        severity: 'warning',
        amount: 30000,
        message: 'Grace period - 5 days remaining',
        failureCount: 2,
    },
];

// Invoices with detailed data
export const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv-001',
        hotelId: 'h-001',
        hotelName: 'Royal Orchid Bangalore',
        invoiceNumber: 'INV-2026-001',
        amount: 50000,
        taxAmount: 9000,
        totalAmount: 59000,
        status: 'paid',
        issueDate: '2026-01-01',
        dueDate: '2026-01-15',
        paidDate: '2026-01-12',
        lineItems: [
            { description: 'Monthly Subscription - Advanced Plan', quantity: 1, unitPrice: 45000, amount: 45000 },
            { description: 'Additional Kiosk License', quantity: 1, unitPrice: 5000, amount: 5000 },
        ],
        paymentReference: 'UTR123456789',
    },
    {
        id: 'inv-002',
        hotelId: 'h-002',
        hotelName: 'Lemon Tree Premier',
        invoiceNumber: 'INV-2026-002',
        amount: 25000,
        taxAmount: 4500,
        totalAmount: 29500,
        status: 'overdue',
        issueDate: '2026-01-01',
        dueDate: '2026-01-10',
        paidDate: null,
        lineItems: [
            { description: 'Monthly Subscription - Standard Plan', quantity: 1, unitPrice: 20000, amount: 20000 },
            { description: 'Additional Kiosk License', quantity: 1, unitPrice: 5000, amount: 5000 },
        ],
    },
    {
        id: 'inv-003',
        hotelId: 'h-003',
        hotelName: 'Ginger Hotel, Panjim',
        invoiceNumber: 'INV-2026-003',
        amount: 15000,
        taxAmount: 2700,
        totalAmount: 17700,
        status: 'pending',
        issueDate: '2026-01-10',
        dueDate: '2026-01-25',
        paidDate: null,
        lineItems: [
            { description: 'Monthly Subscription - Standard Plan', quantity: 1, unitPrice: 15000, amount: 15000 },
        ],
    },
    {
        id: 'inv-004',
        hotelId: 'h-005',
        hotelName: 'Taj Palace',
        invoiceNumber: 'INV-2026-004',
        amount: 75000,
        taxAmount: 13500,
        totalAmount: 88500,
        status: 'paid',
        issueDate: '2026-01-01',
        dueDate: '2026-01-15',
        paidDate: '2026-01-10',
        lineItems: [
            { description: 'Monthly Subscription - Advanced Plan', quantity: 1, unitPrice: 60000, amount: 60000 },
            { description: 'Additional Kiosk License', quantity: 3, unitPrice: 5000, amount: 15000 },
        ],
        paymentReference: 'UTR987654321',
    },
    {
        id: 'inv-005',
        hotelId: 'h-006',
        hotelName: 'ITC Maratha',
        invoiceNumber: 'INV-2026-005',
        amount: 50000,
        taxAmount: 9000,
        totalAmount: 59000,
        status: 'paid',
        issueDate: '2026-01-01',
        dueDate: '2026-01-15',
        paidDate: '2026-01-14',
        lineItems: [
            { description: 'Monthly Subscription - Advanced Plan', quantity: 1, unitPrice: 45000, amount: 45000 },
            { description: 'Additional Kiosk License', quantity: 1, unitPrice: 5000, amount: 5000 },
        ],
        paymentReference: 'NEFT/2026/001234',
    },
    {
        id: 'inv-006',
        hotelId: 'h-008',
        hotelName: 'Marriott Suites',
        invoiceNumber: 'INV-2026-006',
        amount: 60000,
        taxAmount: 10800,
        totalAmount: 70800,
        status: 'paid',
        issueDate: '2026-01-01',
        dueDate: '2026-01-15',
        paidDate: '2026-01-08',
        lineItems: [
            { description: 'Monthly Subscription - Advanced Plan', quantity: 1, unitPrice: 55000, amount: 55000 },
            { description: 'Additional Kiosk License', quantity: 1, unitPrice: 5000, amount: 5000 },
        ],
        paymentReference: 'CC4242',
    },
    {
        id: 'inv-007',
        hotelId: 'h-010',
        hotelName: 'The Leela Palace',
        invoiceNumber: 'INV-2026-007',
        amount: 80000,
        taxAmount: 14400,
        totalAmount: 94400,
        status: 'paid',
        issueDate: '2026-01-01',
        dueDate: '2026-01-15',
        paidDate: '2026-01-11',
        lineItems: [
            { description: 'Monthly Subscription - Advanced Plan', quantity: 1, unitPrice: 70000, amount: 70000 },
            { description: 'Additional Kiosk License', quantity: 2, unitPrice: 5000, amount: 10000 },
        ],
        paymentReference: 'CC3456',
    },
];

// Aging buckets helper
export function getAgingBuckets(invoices: Invoice[]) {
    const now = new Date();
    const buckets = {
        current: { count: 0, amount: 0 },      // 0-30 days
        thirtyPlus: { count: 0, amount: 0 },   // 31-60 days
        sixtyPlus: { count: 0, amount: 0 },    // 61-90 days
        ninetyPlus: { count: 0, amount: 0 },   // 90+ days
    };

    invoices.filter(inv => inv.status === 'overdue' || inv.status === 'pending').forEach(inv => {
        const dueDate = new Date(inv.dueDate);
        const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

        if (daysOverdue <= 30) {
            buckets.current.count++;
            buckets.current.amount += inv.totalAmount;
        } else if (daysOverdue <= 60) {
            buckets.thirtyPlus.count++;
            buckets.thirtyPlus.amount += inv.totalAmount;
        } else if (daysOverdue <= 90) {
            buckets.sixtyPlus.count++;
            buckets.sixtyPlus.amount += inv.totalAmount;
        } else {
            buckets.ninetyPlus.count++;
            buckets.ninetyPlus.amount += inv.totalAmount;
        }
    });

    return buckets;
}
