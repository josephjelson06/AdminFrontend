// Invoice types
export interface InvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface Invoice {
    id: string;
    hotelId: string;
    hotelName: string;
    invoiceNumber: string;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    status: 'paid' | 'pending' | 'overdue' | 'cancelled';
    issueDate: string;
    dueDate: string;
    paidDate: string | null;
    lineItems: InvoiceLineItem[];
    paymentReference?: string;
}

// Hotel Subscription types
export interface HotelSubscription {
    hotelId: string;
    hotelName: string;
    location: string;
    plan: 'standard' | 'advanced';
    status: 'active' | 'suspended' | 'grace_period' | 'cancelled';
    paymentMethod: 'auto' | 'manual' | 'bank_transfer' | 'upi' | 'cheque';
    paymentStatus: 'active' | 'failed' | 'grace_period';
    mrr: number;
    startDate: string;
    nextBillingDate: string;
    contractEndDate: string;
    cardLast4?: string;
    cardBrand?: string;
    failedAttempts?: number;
    lastFailureReason?: string;
    gracePeriodDaysRemaining?: number;
    kioskUsage: number;
    kioskLimit: number;
}

// Revenue Data for charts
export interface RevenueData {
    name: string;
    subscription: number;
    hardware: number;
    amc: number;
    total: number;
}

// At-Risk items
export interface AtRiskItem {
    id: string;
    hotelId: string;
    hotelName: string;
    type: 'overdue_payment' | 'expiring_contract' | 'payment_failed';
    severity: 'critical' | 'warning' | 'info';
    amount: number;
    message: string;
    daysOverdue?: number;
    daysToExpiry?: number;
    failureCount?: number;
}

// Financial Metrics
export interface FinancialMetrics {
    mrr: number;
    arr: number;
    mrrGrowthQoQ: number;
    mrrGrowthYoY: number;
    totalCollected: number;
    totalOutstanding: number;
    totalOverdue: number;
    activeSubscriptions: number;
    newSubscriptionsThisMonth: number;
    churnedThisMonth: number;
}

// Cash Flow Summary
export interface CashFlowSummary {
    collected: number;
    outstanding: number;
    overdue: number;
}

// MRR Trend data point
export interface MRRTrendPoint {
    month: string;
    value: number;
}

// Plan Status type
export type PlanStatus = 'active' | 'deprecated';

// Pricing Model type
export type PricingModel = 'flat' | 'per-unit' | 'tiered';

// Plan types
export interface Plan {
    id: string;
    name: string;
    description: string;
    pricingModel: PricingModel;
    basePrice: number;
    includedKiosks: number;
    overageRate: number;
    billingFrequency: string[];
    status: PlanStatus;
    features: string[];
    effectiveDate: string;
    version: number;
    subscriberCount: number;
}
