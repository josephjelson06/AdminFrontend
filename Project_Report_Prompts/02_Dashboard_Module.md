# Dashboard Module Deep-Dive

**Report Type:** Module-Level Documentation  
**Panel:** ATC Super-Admin Panel  
**Module:** Dashboard  
**Route:** `/` (Root)  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 2 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
The **Dashboard** is the landing page and operational command center for the Super-Admin Panel. It provides:
- At-a-glance KPIs for business health
- Visual trends for check-ins and revenue
- Real-time kiosk status monitoring
- Critical alerts requiring immediate attention
- Quick access to recent hotel data

### 1.2 Who Uses It
| Role | Access Level | Primary Use |
|------|-------------|-------------|
| Super Admin | Full | Monitor all metrics, access alerts |
| Operations Manager | Full | Track kiosk health, hotel status |
| Finance Manager | Full | View revenue metrics |
| Support Staff | View Only | Review system status |

### 1.3 Position in Application
- **Entry Point:** Default landing page after login
- **Sidebar Location:** Operations → Dashboard (first item)
- **Route:** `/` (root path)

---

## 2. Page Layout & Structure

### 2.1 Visual Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Dashboard" | "System overview and alerts"                       │
├──────────────────────────────────────────────────────────────────┤
│  KPI Cards Row (4 cards in grid)                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ Total    │ │ Active   │ │ Revenue  │ │ Check-ins│             │
│  │ Hotels   │ │ Kiosks   │ │ MTD      │ │ Today    │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
├──────────────────────────────────────────────────────────────────┤
│  Charts Row (3 charts)                                            │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐        │
│  │ 7-Day Check-in │ │ Revenue Trend  │ │ Kiosk Status   │        │
│  │ Trend (Bar)    │ │ (Area)         │ │ (Donut)        │        │
│  └────────────────┘ └────────────────┘ └────────────────┘        │
├──────────────────────────────────────────────────────────────────┤
│  Bottom Row (2 sections)                                          │
│  ┌──────────────────────┐ ┌─────────────────────────────────────┐│
│  │ Critical Alerts      │ │ Recent Hotels Table                 ││
│  │ (3 items)            │ │ (4 hotels with details)             ││
│  └──────────────────────┘ └─────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Responsive Behavior
| Breakpoint | Behavior |
|------------|----------|
| Desktop (lg+) | Full 4-column KPI grid, 3-column charts, 3-column bottom |
| Tablet (md) | 2-column KPI grid, stacked charts |
| Mobile (sm) | 2-column KPI grid, stacked vertical layout, card-based hotel list |

---

## 3. Component Breakdown

### 3.1 Page Header
| Property | Value |
|----------|-------|
| **Component Type** | Static Header |
| **Title** | "Dashboard" |
| **Subtitle** | "System overview and alerts" |
| **Actions** | None |

---

### 3.2 KPI Cards Section

#### 3.2.1 Total Hotels Card
| Property | Value |
|----------|-------|
| **Component Name** | KPI Card - Total Hotels |
| **Purpose** | Display count of registered hotels |
| **Icon** | Building2 (Lucide) |
| **Icon Background** | Blue-100 |
| **Primary Value** | Total hotel count (from MOCK_METRICS) |
| **Secondary Value** | "{X} active" - count of active status hotels |
| **Data Source** | `MOCK_METRICS.totalHotels`, `MOCK_HOTELS` filtered |
| **User Actions** | None (informational) |

#### 3.2.2 Active Kiosks Card
| Property | Value |
|----------|-------|
| **Component Name** | KPI Card - Active Kiosks |
| **Purpose** | Display kiosk fleet health |
| **Icon** | Cpu (Lucide) |
| **Icon Background** | Emerald-100 |
| **Primary Value** | Total active kiosk count |
| **Secondary Value** | Online count (with Wifi icon), Offline count (with WifiOff icon) |
| **Data Source** | `MOCK_METRICS.activeKiosks`, `MOCK_KIOSKS` filtered |
| **User Actions** | None (informational) |
| **Conditional Display** | Offline count only shown if > 0 |

#### 3.2.3 Revenue MTD Card
| Property | Value |
|----------|-------|
| **Component Name** | KPI Card - Revenue MTD |
| **Purpose** | Display month-to-date revenue |
| **Icon** | IndianRupee (Lucide) |
| **Icon Background** | Emerald-100 |
| **Primary Value** | Sum of all hotel MRR (formatted as ₹X,XX,XXX) |
| **Secondary Value** | "+12% vs last month" with TrendingUp icon |
| **Value Color** | Emerald-600 (always positive styling) |
| **Data Source** | Sum of `MOCK_HOTELS[].mrr` |
| **User Actions** | None (informational) |

#### 3.2.4 Check-ins Today Card
| Property | Value |
|----------|-------|
| **Component Name** | KPI Card - Check-ins Today |
| **Purpose** | Display today's check-in volume |
| **Icon** | TrendingUp (Lucide) |
| **Icon Background** | Purple-100 |
| **Primary Value** | Last day's check-in count from trend data |
| **Secondary Value** | "+8% vs yesterday" with TrendingUp icon |
| **Value Color** | Purple-600 |
| **Data Source** | `CHECKIN_TREND[last].checkins` |
| **User Actions** | None (informational) |

---

### 3.3 Charts Section

#### 3.3.1 7-Day Check-in Trend Chart
| Property | Value |
|----------|-------|
| **Component Name** | Bar Chart - Check-in Trend |
| **Purpose** | Visualize daily check-in volume over past week |
| **Chart Type** | BarChartComponent (Recharts wrapper) |
| **Height** | 180px |
| **Color** | #10b981 (Emerald) |
| **X-Axis** | Day names (Mon-Sun) |
| **Y-Axis** | Check-in count |
| **Data Source** | `CHECKIN_TREND` array |
| **User Actions** | Hover to see tooltip values |

#### 3.3.2 Revenue Trend Chart
| Property | Value |
|----------|-------|
| **Component Name** | Area Chart - Revenue Trend |
| **Purpose** | Show 6-month revenue growth |
| **Chart Type** | AreaChartComponent (Recharts wrapper) |
| **Height** | 180px |
| **Color** | #6366f1 (Indigo) |
| **Fill** | Gradient from color to transparent |
| **X-Axis** | Month names (Aug-Jan) |
| **Y-Axis** | Revenue value |
| **Data Source** | `REVENUE_TREND` array |
| **User Actions** | Hover to see tooltip values |

#### 3.3.3 Kiosk Status Chart
| Property | Value |
|----------|-------|
| **Component Name** | Donut Chart - Kiosk Status |
| **Purpose** | Show distribution of kiosk health states |
| **Chart Type** | DonutChartComponent (Recharts wrapper) |
| **Height** | 180px |
| **Colors** | Emerald (Online), Indigo (Offline), Amber (Warning) |
| **Data Source** | Computed from `MOCK_KIOSKS` filtered by status |
| **Legend** | Below chart with color dots |
| **User Actions** | Hover to see segment values |

---

### 3.4 Critical Alerts Section

| Property | Value |
|----------|-------|
| **Component Name** | Alert Feed Panel |
| **Purpose** | Highlight issues requiring immediate attention |
| **Location** | Bottom-left (1/3 width on desktop) |
| **Header** | "Critical Alerts" with AlertTriangle icon |
| **Badge** | Count of alerts (Rose background) |

#### Alert Item Structure
Each alert displays:
| Element | Description |
|---------|-------------|
| **Icon** | Type-specific (WifiOff, CreditCard, FileText) |
| **Severity Dot** | Color indicator (Rose=critical, Amber=warning, Blue=info) |
| **Title** | Alert headline |
| **Message** | Details (hotel/kiosk name, amount, etc.) |
| **Time** | Relative timestamp or action status |

#### Alert Types Displayed
| Type | Icon | Color | Example |
|------|------|-------|---------|
| Offline | WifiOff | Rose | "Kiosk Offline > 24hrs" |
| Payment | CreditCard | Amber | "Payment Overdue" |
| Contract | FileText | Blue | "Contract Expiring" |

#### Footer Link
| Element | Description |
|---------|-------------|
| **Text** | "View all alerts" |
| **Destination** | `/audit` |
| **Icon** | ChevronRight |

---

### 3.5 Recent Hotels Table

| Property | Value |
|----------|-------|
| **Component Name** | Hotels Summary Table |
| **Purpose** | Quick view of recent/important hotels |
| **Location** | Bottom-right (2/3 width on desktop) |
| **Header** | "Recent Hotels" with "View all" link to `/hotels` |
| **Data Limit** | First 4 hotels from `MOCK_HOTELS` |

#### Table Columns (Desktop)
| Column | Data | Alignment |
|--------|------|-----------|
| Hotel | Name + Location (with icons) | Left |
| Status | StatusBadge component | Left |
| Plan | PlanBadge component | Left |
| Kiosks | Count number | Center |
| MRR | Formatted currency | Right |

#### Mobile View
On small screens, displays as **card layout** with:
- Hotel name with Building2 icon
- Status badge
- Location with MapPin icon
- MRR value

---

## 4. Button & Action Mapping

### 4.1 Interactive Elements

| Element | Type | Location | Click Behavior |
|---------|------|----------|----------------|
| "View all alerts" | Text Link | Alerts section footer | Navigate to `/audit` |
| "View all" | Text Link | Hotels section header | Navigate to `/hotels` |
| Hotel Row (Desktop) | Table Row | Hotels table | Hover effect only (no click action in current build) |
| Alert Item | List Item | Alerts section | Hover effect only |

### 4.2 Chart Interactions

| Chart | Interaction | Behavior |
|-------|-------------|----------|
| Bar Chart | Hover | Tooltip shows day + value |
| Area Chart | Hover | Tooltip shows month + value |
| Donut Chart | Hover | Tooltip shows status + count |

---

## 5. Data Dependencies

### 5.1 Mock Data Sources
| Source File | Export Used | Purpose |
|-------------|-------------|---------|
| `lib/mock-data.ts` | `MOCK_HOTELS` | Hotel list, status, MRR |
| `lib/mock-data.ts` | `MOCK_METRICS` | Aggregate KPI values |
| `lib/mock-data.ts` | `MOCK_KIOSKS` | Kiosk status counts |

### 5.2 Local Mock Data (In-Page)
| Variable | Purpose |
|----------|---------|
| `CHECKIN_TREND` | 7-day check-in data |
| `REVENUE_TREND` | 6-month revenue data |
| `KIOSK_STATUS` | Computed status distribution |
| `MOCK_ALERTS` | Critical alert items |

---

## 6. Helper Components

### 6.1 StatusBadge
| Property | Value |
|----------|-------|
| **Purpose** | Display hotel status with color coding |
| **Props** | `status: Status` |
| **Variants** | active (emerald), inactive (slate), suspended (rose), pending (amber), onboarding (blue) |

### 6.2 PlanBadge
| Property | Value |
|----------|-------|
| **Purpose** | Display subscription plan tier |
| **Props** | `plan: HotelPlan` |
| **Variants** | standard (slate-700), advanced (amber gradient) |

### 6.3 AlertIcon
| Property | Value |
|----------|-------|
| **Purpose** | Render type-specific alert icon |
| **Props** | `type: string` |
| **Mapping** | offline→WifiOff, payment→CreditCard, contract→FileText |

### 6.4 SeverityDot
| Property | Value |
|----------|-------|
| **Purpose** | Colored dot indicating alert severity |
| **Props** | `severity: string` |
| **Colors** | critical (rose), warning (amber), info (blue) |

---

## 7. Imports & Dependencies

### 7.1 External Dependencies
```typescript
import Link from 'next/link';
import { Building2, Cpu, IndianRupee, AlertTriangle, TrendingUp, MapPin, Clock, CreditCard, FileText, ChevronRight, Wifi, WifiOff } from 'lucide-react';
```

### 7.2 Internal Dependencies
```typescript
import { MOCK_HOTELS, MOCK_METRICS, MOCK_KIOSKS } from '@/lib/mock-data';
import type { Status, HotelPlan } from '@/types/schema';
import { AreaChartComponent, BarChartComponent, DonutChartComponent } from '@/components/ui/Charts';
```

---

## 8. Role-Based Visibility

| Element | Super Admin | Ops Manager | Finance Manager | Support |
|---------|:-----------:|:-----------:|:---------------:|:-------:|
| All KPI Cards | ✅ | ✅ | ✅ | 👁️ |
| All Charts | ✅ | ✅ | ✅ | 👁️ |
| Alerts Section | ✅ | ✅ | ✅ | 👁️ |
| Hotels Table | ✅ | ✅ | ✅ | 👁️ |

*Note: All roles have equal visibility on Dashboard. Differences emerge in navigation access.*

---

## 9. UX Intent

### Why is the Dashboard structured this way?

1. **KPIs at Top:** Most critical numbers visible immediately without scrolling
2. **Trend Charts:** Provide context for KPIs (are things improving or declining?)
3. **Alerts Prominent:** Operational issues need immediate visibility
4. **Recent Hotels:** Quick access to common data without navigating away
5. **Responsive Design:** Works on tablets for floor managers checking status on-the-go
6. **Color Coding:**
   - Emerald = Good (online, revenue, growth)
   - Rose = Bad (offline, overdue, critical)
   - Amber = Attention (warning, pending)
   - Purple/Indigo = Neutral metrics

### User Journey
1. User logs in → lands on Dashboard
2. Scans KPIs for any anomalies
3. Checks alerts for critical issues
4. Reviews kiosk status donut for fleet health
5. If action needed, clicks through to Hotels or Audit

---

## 10. Potential Improvements (Documented, Not Implemented)

> ⚠️ **Note:** These are observations, not current features.

- Hotel rows could be clickable to navigate to hotel details
- Alert items could open a detail modal or navigate to source
- KPI cards could be clickable to filter related data
- Real-time refresh button for alerts
- Customizable dashboard widgets

---

**End of Report 02**

*Awaiting user confirmation to proceed to Report 03: Hotels Module Deep-Dive.*
