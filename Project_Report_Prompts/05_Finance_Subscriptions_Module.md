# Finance & Subscriptions Module Deep-Dive

**Report Type:** Module-Level Documentation  
**Panel:** ATC Super-Admin Panel  
**Module:** Subscriptions (Finance) & Invoicing  
**Routes:** `/finance`, `/invoices`  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 5 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
The **Finance & Subscriptions Module** provides financial oversight for the ATC business, including:
- Monthly Recurring Revenue (MRR) tracking across all hotels
- Contract status and expiration monitoring
- AMC (Annual Maintenance Contract) progress visualization
- Revenue breakdown by hotel
- Invoice generation and payment tracking

This documentation covers two related pages:
1. **Subscriptions** (`/finance`) - Revenue overview and contract management
2. **Invoicing** (`/invoices`) - Invoice log and payment status

### 1.2 Who Uses It
| Role | Access Level | Primary Use |
|------|-------------|-------------|
| Super Admin | Full Access | Complete financial oversight |
| Operations Manager | No Access | Not relevant to role |
| Finance Manager | Full Access | Primary revenue tracking |
| Support Staff | No Access | Not relevant to role |

### 1.3 Position in Application
- **Sidebar Location:** Business & Finance → Subscriptions, Invoicing
- **Routes:** `/finance`, `/invoices`
- **Entry Points:** Sidebar navigation

---

## 2. Subscriptions Page (`/finance`)

### 2.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Subscriptions" | "Revenue overview, contracts, and AMC status" │
├──────────────────────────────────────────────────────────────────┤
│  Summary Cards (4 columns)                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ Total    │ │ Active   │ │ At-Risk  │ │ Avg per  │             │
│  │ MRR      │ │ Revenue  │ │ Revenue  │ │ Hotel    │             │
│  │ ₹3.05L   │ │ ₹2.80L   │ │ ₹25K     │ │ ₹50K     │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
├──────────────────────────────────────────────────────────────────┤
│  Main Content (3 columns)                                         │
│  ┌────────────────┐ ┌────────────────────────────────────────────┐│
│  │ Expiring Soon  │ │ Revenue by Hotel (Table)                   ││
│  │ (Contract List)│ │                                            ││
│  │ with AMC bars  │ │ Hotel | Status | Plan | MRR | Contract    ││
│  └────────────────┘ └────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Summary Cards

#### 2.2.1 Total MRR Card
| Property | Value |
|----------|-------|
| **Label** | "Total MRR" |
| **Value** | Sum of all hotel MRR (emerald-600) |
| **Icon** | IndianRupee |
| **Icon Background** | bg-emerald-100 |
| **Subtitle** | "Across {X} paying hotels" |

#### 2.2.2 Active Revenue Card
| Property | Value |
|----------|-------|
| **Label** | "Active Revenue" |
| **Value** | MRR from hotels with status='active' (emerald-600) |
| **Icon** | TrendingUp |
| **Icon Background** | bg-emerald-100 |
| **Subtitle** | "From {X} active hotels" |

#### 2.2.3 At-Risk Revenue Card
| Property | Value |
|----------|-------|
| **Label** | "At-Risk Revenue" |
| **Value** | MRR from hotels with status='suspended' (rose-600) |
| **Icon** | AlertCircle |
| **Icon Background** | bg-rose-100 |
| **Subtitle** | "From suspended accounts" |

#### 2.2.4 Average per Hotel Card
| Property | Value |
|----------|-------|
| **Label** | "Avg. per Hotel" |
| **Value** | Total MRR / paying hotels count (slate-700) |
| **Icon** | Building2 |
| **Icon Background** | bg-slate-100 |
| **Subtitle** | "Average MRR per paying hotel" |

---

### 2.3 Expiring Soon Panel

| Property | Value |
|----------|-------|
| **Location** | Left column (1/3 width) |
| **Header** | Clock icon + "Expiring Soon" |
| **Badge** | Count of expiring contracts (amber background) |
| **Content** | List of hotels with contracts expiring in ≤30 days |
| **Scrollable** | Yes (max-h-64 overflow-y-auto) |

#### Contract Item
```
┌───────────────────────────────────────────┐
│  {Hotel Name}                [AMC Badge]  │
│  ═══════════════░░░░░░ (Progress Bar)     │
│  "Contract"                               │
└───────────────────────────────────────────┘
```

#### AMC Badge Component
| Days Remaining | Color | Label |
|----------------|-------|-------|
| ≤7 days | Rose | "X days" |
| ≤30 days | Amber | "X days" |
| >30 days | Emerald | "X days" |

#### AMC Progress Component
| Property | Value |
|----------|-------|
| **Purpose** | Visual progress bar showing contract timeline |
| **Start Date** | Contract start (hardcoded to 2025-01-01 in mock) |
| **End Date** | Contract renewal date |
| **Fill Color** | Based on remaining days (emerald/amber/rose) |

#### Empty State
| Condition | Display |
|-----------|---------|
| No contracts expiring in 30 days | "No contracts expiring in next 30 days" |

---

### 2.4 Revenue by Hotel Table

| Property | Value |
|----------|-------|
| **Location** | Right columns (2/3 width, col-span-2) |
| **Header** | "Revenue by Hotel" |
| **Data** | Top 5 hotels sorted by MRR (descending) |

#### Table Columns
| Column | Header | Content | Alignment |
|--------|--------|---------|-----------|
| Hotel | "HOTEL" | Building2 icon + Hotel name | Left |
| Status | "STATUS" | Status badge (active/suspended/etc) | Left |
| Plan | "PLAN" | Plan badge (standard/advanced) | Left |
| MRR | "MRR" | Formatted currency (emerald) | Right |
| Contract | "CONTRACT" | AMC Badge showing days remaining | Left |

---

## 3. Invoicing Page (`/invoices`)

### 3.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Invoicing" | "Invoice log and payment status"                  │
│                                    [Filter] [+ New Invoice]       │
├──────────────────────────────────────────────────────────────────┤
│  Summary Cards (3 columns)                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│  │ Paid         │ │ Pending      │ │ Overdue      │              │
│  │ ₹1,00,000    │ │ ₹15,000      │ │ ₹25,000      │              │
│  │ (emerald)    │ │ (amber)      │ │ (rose)       │              │
│  └──────────────┘ └──────────────┘ └──────────────┘              │
├──────────────────────────────────────────────────────────────────┤
│  Invoices Table                                                   │
│  Invoice ID | Hotel | Amount | Status | Due Date | Actions       │
│  INV-2026-001 | Royal Orchid | ₹50,000 | ✓ Paid | 15 Jan | [↓]  │
│  INV-2026-002 | Lemon Tree   | ₹25,000 | ⚠ Overdue | 10 Jan | [↓]│
│  ...                                                              │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Page Header

| Element | Description |
|---------|-------------|
| **Title** | "Invoicing" |
| **Subtitle** | "Invoice log and payment status" |
| **Filter Button** | Secondary button with Filter icon |
| **New Invoice Button** | Primary button with FileText icon |

---

### 3.3 Summary Cards

#### 3.3.1 Paid Card
| Property | Value |
|----------|-------|
| **Label** | "Paid" |
| **Value** | Sum of paid invoice amounts |
| **Color** | emerald-600 |

#### 3.3.2 Pending Card
| Property | Value |
|----------|-------|
| **Label** | "Pending" |
| **Value** | Sum of pending invoice amounts |
| **Color** | amber-600 |

#### 3.3.3 Overdue Card
| Property | Value |
|----------|-------|
| **Label** | "Overdue" |
| **Value** | Sum of overdue invoice amounts |
| **Color** | rose-600 |

---

### 3.4 Invoices Table

#### Table Columns
| Column | Header | Content | Alignment |
|--------|--------|---------|-----------|
| Invoice | "INVOICE" | Invoice ID in monospace font | Left |
| Hotel | "HOTEL" | Hotel name | Left |
| Amount | "AMOUNT" | Formatted currency | Right |
| Status | "STATUS" | Status badge with icon | Left |
| Due Date | "DUE DATE" | Calendar icon + formatted date | Left |
| Actions | "ACTIONS" | Download button | Center |

#### Status Badge (Invoice-specific)
| Status | Icon | Background | Text Color | Label |
|--------|------|------------|------------|-------|
| paid | CheckCircle | bg-emerald-100 | text-emerald-700 | "Paid" |
| pending | Clock | bg-amber-100 | text-amber-700 | "Pending" |
| overdue | AlertCircle | bg-rose-100 | text-rose-700 | "Overdue" |

---

## 4. Button & Action Mapping

### 4.1 Subscriptions Page Actions

| Button | Type | Location | Click Behavior |
|--------|------|----------|----------------|
| (None in current build) | - | - | Read-only page |

### 4.2 Invoicing Page Actions

| Button | Type | Icon | Click Behavior |
|--------|------|------|----------------|
| Filter | Secondary | Filter | No-op (placeholder) |
| New Invoice | Primary | FileText | No-op (placeholder) |
| Download | Icon | Download | No-op (placeholder) |

---

## 5. Data Dependencies

### 5.1 Type Definitions
```typescript
// From Hotel type
interface Hotel {
    id: string;
    name: string;
    status: Status;
    plan: HotelPlan;
    mrr: number;
    contractRenewalDate: string;
}

// Invoice (local to page)
interface Invoice {
    id: string;
    hotelName: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
    paidDate: string | null;
}
```

### 5.2 Mock Data Sources

| Page | Source | Location |
|------|--------|----------|
| Subscriptions | `MOCK_HOTELS` | `lib/mock-data.ts` |
| Invoicing | `MOCK_INVOICES` | Inline in page file |

### 5.3 Computed Values (Subscriptions)

| Variable | Computation |
|----------|-------------|
| `totalMRR` | Sum of all hotel MRR |
| `activeHotels` | Hotels with status='active' |
| `activeMRR` | Sum of active hotel MRR |
| `suspendedMRR` | Sum of suspended hotel MRR |
| `avgRevenuePerHotel` | totalMRR / paying hotels count |
| `sortedHotels` | Hotels sorted by MRR descending |
| `expiringContracts` | Hotels with ≤30 days to renewal, sorted by days remaining |

### 5.4 Helper Function
```typescript
function getDaysRemaining(dateStr: string): number {
    const end = new Date(dateStr).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}
```

---

## 6. Shared Components

### 6.1 AMCProgress Component
| Location | `components/ui/AMCProgress.tsx` |
| Purpose | Visual progress bar for contract timeline |
| Props | `startDate, endDate, label` |
| Visual | Horizontal bar with fill based on elapsed time |

### 6.2 AMCBadge Component
| Location | `components/ui/AMCProgress.tsx` |
| Purpose | Colored badge showing days remaining |
| Props | `daysRemaining` |
| Colors | ≤7: rose, ≤30: amber, >30: emerald |

### 6.3 formatCurrency Function
```typescript
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
```

---

## 7. Imports & Dependencies

### 7.1 Subscriptions Page
```typescript
import { IndianRupee, TrendingUp, Building2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { MOCK_HOTELS } from '@/lib/mock-data';
import { AMCProgress, AMCBadge } from '@/components/ui/AMCProgress';
```

### 7.2 Invoicing Page
```typescript
import { FileText, Calendar, IndianRupee, Download, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
```

---

## 8. Role-Based Visibility

| Element | Super Admin | Finance Manager | Others |
|---------|:-----------:|:---------------:|:------:|
| Subscriptions page | ✅ | ✅ | ❌ |
| Invoicing page | ✅ | ✅ | ❌ |
| All KPI cards | ✅ | ✅ | - |
| Revenue table | ✅ | ✅ | - |
| Invoice actions | ✅ | ✅ | - |

*Note: Operations Manager and Support Staff do not have access to finance modules.*

---

## 9. Navigation Flow

### 9.1 Entry Points
| From | Action | Result |
|------|--------|--------|
| Sidebar | Click "Subscriptions" | Navigate to `/finance` |
| Sidebar | Click "Invoicing" | Navigate to `/invoices` |

### 9.2 Exit Points
| From | Action | Result |
|------|--------|--------|
| Any finance page | Click sidebar item | Navigate elsewhere |

### 9.3 Cross-Module Links
| From | To | Link Type |
|------|------|-----------|
| (None in current build) | - | - |

---

## 10. UX Intent

### Why is the Finance module structured this way?

1. **Revenue First**
   - Total MRR is the most critical business metric
   - Prominent placement with color coding for health

2. **Risk Highlighting**
   - "At-Risk Revenue" card surfaces suspended accounts
   - Red coloring draws immediate attention

3. **Contract Monitoring**
   - Expiring Soon panel prevents missed renewals
   - AMC progress bars provide visual timeline context

4. **Revenue Breakdown**
   - Top 5 hotels by MRR for quick identification
   - Status and plan visible to understand revenue quality

5. **Invoice Status Categorization**
   - Three-way split: Paid, Pending, Overdue
   - Colors match severity (green → amber → red)

6. **Minimal Actions**
   - Finance is primarily a monitoring module
   - Actions are placeholders for future functionality

---

## 11. Potential Improvements (Documented, Not Implemented)

> ⚠️ **Note:** These are observations, not current features.

- Filter button should open filter panel
- New Invoice should open creation form
- Download should generate PDF
- Hotel rows could link to hotel details
- Date range selector for invoice history
- Payment recording functionality
- Invoice email sending

---

## 12. Component File Summary

| Component | File Path | Size | Purpose |
|-----------|-----------|------|---------|
| Subscriptions Page | `app/finance/page.tsx` | ~11KB | Revenue overview |
| Invoicing Page | `app/invoices/page.tsx` | ~8KB | Invoice tracking |
| AMCProgress | `components/ui/AMCProgress.tsx` | Shared | Progress bar |
| AMCBadge | `components/ui/AMCProgress.tsx` | Shared | Days remaining badge |

---

**End of Report 05**

*Awaiting user confirmation to proceed to Report 06: Reports & Analytics Module Deep-Dive.*
