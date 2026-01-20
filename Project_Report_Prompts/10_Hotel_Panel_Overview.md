# Hotel Panel Overview

**Report Type:** Panel-Level Documentation  
**Panel:** Hotel Panel  
**Base Route:** `/hotel`  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 10 of Documentation Series

---

## 1. Executive Summary

The **Hotel Panel** is a tenant-facing application designed for individual hotel staff to manage their day-to-day operations. Unlike the Super-Admin Panel which manages ALL hotels, the Hotel Panel shows only the data and features relevant to a single hotel property.

### Key Characteristics
- **Audience:** Hotel staff (managers, front desk, housekeeping, finance)
- **Scope:** Single hotel, real-time operational focus
- **Design:** Mobile-first, touch-optimized for kiosk-like usage
- **Access:** Role-based with 4 distinct hotel roles

---

## 2. Technical Stack

| Component | Technology |
|-----------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Components** | Shadcn/UI-inspired, custom |
| **Layout** | `HotelLayout` component |
| **Sidebar** | `HotelSidebar` component |
| **Theme** | Light/Dark mode with indigo accent |

---

## 3. Layout Architecture

### 3.1 HotelLayout Component
```
┌────────────────────────────────────────────────────────────────────┐
│ HotelLayout                                                         │
├─────────────┬──────────────────────────────────────────────────────┤
│ HotelSidebar│ {children} - Page Content                            │
│ (Fixed Left)│                                                       │
│             │ ┌──────────────────────────────────────────────────┐ │
│ ┌─────────┐ │ │ Page-specific content rendered here              │ │
│ │Hotel    │ │ │                                                  │ │
│ │Name     │ │ │                                                  │ │
│ ├─────────┤ │ │                                                  │ │
│ │Dashboard│ │ │                                                  │ │
│ │Guests   │ │ │                                                  │ │
│ │Rooms    │ │ └──────────────────────────────────────────────────┘ │
│ │Kiosk    │ │                                                       │
│ │Team     │ │                                                       │
│ │Billing  │ │                                                       │
│ │Settings │ │                                                       │
│ ├─────────┤ │                                                       │
│ │User     │ │                                                       │
│ │Logout   │ │                                                       │
│ └─────────┘ │                                                       │
└─────────────┴──────────────────────────────────────────────────────┘
```

### 3.2 HotelSidebar Navigation Groups
| Group | Pages | Visibility |
|-------|-------|------------|
| **Operations** | Dashboard, Guest Log, Rooms | All roles |
| **Configuration** | Kiosk Settings, Team Access | Manager, Kiosk Manager |
| **Account** | Billing, My Hotel | Manager, Finance |

---

## 4. Module Inventory

| Module | Route | Purpose | Primary Role |
|--------|-------|---------|--------------|
| Dashboard | `/hotel` | KPIs, kiosk health, activity feed | All |
| Guests | `/hotel/guests` | Check-in history, verification status | Front Desk, Manager |
| Rooms | `/hotel/rooms` | Room status board for housekeeping | All |
| Kiosk | `/hotel/kiosk` | Kiosk appearance/language settings | Manager, Kiosk Mgr |
| Team | `/hotel/team` | Staff account management | Manager |
| Billing | `/hotel/billing` | Plan info, invoice history | Manager, Finance |
| Settings | `/hotel/settings` | Hotel profile editing | Manager |

---

## 5. Hotel Roles & Access Matrix

### 5.1 Available Roles
| Role ID | Label | Description |
|---------|-------|-------------|
| hotel_manager | Hotel Manager | Full access to all features |
| front_desk | Front Desk | Dashboard, Guests, Rooms |
| housekeeping | Housekeeping | Room status only |
| hotel_finance | Finance | Dashboard, Billing |

### 5.2 Page Access Matrix
| Page | Manager | Front Desk | Housekeeping | Finance |
|------|:-------:|:----------:|:------------:|:-------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Guests | ✅ | ✅ | ❌ | ❌ |
| Rooms | ✅ | ✅ | ✅ | ❌ |
| Kiosk Settings | ✅ | ❌ | ❌ | ❌ |
| Team Access | ✅ | ❌ | ❌ | ❌ |
| Billing | ✅ | ❌ | ❌ | ✅ |
| My Hotel | ✅ | ❌ | ❌ | ❌ |

---

## 6. Module Summaries

### 6.1 Dashboard (`/hotel`)
**Purpose:** Quick overview of today's operations

| Component | Content |
|-----------|---------|
| KPI Cards (4) | Check-ins Today, Rooms Assigned, Kiosks Online, Failed Verifications |
| Kiosk Health | Live status cards for each kiosk |
| Recent Activity | Feed of recent check-ins |

---

### 6.2 Guest Log (`/hotel/guests`)
**Purpose:** View check-in history from kiosks

| Component | Content |
|-----------|---------|
| Quick Stats | Total, Verified, Manual, Failed counts |
| Filter Bar | Search, Date filter, Status filter |
| Guest Table | Name, Booking ID, Room, Time, Language, Status |
| Guest Detail Modal | Full guest info, verification status, kiosk used |

**Key Features:**
- Filter by verification status (verified/manual/failed)
- Search by name, booking ID, or room number
- CSV export functionality
- Mobile-optimized card view

---

### 6.3 Room Status (`/hotel/rooms`)
**Purpose:** Housekeeping room status board

| Component | Content |
|-----------|---------|
| Status Summary | Ready, Cleaning, Occupied, Dirty counts |
| Filter Bar | Floor selector, Status filter chips |
| Room Grid | Tap-to-cycle status cards |
| Room Detail Modal | Status change buttons |

**Key Features:**
- **Tap to Cycle:** Dirty → Cleaning → Ready
- **Status Colors:** Emerald (Ready), Amber (Cleaning), Blue (Occupied), Rose (Dirty)
- **Confirmation:** Required when marking as Ready
- Occupied rooms cannot be manually changed

---

### 6.4 Kiosk Settings (`/hotel/kiosk`)
**Purpose:** Customize kiosk appearance and languages

| Component | Content |
|-----------|---------|
| Logo Upload | Drag/drop hotel logo |
| Welcome Message | Customizable greeting |
| Language Selection | Enable/disable languages (plan-limited) |
| Preview Modal | Live kiosk screen preview |

**Key Features:**
- Language limit based on plan (Standard: 2, Advanced: 4, Enterprise: 8)
- Real-time preview of kiosk screen
- Save confirmation with immediate apply

---

### 6.5 Team Access (`/hotel/team`)
**Purpose:** Manage hotel staff accounts

| Component | Content |
|-----------|---------|
| Team Table | Name, Contact, Role, Last Login, Actions |
| Add Member Modal | Form with role selection grid |
| Role Legend | Permission summary for each role |

**Key Features:**
- Add team members via email invitation
- Edit and remove team members
- 4 role options with visual descriptions
- Role-based access preview

---

### 6.6 Subscription & Billing (`/hotel/billing`)
**Purpose:** View plan details and invoices

| Component | Content |
|-----------|---------|
| Plan Card | Current plan, expiry, features |
| Plan Stats | Rooms, Kiosks, Monthly Fee, Valid Until |
| Invoice Table | History with download |
| Invoice Modal | Detailed invoice view |

**Key Features:**
- Plan feature badges (Standard, Advanced, Enterprise)
- Days until renewal countdown
- PDF invoice download
- Contact Sales for upgrades

---

### 6.7 My Hotel (`/hotel/settings`)
**Purpose:** Edit hotel profile information

| Component | Content |
|-----------|---------|
| Property Overview | Gradient card with stats |
| Hotel Information | Name, Address, City, State, PIN |
| Contact Information | Phone, Email |
| Unsaved Changes Banner | Reminder to save |

**Key Features:**
- Editable profile fields
- Save confirmation modal
- Overview of plan and kiosk allocation

---

## 7. Shared Components (Hotel Panel Specific)

### 7.1 HotelLayout
| Location | `components/layout/HotelLayout.tsx` |
| Props | children |
| Purpose | Wraps all hotel pages with sidebar |

### 7.2 HotelSidebar
| Location | `components/layout/HotelSidebar.tsx` |
| Purpose | Navigation for hotel pages |
| Features | Role-based filtering, logout |

### 7.3 Verification Badge
| Location | `app/hotel/guests/page.tsx` (inline) |
| Purpose | Verified/Manual/Failed status |
| Colors | Emerald/Amber/Rose |

### 7.4 Room Card
| Location | `app/hotel/rooms/page.tsx` (inline) |
| Purpose | Interactive room status card |
| Features | Tap-to-cycle, animations |

### 7.5 Status Badge
| Location | Various pages |
| Purpose | Payment/verification status |

---

## 8. Data Dependencies

### 8.1 Mock Data Sources
| Source | Location | Purpose |
|--------|----------|---------|
| `MOCK_HOTEL_PROFILE` | `lib/hotel-data.ts` | Current hotel info |
| `MOCK_GUEST_CHECKINS` | `lib/hotel-data.ts` | Check-in records |
| `MOCK_ROOMS` | `lib/hotel-data.ts` | Room inventory |
| `MOCK_KIOSK_CONFIG` | `lib/hotel-data.ts` | Kiosk settings |
| `MOCK_HOTEL_TEAM` | `lib/hotel-data.ts` | Staff accounts |
| `MOCK_INVOICES` | `lib/hotel-data.ts` | Billing history |
| `AVAILABLE_LANGUAGES` | `lib/hotel-data.ts` | Language options |

### 8.2 Key Type Definitions
```typescript
interface GuestCheckIn {
    id: string;
    guestName: string;
    bookingId: string;
    roomNumber: string;
    checkInTime: string;
    language: string;
    verification: 'verified' | 'manual' | 'failed';
    kioskId: string;
}

interface Room {
    id: string;
    number: string;
    floor: number;
    type: 'standard' | 'deluxe' | 'suite';
    status: 'ready' | 'cleaning' | 'occupied' | 'dirty';
    lastUpdated: string;
}

interface HotelUser {
    id: string;
    name: string;
    email: string;
    role: HotelUserRole;
    hotelId: string;
    phone?: string;
    status: 'active' | 'inactive';
    lastLogin?: string;
}
```

---

## 9. Design Philosophy

### 9.1 Hospitality-First UX
- **Touch-optimized:** Large tap targets for kiosk/tablet use
- **Quick glances:** Status at a glance with color coding
- **Minimal clicks:** One-tap status changes

### 9.2 Color Coding Convention
| Color | Meaning | Usage |
|-------|---------|-------|
| Emerald | Success/Ready | Verified, Room Ready |
| Amber | Warning/Pending | Manual verification, Cleaning |
| Rose | Error/Attention | Failed, Dirty |
| Blue | Occupied/Info | Occupied rooms |
| Indigo | Primary/Brand | Buttons, accents |

### 9.3 Animation Patterns
- Page enter: `fade-in slide-in-from-bottom-2`
- Modal enter: `zoom-in-95 slide-in-from-bottom-4`
- Status change: Scale bounce animation
- Loading: Spinner overlays

---

## 10. Navigation Flow

### 10.1 Entry Points
| From | To | Method |
|------|-----|--------|
| Login | `/hotel` | Authentication redirect |
| Super-Admin | `/hotel` | Hotel detail link (future) |

### 10.2 Internal Navigation
| From | To | Trigger |
|------|-----|---------|
| Any page | Any page | Sidebar click |
| Guest table | Guest detail | Row click |
| Room grid | Room detail | Card click |
| Invoice table | Invoice detail | Row click |

### 10.3 Exit Points
| From | To | Trigger |
|------|-----|---------|
| Any page | Login | Logout button |

---

## 11. Component File Summary

| Page | File Path | Size | Key Features |
|------|-----------|------|--------------|
| Dashboard | `app/hotel/page.tsx` | ~17KB | KPIs, Kiosk health, Activity |
| Guests | `app/hotel/guests/page.tsx` | ~25KB | Table, filters, detail modal |
| Rooms | `app/hotel/rooms/page.tsx` | ~21KB | Grid, tap-to-cycle, modal |
| Kiosk | `app/hotel/kiosk/page.tsx` | ~22KB | Upload, languages, preview |
| Team | `app/hotel/team/page.tsx` | ~26KB | Table, add modal, roles |
| Billing | `app/hotel/billing/page.tsx` | ~20KB | Plan card, invoices, modal |
| Settings | `app/hotel/settings/page.tsx` | ~17KB | Profile form, overview |

---

## 12. Potential Improvements (Documented, Not Implemented)

> ⚠️ **Note:** These are observations, not current features.

- Real-time kiosk status via WebSockets
- Push notifications for check-in alerts
- Guest pre-arrival details
- Room service requests
- Multi-property support for chains
- Offline mode for housekeeping
- Analytics and reporting dashboard
- Integration with PMS systems

---

**End of Report 10**

*Awaiting user confirmation to proceed to Report 11: Hotel Panel Dashboard Module Deep-Dive (optional, as overview covers all modules).*
