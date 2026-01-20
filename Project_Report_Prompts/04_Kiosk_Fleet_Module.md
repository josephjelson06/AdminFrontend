# Kiosk Fleet Module Deep-Dive

**Report Type:** Module-Level Documentation  
**Panel:** ATC Super-Admin Panel  
**Module:** Kiosk Fleet  
**Route:** `/fleet`  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 4 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
The **Kiosk Fleet Module** is the hardware monitoring dashboard that allows ATC staff to:
- View all deployed physical kiosk devices across all hotels
- Monitor real-time connectivity status (Online/Offline/Warning)
- Filter and search kiosks by serial number, model, or assigned hotel
- Track firmware versions and last heartbeat timestamps
- Quickly identify problematic devices requiring attention

### 1.2 Who Uses It
| Role | Access Level | Primary Use |
|------|-------------|-------------|
| Super Admin | Full Access | Fleet overview, issue identification |
| Operations Manager | Full Access | Day-to-day hardware monitoring |
| Finance Manager | No Access | Not relevant to role |
| Support Staff | View Only | Troubleshooting support |

### 1.3 Position in Application
- **Sidebar Location:** Operations → Kiosk Fleet (third item)
- **Route:** `/fleet`
- **Entry Points:** Sidebar navigation

---

## 2. Page Layout & Structure

### 2.1 Visual Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Kiosk Fleet" | "Manage and monitor all deployed kiosks"        │
│                        [🟢 X online] [🔴 X offline]  [⟳ Refresh] │
├──────────────────────────────────────────────────────────────────┤
│  Filters Bar                                                      │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ [🔍 Search...]   [Status: ▼]         [Model: ▼]              ││
│  │ Showing X of X kiosks                    [Clear all filters] ││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  Kiosk Grid (3 columns)                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                          │
│  │ [Card]   │ │ [Card]   │ │ [Card]   │                          │
│  │ Serial   │ │ Serial   │ │ Serial   │                          │
│  │ Status   │ │ Status   │ │ Status   │                          │
│  └──────────┘ └──────────┘ └──────────┘                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                          │
│  │ [Card]   │ │ [Card]   │ │ [Card]   │                          │
│  └──────────┘ └──────────┘ └──────────┘                          │
├──────────────────────────────────────────────────────────────────┤
│  Pagination                                                       │
│  [< Prev]  Page 1 of 2  [Next >]                                 │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Responsive Behavior
| Breakpoint | Behavior |
|------------|----------|
| Desktop (lg+) | 3-column kiosk grid |
| Tablet (md) | 2-column kiosk grid |
| Mobile (sm) | 1-column kiosk grid, stacked filters |

---

## 3. Component Breakdown

### 3.1 Page Header

| Element | Description |
|---------|-------------|
| **Title** | "Kiosk Fleet" |
| **Subtitle** | "Manage and monitor all deployed kiosks" |
| **Online Count** | Wifi icon + "{X} online" (emerald text) |
| **Offline Count** | WifiOff icon + "{X} offline" (rose text) |
| **Refresh Button** | RefreshCw icon + "Refresh" (secondary button) |

---

### 3.2 Filters Bar

#### Container
| Property | Value |
|----------|-------|
| **Background** | White with slate border |
| **Padding** | p-4 |
| **Layout** | Flex with justify-between |

#### Filter Components

##### Search Filter
| Property | Value |
|----------|-------|
| **Component** | `SearchFilter` from `@/components/ui/Filters` |
| **Placeholder** | "Search serial, model, hotel..." |
| **Icon** | Search (Lucide) |
| **Behavior** | Filters as user types, resets pagination to page 1 |
| **Matches** | Serial number, model name, hotel name |

##### Status Filter
| Property | Value |
|----------|-------|
| **Component** | `FilterChips` from `@/components/ui/Filters` |
| **Label** | "Status" |
| **Options** | Online (with count), Offline (with count), Warning (with count) |
| **Selection** | Multi-select (toggleable chips) |
| **Behavior** | Filters kiosks by status, resets pagination |

##### Model Filter
| Property | Value |
|----------|-------|
| **Component** | `FilterChips` from `@/components/ui/Filters` |
| **Label** | "Model" |
| **Options** | Dynamically computed from unique models in `MOCK_KIOSKS` |
| **Selection** | Multi-select (toggleable chips) |
| **Behavior** | Filters kiosks by model, resets pagination |

#### Filter Summary Row
| Condition | Display |
|-----------|---------|
| Has active filters | "Showing {X} of {X} kiosks" + "Clear all filters" link |
| No active filters | Hidden |

---

### 3.3 Kiosk Card Grid

#### Grid Layout
| Property | Value |
|----------|-------|
| **Columns** | 3 on desktop (grid-cols-3) |
| **Gap** | gap-4 |
| **Items per page** | 6 (ITEMS_PER_PAGE constant) |

#### Individual Kiosk Card
```
┌───────────────────────────────────────────┐
│  [Status Icon]              [Status Badge]│
│  (emerald/rose/amber bg)    (colored pill)│
├───────────────────────────────────────────┤
│  🖥️ {Serial Number}                       │
│  {Model Name}                              │
├───────────────────────────────────────────┤
│  📍 {Hotel Name}              (if assigned)│
│  (slate-50 background chip)               │
├───────────────────────────────────────────┤
│  🕐 {Last Heartbeat}         v{Firmware}  │
└───────────────────────────────────────────┘
```

#### Card Component Details

##### Status Icon (Top Left)
| Status | Icon | Background | Color |
|--------|------|------------|-------|
| online | Wifi | bg-emerald-100 | text-emerald-600 |
| offline | WifiOff | bg-rose-100 | text-rose-600 |
| warning | AlertTriangle | bg-amber-100 | text-amber-600 |

##### Status Badge (Top Right)
| Status | Background | Text Color |
|--------|------------|------------|
| online | bg-emerald-100 | text-emerald-700 |
| offline | bg-rose-100 | text-rose-700 |
| warning | bg-amber-100 | text-amber-700 |

##### Card Content
| Element | Description |
|---------|-------------|
| **Serial Number** | Cpu icon + font-semibold text |
| **Model** | Smaller slate text |
| **Hotel Name** | Only shown if assigned, in slate-50 chip with 📍 |
| **Last Heartbeat** | Clock icon + relative/absolute time |
| **Firmware Version** | Monospace font, slate-400 color |

##### Card Interactivity
| Interaction | Behavior |
|-------------|----------|
| Hover | Shadow elevation (hover:shadow-md) |
| Click | No action in current build |

---

### 3.4 Empty State

| Condition | Display |
|-----------|---------|
| No kiosks match filters | Centered Search icon + "No kiosks found" + "Try adjusting your search or filters" |

---

### 3.5 Pagination Component

| Property | Value |
|----------|-------|
| **Component** | `Pagination` from `@/components/ui/Pagination` |
| **Location** | Bottom of page |
| **Container** | White with slate border |

#### Pagination Props
| Prop | Value |
|------|-------|
| currentPage | State variable |
| totalPages | Computed from filtered results |
| totalItems | Filtered kiosk count |
| itemsPerPage | 6 |
| onPageChange | Updates currentPage state |

---

## 4. Button & Action Mapping

### 4.1 Header Actions

| Button | Type | Icon | Click Behavior |
|--------|------|------|----------------|
| Refresh | Secondary | RefreshCw | Currently no-op (placeholder for API refresh) |

### 4.2 Filter Actions

| Element | Type | Behavior |
|---------|------|----------|
| Search input | Text field | Filters on change, debounced |
| Status chips | Toggle buttons | Add/remove from filter array |
| Model chips | Toggle buttons | Add/remove from filter array |
| Clear all filters | Text link | Resets all filters + search + pagination |

### 4.3 Pagination Actions

| Button | Condition | Behavior |
|--------|-----------|----------|
| Previous | currentPage > 1 | Decrement page |
| Next | currentPage < totalPages | Increment page |
| Page numbers | Always | Jump to specific page |

---

## 5. State Management

### 5.1 Component State
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<string[]>([]);
const [modelFilter, setModelFilter] = useState<string[]>([]);
const [currentPage, setCurrentPage] = useState(1);
```

### 5.2 Computed Values
| Variable | Computation |
|----------|-------------|
| `models` | Unique model names from `MOCK_KIOSKS` with counts |
| `statusOptions` | Status options with dynamic counts |
| `filteredKiosks` | Kiosks matching all active filters |
| `totalPages` | `Math.ceil(filteredKiosks.length / ITEMS_PER_PAGE)` |
| `paginatedKiosks` | Slice of filtered kiosks for current page |
| `hasActiveFilters` | Boolean for showing filter summary |

### 5.3 Filter Logic
Kiosks are included if:
1. **Search Match:** Serial number, model, OR hotel name contains query (case-insensitive)
2. **Status Match:** No status filter selected OR status is in filter array
3. **Model Match:** No model filter selected OR model is in filter array

All conditions must be true (AND logic).

---

## 6. Data Dependencies

### 6.1 Type Definitions
```typescript
interface Kiosk {
    id: string;
    serialNumber: string;
    model: string;
    status: KioskStatus;        // 'online' | 'offline' | 'warning'
    assignedHotelId: string | null;
    lastHeartbeat: string;
    firmwareVersion: string;
}

type KioskStatus = 'online' | 'offline' | 'warning';
```

### 6.2 Mock Data Sources
| Source | Location | Purpose |
|--------|----------|---------|
| `MOCK_KIOSKS` | `lib/mock-data.ts` | Array of kiosk objects |
| `MOCK_HOTELS` | `lib/mock-data.ts` | For resolving hotel names from IDs |

---

## 7. Helper Components

### 7.1 StatusIcon Component
| Purpose | Render status-specific icon with colored background |
| Props | `status: KioskStatus` |
| Output | Rounded icon container with appropriate icon and colors |

### 7.2 StatusBadge Component
| Purpose | Render colored pill badge with status text |
| Props | `status: KioskStatus` |
| Output | Rounded badge with capitalized status label |

### 7.3 FilterChips Component (Shared)
| Purpose | Render multi-select filter with count badges |
| Props | `label, options, selected, onChange` |
| Features | Shows count per option, handles multi-select |

### 7.4 SearchFilter Component (Shared)
| Purpose | Search input with icon |
| Props | `value, onChange, placeholder` |
| Features | Controlled input with Search icon |

### 7.5 Pagination Component (Shared)
| Purpose | Page navigation with page numbers |
| Props | `currentPage, totalPages, totalItems, itemsPerPage, onPageChange` |
| Features | Prev/Next buttons, page number display |

---

## 8. Imports & Dependencies

### 8.1 External Dependencies
```typescript
import { useState, useMemo } from 'react';
import { Cpu, Wifi, WifiOff, AlertTriangle, Clock, RefreshCw, Search } from 'lucide-react';
```

### 8.2 Internal Dependencies
```typescript
import { MOCK_KIOSKS, MOCK_HOTELS } from '@/lib/mock-data';
import type { KioskStatus } from '@/types/schema';
import { FilterChips, SearchFilter } from '@/components/ui/Filters';
import { Pagination } from '@/components/ui/Pagination';
```

---

## 9. Role-Based Visibility

| Element | Super Admin | Ops Manager | Support |
|---------|:-----------:|:-----------:|:-------:|
| View fleet page | ✅ | ✅ | 👁️ |
| Search & filter | ✅ | ✅ | 👁️ |
| Refresh button | ✅ | ✅ | 👁️ |
| Kiosk cards | ✅ | ✅ | 👁️ |

*Note: All roles with access have identical functionality. No role-specific restrictions within this module.*

---

## 10. Navigation Flow

### 10.1 Entry Points
| From | Action | Result |
|------|--------|--------|
| Sidebar | Click "Kiosk Fleet" | Navigate to `/fleet` |

### 10.2 Exit Points
| From | Action | Result |
|------|--------|--------|
| Fleet page | Click sidebar item | Navigate elsewhere |
| Fleet page | (Future) Click kiosk card | Could navigate to kiosk detail |

---

## 11. UX Intent

### Why is the Fleet module structured this way?

1. **Card Grid vs Table**
   - Visual status indicators are more impactful in card format
   - Status icons with color provide instant health assessment
   - Less data per item suits card layout

2. **Prominent Status Counts in Header**
   - Immediate answer to "how many kiosks are down?"
   - Color-coded for quick scanning

3. **Multi-Filter Support**
   - Operations may need to find "all offline ATC-K200 kiosks"
   - Chip-based filters show active selections clearly

4. **Pagination Over Infinite Scroll**
   - Predictable data size for operational context
   - Easy to reference "page 2" in team communication

5. **Hotel Association Display**
   - Critical context: which hotel is affected by an offline kiosk?
   - Shown inline without needing to click through

6. **Firmware Version Visible**
   - Helps identify outdated devices needing updates
   - Monospace styling for technical precision

---

## 12. Potential Improvements (Documented, Not Implemented)

> ⚠️ **Note:** These are observations, not current features.

- Kiosk cards could be clickable to open detail modal
- Bulk actions (select multiple → restart, update firmware)
- Sort by last heartbeat to find oldest offline devices
- Real-time status updates via WebSocket
- Map view showing geographic distribution
- Firmware update push functionality

---

## 13. Component File Summary

| Component | File Path | Size | Purpose |
|-----------|-----------|------|---------|
| Fleet Page | `app/fleet/page.tsx` | ~11KB | Main grid view with filters |
| FilterChips | `components/ui/Filters.tsx` | Shared | Multi-select filter chips |
| SearchFilter | `components/ui/Filters.tsx` | Shared | Search input component |
| Pagination | `components/ui/Pagination.tsx` | Shared | Page navigation |

---

**End of Report 04**

*Awaiting user confirmation to proceed to Report 05: Finance & Subscriptions Module Deep-Dive.*
