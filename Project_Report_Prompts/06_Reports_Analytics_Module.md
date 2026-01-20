# Reports & Analytics Module Deep-Dive

**Report Type:** Module-Level Documentation  
**Panel:** ATC Super-Admin Panel  
**Module:** Reports & Analytics  
**Route:** `/reports`  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 6 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
The **Reports & Analytics Module** is the business intelligence hub that provides:
- Check-in volume trends and AI session tracking
- Geographic distribution of kiosks across India
- Language usage analytics for regional insights
- Top-performing hotel identification
- State-wise performance breakdowns
- Exportable data for external reporting

### 1.2 Who Uses It
| Role | Access Level | Primary Use |
|------|-------------|-------------|
| Super Admin | Full Access | Strategic overview, export data |
| Operations Manager | Full Access | Performance monitoring |
| Finance Manager | Full Access | Revenue correlation analysis |
| Support Staff | View Only | Reference data |

### 1.3 Position in Application
- **Sidebar Location:** Business & Finance → Reports (third item)
- **Route:** `/reports`
- **Entry Points:** Sidebar navigation

---

## 2. Page Layout & Structure

### 2.1 Visual Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Reports & Analytics" | "Business intelligence and usage insights│
│                                  [📅 Last 6 months] [↓ Export CSV]│
├──────────────────────────────────────────────────────────────────┤
│  KPI Summary (4 columns)                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ Total    │ │ Deployed │ │ Avg Self │ │ Non-     │             │
│  │ Check-ins│ │ Kiosks   │ │ Check-in │ │ English  │             │
│  │ 13,120   │ │ 52       │ │ Rate 74% │ │ Usage 72%│             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
├──────────────────────────────────────────────────────────────────┤
│  Charts Row 1 (2 columns)                                         │
│  ┌───────────────────────────┐ ┌───────────────────────────────┐ │
│  │ Check-ins & AI Sessions   │ │ Weekly Check-in Pattern       │ │
│  │ (Line Chart)              │ │ (Area Chart)                   │ │
│  └───────────────────────────┘ └───────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  Charts Row 2 (3 columns)                                         │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────────────┐│
│  │ Language       │ │ Geographic     │ │ Top Performing         ││
│  │ Distribution   │ │ Coverage       │ │ Hotels                 ││
│  │ (Donut)        │ │ (India Map)    │ │ (Bar Chart)            ││
│  └────────────────┘ └────────────────┘ └────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  State-wise Performance Table                                     │
│  State | Kiosks | Check-ins | Avg/Kiosk                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

### 3.1 Page Header

| Element | Description |
|---------|-------------|
| **Title** | "Reports & Analytics" |
| **Subtitle** | "Business intelligence and usage insights" |
| **Date Range Chip** | Calendar icon + "Last 6 months" (display only) |
| **Export Button** | Primary button with Download icon + "Export CSV" |

---

### 3.2 KPI Summary Cards (4 cards)

#### 3.2.1 Total Check-ins Card
| Property | Value |
|----------|-------|
| **Label** | "Total Check-ins" |
| **Value** | Sum of all check-in data (formatted with commas) |
| **Color** | slate-900 |
| **Trend** | "+23% vs prev period" (emerald with TrendingUp icon) |

#### 3.2.2 Deployed Kiosks Card
| Property | Value |
|----------|-------|
| **Label** | "Deployed Kiosks" |
| **Value** | Sum of kiosks from state data |
| **Color** | emerald-600 |
| **Subtitle** | "Across {X} states" |

#### 3.2.3 Avg Self Check-in Rate Card
| Property | Value |
|----------|-------|
| **Label** | "Avg Self Check-in Rate" |
| **Value** | "74%" (static in mock) |
| **Color** | slate-900 |
| **Subtitle** | "Guests using kiosk vs front desk" |

#### 3.2.4 Non-English Usage Card
| Property | Value |
|----------|-------|
| **Label** | "Non-English Usage" |
| **Value** | "72%" (static in mock) |
| **Color** | purple-600 |
| **Subtitle** | "Regional language interactions" |

---

### 3.3 Charts Row 1

#### 3.3.1 Check-ins & AI Sessions Chart
| Property | Value |
|----------|-------|
| **Component** | `LineChartComponent` |
| **Title** | "Check-ins & AI Sessions" |
| **Icon** | BarChart3 |
| **Height** | 220px |
| **Lines** | 2 lines (Check-ins in emerald, AI Sessions in indigo) |
| **X-Axis** | Month names (Aug-Jan) |
| **Data Source** | `MOCK_CHECKIN_DATA` |

#### 3.3.2 Weekly Check-in Pattern Chart
| Property | Value |
|----------|-------|
| **Component** | `AreaChartComponent` |
| **Title** | "Weekly Check-in Pattern" |
| **Icon** | TrendingUp |
| **Height** | 220px |
| **Color** | #f59e0b (Amber) |
| **Fill** | Gradient |
| **X-Axis** | Day names (Mon-Sun) |
| **Data Source** | `DAILY_DATA` |

---

### 3.4 Charts Row 2

#### 3.4.1 Language Distribution Chart
| Property | Value |
|----------|-------|
| **Component** | `DonutChartComponent` |
| **Title** | "Language Distribution" |
| **Icon** | Languages |
| **Height** | 200px |
| **Data Source** | `MOCK_LANGUAGE_DATA` |
| **Legend** | Grid of 6 languages with color dots |

##### Language Data
| Language | Percentage |
|----------|------------|
| Hindi | 42% |
| English | 28% |
| Tamil | 12% |
| Telugu | 8% |
| Bengali | 6% |
| Others | 4% |

#### 3.4.2 Geographic Coverage Chart
| Property | Value |
|----------|-------|
| **Component** | `IndiaHeatmap` |
| **Title** | "Geographic Coverage" |
| **Icon** | MapPin |
| **Data Source** | `MOCK_STATE_DATA` |
| **Visual** | India map with state-level heat colors |

#### 3.4.3 Top Performing Hotels Chart
| Property | Value |
|----------|-------|
| **Component** | `BarChartComponent` |
| **Title** | "Top Performing Hotels" |
| **Icon** | Building2 |
| **Height** | 180px |
| **Color** | #6366f1 (Indigo) |
| **Data** | Hotel names (first word) with check-in counts |
| **Data Source** | `MOCK_TOP_HOTELS` |

---

### 3.5 State-wise Performance Table

| Property | Value |
|----------|-------|
| **Title** | "State-wise Performance" |
| **Icon** | Globe |
| **Data Limit** | First 6 states from `MOCK_STATE_DATA` |

#### Table Columns
| Column | Header | Content | Alignment |
|--------|--------|---------|-----------|
| State | "STATE" | State name | Left |
| Kiosks | "KIOSKS" | Kiosk count | Right |
| Check-ins | "CHECK-INS" | Total check-ins (emerald, formatted) | Right |
| Avg/Kiosk | "AVG/KIOSK" | Calculated average | Right |

---

## 4. Button & Action Mapping

### 4.1 Header Actions

| Button | Type | Icon | Click Behavior |
|--------|------|------|----------------|
| Export CSV | Primary | Download | Calls `handleExport()` function |

### 4.2 Export Functionality

```typescript
const handleExport = () => {
    const exportData = MOCK_TOP_HOTELS.map((hotel) => ({
        hotel_name: hotel.name,
        checkins: hotel.checkins,
        self_checkin_rate: `${hotel.selfCheckInRate}%`,
    }));

    exportToCSV(exportData, 'atc_reports_export', [
        { key: 'hotel_name', label: 'Hotel Name' },
        { key: 'checkins', label: 'Total Check-ins' },
        { key: 'self_checkin_rate', label: 'Self Check-in Rate' },
    ]);

    addToast('success', 'Export Complete', 'Reports data downloaded as CSV');
};
```

#### Export Output
| Column | Header Label | Data |
|--------|--------------|------|
| hotel_name | "Hotel Name" | Hotel name string |
| checkins | "Total Check-ins" | Check-in count |
| self_checkin_rate | "Self Check-in Rate" | Percentage string |

---

## 5. Data Dependencies

### 5.1 Mock Data Structures

#### MOCK_CHECKIN_DATA (6-month trend)
```typescript
{ name: 'Aug', checkins: 1240, aiSessions: 890 },
{ name: 'Sep', checkins: 1580, aiSessions: 1120 },
// ... through January
```

#### MOCK_LANGUAGE_DATA
```typescript
{ name: 'Hindi', value: 42 },
{ name: 'English', value: 28 },
// ... 6 languages total
```

#### MOCK_TOP_HOTELS
```typescript
{ name: 'Royal Orchid Bangalore', checkins: 1250, selfCheckInRate: 78 },
// ... 4 hotels total
```

#### MOCK_STATE_DATA
```typescript
{ id: 'KA', name: 'Karnataka', kiosks: 12, checkins: 2450 },
// ... 12 states total
```

#### DAILY_DATA (weekly pattern)
```typescript
{ name: 'Mon', value: 145 },
// ... through Sunday
```

### 5.2 Computed Values
| Variable | Computation |
|----------|-------------|
| `totalCheckins` | Sum of all monthly check-ins |
| `totalKiosks` | Sum of kiosks from all states |

---

## 6. Chart Components

### 6.1 LineChartComponent
| Location | `components/ui/Charts.tsx` |
| Purpose | Multi-line trend visualization |
| Props | `data, lines[], height` |
| Features | Multiple colored lines, tooltips, responsive |

### 6.2 AreaChartComponent
| Location | `components/ui/Charts.tsx` |
| Purpose | Area chart with gradient fill |
| Props | `data, dataKey, color, height, gradientId` |
| Features | Gradient fill, smooth curve, tooltips |

### 6.3 BarChartComponent
| Location | `components/ui/Charts.tsx` |
| Purpose | Vertical bar visualization |
| Props | `data, dataKey, color, height` |
| Features | Colored bars, tooltips, responsive |

### 6.4 DonutChartComponent
| Location | `components/ui/Charts.tsx` |
| Purpose | Proportional distribution display |
| Props | `data, height` |
| Features | Multi-color segments, center hole, tooltips |

### 6.5 IndiaHeatmap
| Location | `components/ui/IndiaHeatmap.tsx` |
| Purpose | Geographic visualization of India |
| Props | `data` (state-level data) |
| Features | State-level coloring, hover effects, legend |

---

## 7. Imports & Dependencies

### 7.1 External Dependencies
```typescript
import { BarChart3, Globe, Languages, TrendingUp, Download, Calendar, Building2, MapPin } from 'lucide-react';
```

### 7.2 Internal Dependencies
```typescript
import { useToast } from '@/components/ui/Toast';
import { exportToCSV } from '@/lib/export';
import { IndiaHeatmap } from '@/components/ui/IndiaHeatmap';
import { AreaChartComponent, BarChartComponent, DonutChartComponent, LineChartComponent } from '@/components/ui/Charts';
```

---

## 8. Role-Based Visibility

| Element | Super Admin | Ops Manager | Finance Manager | Support |
|---------|:-----------:|:-----------:|:---------------:|:-------:|
| View reports page | ✅ | ✅ | ✅ | 👁️ |
| All charts | ✅ | ✅ | ✅ | 👁️ |
| Export CSV | ✅ | ✅ | ✅ | ❌ |
| State table | ✅ | ✅ | ✅ | 👁️ |

---

## 9. Navigation Flow

### 9.1 Entry Points
| From | Action | Result |
|------|--------|--------|
| Sidebar | Click "Reports" | Navigate to `/reports` |

### 9.2 Exit Points
| From | Action | Result |
|------|--------|--------|
| Reports page | Click sidebar item | Navigate elsewhere |
| Reports page | Export CSV | Download file (no navigation) |

---

## 10. UX Intent

### Why is the Reports module structured this way?

1. **KPIs First**
   - Four key metrics provide immediate summary
   - Trend indicators show direction

2. **Trend + Pattern Charts**
   - Line chart shows growth trajectory
   - Weekly pattern helps identify peak days

3. **Regional Focus**
   - India map highlights geographic distribution
   - Language chart shows regional engagement
   - Critical for B2B in Indian market

4. **Performance Rankings**
   - Top hotels chart for quick identification
   - State table for detailed breakdown

5. **Export Functionality**
   - Real working CSV export
   - Enables offline analysis and reporting

6. **Information Density**
   - Multiple visualizations on single page
   - Reduces need for drilling down

---

## 11. Visualization Color Scheme

| Chart Type | Primary Color | Purpose |
|------------|---------------|---------|
| Check-ins Line | Emerald (#10b981) | Positive metric |
| AI Sessions Line | Indigo (#6366f1) | Secondary metric |
| Weekly Area | Amber (#f59e0b) | Attention/focus |
| Hotels Bar | Indigo (#6366f1) | Consistent with AI |
| Language Donut | Multi-color | Differentiation |

---

## 12. Potential Improvements (Documented, Not Implemented)

> ⚠️ **Note:** These are observations, not current features.

- Date range picker for custom periods
- Drill-down from chart to detailed view
- Hotel-specific report generation
- Comparison between time periods
- Real-time data refresh
- PDF export option
- Email scheduled reports

---

## 13. Component File Summary

| Component | File Path | Size | Purpose |
|-----------|-----------|------|---------|
| Reports Page | `app/reports/page.tsx` | ~12KB | Main analytics view |
| LineChartComponent | `components/ui/Charts.tsx` | Shared | Multi-line trends |
| AreaChartComponent | `components/ui/Charts.tsx` | Shared | Area with gradient |
| BarChartComponent | `components/ui/Charts.tsx` | Shared | Vertical bars |
| DonutChartComponent | `components/ui/Charts.tsx` | Shared | Proportional display |
| IndiaHeatmap | `components/ui/IndiaHeatmap.tsx` | Dedicated | Geographic map |
| exportToCSV | `lib/export.ts` | Utility | CSV generation |

---

**End of Report 06**

*Awaiting user confirmation to proceed to Report 07: User Management Module Deep-Dive.*
