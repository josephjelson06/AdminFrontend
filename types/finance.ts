// Finance & Billing Types
export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';
export type PaymentMethod = 'auto' | 'manual' | 'bank_transfer' | 'upi' | 'cheque';
export type PaymentStatus = 'active' | 'failed' | 'grace_period' | 'paused';
export type RevenueStream = 'subscription' | 'hardware' | 'amc';
export type PlanStatus = 'active' | 'deprecated';
export type PricingModel = 'flat' | 'per-unit' | 'tiered';
export type BillingFrequency = 'monthly' | 'quarterly' | 'annual';

// Plans - Commercial Configuration (what we sell)
export interface Plan {
    id: string;
    name: string;                       // Standard, Advanced, Enterprise
    description: string;
    pricingModel: PricingModel;
    basePrice: number;                  // Base monthly price
    includedKiosks: number;             // Kiosks included in base price
    overageRate?: number;               // Per-kiosk overage rate
    billingFrequency: BillingFrequency[];
    status: PlanStatus;
    features: string[];                 // List of included features
    effectiveDate: string;              // When this plan version became active
    version: number;                    // For versioning history
    subscriberCount?: number;           // Read-only, for display (not editable here)
}

export interface Invoice {
    id: string;
    hotelId: string;
    hotelName: string;
    invoiceNumber: string;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    paidDate: string | null;
    lineItems: InvoiceLineItem[];
    paymentReference?: string;
}

export interface InvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface HotelSubscription {
    hotelId: string;
    hotelName: string;
    location: string;
    plan: 'standard' | 'advanced';
    status: 'active' | 'suspended' | 'grace_period' | 'cancelled';
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    mrr: number;
    startDate: string;
    nextBillingDate: string;
    contractEndDate: string;
    cardLast4?: string;
    cardBrand?: string;
    failedAttempts?: number;
    lastFailureReason?: string;
    gracePeriodDaysRemaining?: number;
}

export interface RevenueData {
    name: string;
    subscription: number;
    hardware: number;
    amc: number;
    total: number;
    [key: string]: string | number;
}

export interface CashFlowSummary {
    collected: number;
    outstanding: number;
    overdue: number;
}

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
