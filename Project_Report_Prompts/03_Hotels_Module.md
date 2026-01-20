# Hotels Module Deep-Dive

**Report Type:** Module-Level Documentation  
**Panel:** ATC Super-Admin Panel  
**Module:** Hotels (Hotel Registry)  
**Route:** `/hotels`, `/hotels/[id]`  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 3 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
The **Hotels Module** is the central hub for managing all client hotels registered in the ATC system. It allows:
- Viewing and managing all registered hotels
- Quick adding hotels with minimal information
- Full onboarding workflow with step-by-step wizard
- Editing hotel details
- Suspending/activating hotel services
- Viewing individual hotel details and assigned kiosks

### 1.2 Who Uses It
| Role | Access Level | Primary Use |
|------|-------------|-------------|
| Super Admin | Full Access | All CRUD operations, suspend/activate |
| Operations Manager | Full Access | Day-to-day hotel management |
| Finance Manager | No Access | (Uses Subscriptions module instead) |
| Support Staff | View Only | Review hotel information |

### 1.3 Position in Application
- **Sidebar Location:** Operations → Hotels (second item)
- **Routes:** `/hotels` (list), `/hotels/[id]` (detail)
- **Entry Points:** Sidebar, Dashboard "View all" link, Dashboard hotel table rows

---

## 2. Page Inventory

### 2.1 Hotels List Page (`/hotels`)
| Property | Value |
|----------|-------|
| **Purpose** | Display all registered hotels in data table format |
| **Layout** | Header + Actions + Data Table + Footer Summary |
| **Data Source** | `MOCK_HOTELS` array |

### 2.2 Hotel Details Page (`/hotels/[id]`)
| Property | Value |
|----------|-------|
| **Purpose** | View single hotel details with assigned kiosks |
| **Layout** | Breadcrumbs + Header Card + Kiosks Table |
| **Data Source** | Single hotel from `MOCK_HOTELS`, filtered kiosks from `MOCK_KIOSKS` |
| **404 Handling** | Uses Next.js `notFound()` for invalid IDs |

---

## 3. Hotels List Page - Component Breakdown

### 3.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Hotel Registry" | "Manage all registered hotels"               │
│                                    [+ Quick Add] [🚀 Onboard Hotel]│
├──────────────────────────────────────────────────────────────────┤
│  Data Table                                                       │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Hotel      Status    Plan     Kiosks   MRR      Renewal  Act ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ [row]      [badge]   [badge]  [count]  [₹amt]   [date]   [...││
│  │ [row]      [badge]   [badge]  [count]  [₹amt]   [date]   [...││
│  │ ...                                                          ││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  Footer Summary                                                   │
│  "Showing X of X hotels"                    "Total MRR: ₹X,XX,XXX"│
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Page Header Component
| Element | Description |
|---------|-------------|
| **Title** | "Hotel Registry" |
| **Subtitle** | "Manage all registered hotels" |
| **Hotel Count** | "{X} hotels" display |
| **Quick Add Button** | Secondary button - opens simple add modal |
| **Onboard Hotel Button** | Primary button with Rocket icon - opens full wizard |

### 3.3 Data Table Structure

#### Table Columns
| Column | Header | Content | Alignment |
|--------|--------|---------|-----------|
| Hotel | "HOTEL" | Icon + Name + Location + Email | Left |
| Status | "STATUS" | StatusBadge component | Left |
| Plan | "PLAN" | PlanBadge component | Left |
| Kiosks | "KIOSKS" | Cpu icon + count | Center |
| MRR | "MRR" | Formatted currency | Right |
| Contract Renewal | "CONTRACT RENEWAL" | Formatted date | Left |
| Actions | "ACTIONS" | View button + Dropdown menu | Center |

#### Hotel Column Details
| Element | Description |
|---------|-------------|
| **Icon** | Building2 in slate-100 rounded square |
| **Name** | Text-sm font-medium |
| **Location** | MapPin icon + city text (xs) |
| **Email** | Mail icon + email text (xs) |

### 3.4 Status Badges (Reused Component)
| Status | Background | Text Color | Border |
|--------|------------|------------|--------|
| active | emerald-100 | emerald-700 | emerald-200 |
| inactive | slate-100 | slate-600 | slate-200 |
| suspended | rose-100 | rose-700 | rose-200 |
| pending | amber-100 | amber-700 | amber-200 |
| onboarding | blue-100 | blue-700 | blue-200 |

### 3.5 Plan Badges
| Plan | Style |
|------|-------|
| standard | bg-slate-700 text-white |
| advanced | bg-gradient-to-r from-amber-500 to-amber-600 text-white |

### 3.6 Footer Summary
| Element | Description |
|---------|-------------|
| **Left Side** | "Showing {X} of {X} hotels" |
| **Right Side** | "Total MRR: {formatted sum}" in emerald-600 |

---

## 4. Button & Action Mapping

### 4.1 Header Actions

| Button | Type | Label | Icon | Click Behavior |
|--------|------|-------|------|----------------|
| Quick Add | Secondary | "+ Quick Add" | None | Opens `AddHotelModal` |
| Onboard Hotel | Primary | "Onboard Hotel" | Rocket | Opens `OnboardingWizard` |

### 4.2 Row Actions

| Button | Type | Label | Location | Click Behavior |
|--------|------|-------|----------|----------------|
| View | Secondary | "View" | Inline | Navigate to `/hotels/[id]` |
| More Actions | Icon | "..." | Inline | Opens dropdown menu |

### 4.3 Dropdown Menu Items

| Menu Item | Variant | Icon | Click Behavior |
|-----------|---------|------|----------------|
| Edit Details | Default | None | Opens `EditHotelModal` |
| Reset Admin Password | Default | None | Shows toast "Password reset email sent" |
| Suspend Service | Danger (red) | None | Opens `ConfirmModal` |

---

## 5. Modal Components

### 5.1 Add Hotel Modal (`AddHotelModal`)
| Property | Value |
|----------|-------|
| **Purpose** | Quick hotel creation with minimal fields |
| **File** | `components/modals/AddHotelModal.tsx` |
| **Size** | ~5.5KB |

#### Form Fields
| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Hotel Name | text | Yes | "e.g., Royal Orchid Bangalore" |
| Location | text | No | "City, State" |
| Contact Email | email | Yes | "ops@hotel.com" |
| Plan | select | Yes | Standard / Advanced |

#### Actions
| Button | Type | Behavior |
|--------|------|----------|
| Cancel | Secondary | Closes modal |
| Add Hotel | Primary | Validates, shows toast, closes |

---

### 5.2 Onboarding Wizard (`OnboardingWizard`)
| Property | Value |
|----------|-------|
| **Purpose** | Full hotel onboarding with 4-step guided process |
| **File** | `components/modals/OnboardingWizard.tsx` |
| **Size** | ~19KB |

#### Wizard Steps
| Step | Title | Icon | Fields |
|------|-------|------|--------|
| 1 | Basic Info | Building2 | Hotel Name*, Address, City, State |
| 2 | Contact | MapPin | Contact Person*, Email*, Phone, GSTIN |
| 3 | Plan | CreditCard | Plan Selection (cards), Contract Duration |
| 4 | Kiosks | Cpu | Kiosk Count, Summary Display |

#### Step 1: Basic Info
| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Hotel Name | text | Yes | "e.g., Royal Orchid Bangalore" |
| Address | text | No | "Street address" |
| City | text | No | "e.g., Bangalore" |
| State | text | No | "e.g., Karnataka" |

#### Step 2: Contact
| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Contact Person | text | Yes | "e.g., Rajesh Kumar" |
| Email | email | Yes | "ops@hotel.com" |
| Phone | tel | No | "+91 98765 43210" |
| GSTIN | text | No | "22AAAAA0000A1Z5" |

#### Step 3: Plan
| Element | Type | Options |
|---------|------|---------|
| Plan Selection | Card buttons | Standard (₹15,000/mo), Advanced (₹25,000/mo) |
| Contract Duration | Dropdown | 6 months, 12 months, 24 months |

#### Step 4: Kiosks + Summary
| Element | Type | Options |
|---------|------|---------|
| Kiosk Count | Dropdown | 1, 2, 3, 4, 5+ Kiosks |
| Summary | Display only | Hotel, Location, Plan, Kiosks |

#### Progress Indicator
- Horizontal stepper with icons
- Completed steps show checkmark
- Current step is highlighted (slate-900)
- Connecting lines change color on completion

#### Navigation Buttons
| Button | Location | State | Behavior |
|--------|----------|-------|----------|
| Back | Left | Disabled on step 1 | Go to previous step |
| Next | Right | Steps 1-3 | Go to next step |
| Complete Onboarding | Right | Step 4 only | Submit, show toast, close |

---

### 5.3 Edit Hotel Modal (`EditHotelModal`)
| Property | Value |
|----------|-------|
| **Purpose** | Modify existing hotel details |
| **File** | `components/modals/EditHotelModal.tsx` |
| **Size** | ~5.7KB |
| **Pre-populated** | Uses passed `hotel` prop data |

#### Form Fields
| Field | Type | Pre-filled Source |
|-------|------|------------------|
| Hotel Name | text | `hotel.name` |
| Location | text | `hotel.location` |
| Contact Email | email | `hotel.contactEmail` |
| Plan | select | `hotel.plan` |
| Status | select | `hotel.status` |

---

### 5.4 Confirm Modal (`ConfirmModal`)
| Property | Value |
|----------|-------|
| **Purpose** | Confirmation for destructive actions |
| **File** | `components/modals/ConfirmModal.tsx` |
| **Size** | ~2.3KB |

#### Props
| Prop | Type | Description |
|------|------|-------------|
| isOpen | boolean | Visibility control |
| onClose | function | Cancel callback |
| onConfirm | function | Confirm callback |
| title | string | Modal title |
| message | string | Confirmation message |
| confirmLabel | string | Confirm button text |
| variant | 'danger' | Styling (red button) |

#### Usage for Hotel Suspend
```
Title: "Suspend Hotel Service"
Message: "Are you sure you want to suspend service for {hotel.name}? 
         Their kiosks will go offline and admins will lose portal access."
Confirm Label: "Suspend Service"
Variant: "danger"
```

---

## 6. Hotel Details Page - Component Breakdown

### 6.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Breadcrumbs                                                      │
│  Hotels > {Hotel Name}                                           │
├──────────────────────────────────────────────────────────────────┤
│  Header Card                                                      │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ [Icon] {Hotel Name}  [Status] [Plan]         Monthly Revenue ││
│  │        📍 Location  ✉️ Email                      ₹XX,XXX    ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ Total Kiosks    Online    Offline    Contract Renewal        ││
│  │ {X}             {X}       {X}        {date}                  ││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  Assigned Kiosks Table                                            │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Serial Number   Model    Status    Firmware   Last Heartbeat ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ [serial]        [model]  [status]  [version]  [timestamp]    ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 Breadcrumbs Component
| Property | Value |
|----------|-------|
| **Component** | `Breadcrumbs` from `@/components/ui/Breadcrumbs` |
| **Items** | [{ label: "Hotels", href: "/hotels" }, { label: hotel.name }] |

### 6.3 Header Card
| Section | Contents |
|---------|----------|
| **Left Side** | Large icon, Hotel name, Status badge, Plan badge, Location, Email |
| **Right Side** | Monthly Revenue (large emerald number) |
| **Stats Row** | 4-column grid: Total Kiosks, Online, Offline, Contract Renewal |

### 6.4 Assigned Kiosks Table

#### Table Columns
| Column | Content | Format |
|--------|---------|--------|
| Serial Number | Cpu icon + serial | font-medium |
| Model | Model name | text |
| Status | Icon + colored text | emerald/rose/amber |
| Firmware | Version number | mono, bg-slate-100 chip |
| Last Heartbeat | Formatted timestamp | date + time |

#### Empty State
If no kiosks assigned:
- Centered text: "No kiosks assigned to this hotel yet."

---

## 7. Data Dependencies

### 7.1 Type Definitions
```typescript
interface Hotel {
    id: string;
    name: string;
    location: string;
    contactEmail: string;
    status: Status;           // 'active' | 'inactive' | 'suspended' | 'pending' | 'onboarding'
    plan: HotelPlan;          // 'standard' | 'advanced'
    kioskCount: number;
    mrr: number;
    contractRenewalDate: string;
}

type Status = 'active' | 'inactive' | 'suspended' | 'pending' | 'onboarding';
type HotelPlan = 'standard' | 'advanced';
```

### 7.2 Mock Data Source
| Source | Location | Purpose |
|--------|----------|---------|
| `MOCK_HOTELS` | `lib/mock-data.ts` | Array of hotel objects |
| `MOCK_KIOSKS` | `lib/mock-data.ts` | Array of kiosk objects (filtered by assignedHotelId) |

---

## 8. Navigation Flow

### 8.1 Entry Points
| From | Action | Result |
|------|--------|--------|
| Sidebar | Click "Hotels" | Navigate to `/hotels` |
| Dashboard | Click "View all" on hotels table | Navigate to `/hotels` |
| Dashboard | (Future) Click hotel row | Navigate to `/hotels/[id]` |

### 8.2 Exit Points
| From | Action | Result |
|------|--------|--------|
| Hotels list | Click "View" button | Navigate to `/hotels/[id]` |
| Hotel details | Click breadcrumb "Hotels" | Navigate to `/hotels` |
| Hotels list | Click sidebar item | Navigate elsewhere |

---

## 9. Role-Based Visibility

| Element | Super Admin | Ops Manager | Support |
|---------|:-----------:|:-----------:|:-------:|
| View hotel list | ✅ | ✅ | 👁️ |
| View hotel details | ✅ | ✅ | 👁️ |
| Quick Add button | ✅ | ✅ | ❌ |
| Onboard Hotel button | ✅ | ✅ | ❌ |
| Edit Details action | ✅ | ✅ | ❌ |
| Reset Password action | ✅ | ✅ | ❌ |
| Suspend Service action | ✅ | ✅ | ❌ |

---

## 10. UX Intent

### Why is the Hotels module structured this way?

1. **Data Table as Primary View**
   - Hotels are the core entity; users need to scan many hotels quickly
   - Table format allows sorting and comparison

2. **Two-Tier Actions (Quick Add vs Wizard)**
   - Quick Add: For re-adding known hotels or simple setups
   - Onboarding Wizard: For complete new customer onboarding with all details

3. **Inline Row Actions**
   - View button always visible for common action
   - Dropdown for less frequent actions (edit, suspend)

4. **Destructive Confirm**
   - Suspending a hotel is serious (kiosks go offline, access lost)
   - Requires explicit confirmation with warning message

5. **Detail Page Focus**
   - One hotel at a time for deep inspection
   - Kiosk health visible in context of the hotel

6. **Breadcrumb Navigation**
   - Clear path back to list view
   - Maintains spatial context

---

## 11. Component File Summary

| Component | File Path | Size | Purpose |
|-----------|-----------|------|---------|
| Hotels Page | `app/hotels/page.tsx` | ~14KB | Main list view |
| Hotel Details | `app/hotels/[id]/page.tsx` | ~11KB | Single hotel view |
| AddHotelModal | `components/modals/AddHotelModal.tsx` | ~5.5KB | Quick add form |
| EditHotelModal | `components/modals/EditHotelModal.tsx` | ~5.7KB | Edit form |
| OnboardingWizard | `components/modals/OnboardingWizard.tsx` | ~19KB | 4-step wizard |
| ConfirmModal | `components/modals/ConfirmModal.tsx` | ~2.3KB | Confirmation dialogs |

---

**End of Report 03**

*Awaiting user confirmation to proceed to Report 04: Kiosk Fleet Module Deep-Dive.*
