# Super-Admin Panel Overview

**Report Type:** High-Level System Overview  
**Panel:** ATC Super-Admin Panel  
**Date Generated:** 2026-01-20  
**Status:** Complete - Module 1 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
The **ATC Super-Admin Panel** is a B2B internal operations dashboard built for **Aarkay Techno Consultants (ATC)** — a company that sells and manages physical self check-in kiosks to hotels across India. This panel serves as the centralized command center for ATC's internal staff to:

- Monitor and manage all registered hotels in the system
- Track the health and status of deployed kiosk hardware fleet
- Manage subscriptions, revenue, and contract renewals
- Control user access and role-based permissions
- View analytics, reports, and audit trails

### 1.2 Target Users (Role-wise)
| Role | Description | Primary Use |
|------|-------------|-------------|
| **Super Admin** | Full system access | All modules, user management, role configuration |
| **Operations Manager** | Operational oversight | Hotels, kiosks, dashboard monitoring |
| **Finance Manager** | Revenue & billing focus | Subscriptions, invoices, financial reports |
| **Support Staff** | Limited read-only access | View-only on assigned modules |

### 1.3 Technical Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS with dark mode support
- **Icons:** Lucide React
- **Components:** Shadcn/UI style (Radix UI primitives + Tailwind)
- **State:** React Server Components (RSC) + Client components for interaction
- **Data:** Mock data (no backend integration in current build)

---

## 2. Application Architecture

### 2.1 Layout Structure
The Super-Admin Panel uses a **fixed sidebar + header layout**:

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER (Fixed Top)                        │
│  [Hamburger Menu]    Search Bar    [Theme Toggle] [Notifications]│
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                   │
│   SIDEBAR    │              MAIN CONTENT AREA                   │
│   (Fixed     │                                                   │
│    Left)     │     Dynamic content based on route               │
│              │                                                   │
│  - Logo      │                                                   │
│  - User Info │                                                   │
│  - Nav       │                                                   │
│    Groups    │                                                   │
│              │                                                   │
└──────────────┴──────────────────────────────────────────────────┘
```

### 2.2 Navigation Structure
The sidebar organizes navigation into **three logical groups**:

| Group | Modules | Purpose |
|-------|---------|---------|
| **Operations** | Dashboard, Hotels, Kiosk Fleet | Day-to-day operational management |
| **Business & Finance** | Subscriptions, Invoicing, Reports | Financial oversight and analytics |
| **Administration** | Team & Users, Roles & Access, Audit Logs, Settings | System configuration and security |

### 2.3 Route Structure
| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Main overview with KPIs, charts, alerts |
| `/hotels` | Hotel Registry | List all hotels, CRUD operations |
| `/hotels/[id]` | Hotel Details | Single hotel detail view |
| `/fleet` | Kiosk Fleet | Hardware monitoring grid |
| `/finance` | Subscriptions | Revenue, MRR, contract status |
| `/invoices` | Invoicing | Invoice management |
| `/reports` | Reports | Analytics and business intelligence |
| `/users` | Team & Users | User account management |
| `/roles` | Roles & Access | RBAC configuration |
| `/roles/[id]` | Role Details | Permission editing |
| `/roles/new` | New Role | Role creation form |
| `/audit` | Audit Logs | Activity and security logs |
| `/settings` | Settings | System preferences |
| `/profile` | My Profile | Current user profile |
| `/login` | Login | Authentication screen |

---

## 3. Module Inventory

### 3.1 Operations Modules

#### Dashboard (`/`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Provide at-a-glance system health and key metrics |
| **Key KPIs** | Total Hotels, Active Kiosks, Revenue MTD, Check-ins Today |
| **Charts** | 7-Day Check-in Trend (Bar), Revenue Trend (Area), Kiosk Status (Donut) |
| **Alerts** | Critical alerts panel (offline kiosks, payment overdue, contract expiring) |
| **Quick Access** | Recent hotels table with status, plan, kiosk count, MRR |

#### Hotels (`/hotels`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Central registry for all client hotels |
| **Data Displayed** | Hotel name, location, contact, status, plan, kiosk count, MRR, contract renewal |
| **Actions** | Quick Add, Onboard Hotel (wizard), View, Edit, Reset Password, Suspend |
| **Entry Points** | Sidebar navigation, Dashboard links |

#### Kiosk Fleet (`/fleet`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Monitor physical hardware deployment and health |
| **Data Displayed** | Serial number, model, assigned hotel, status, last heartbeat, firmware |
| **Filters** | Search, Status (Online/Offline/Warning), Model |
| **Layout** | Card grid with pagination |

### 3.2 Business & Finance Modules

#### Subscriptions (`/finance`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Track revenue across all hotels |
| **Key Metrics** | Total MRR, Active Revenue, At-Risk Revenue, Avg per Hotel |
| **Features** | Contracts expiring soon panel, Revenue by hotel table, AMC progress bars |

#### Invoicing (`/invoices`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Generate and manage invoices for hotels |
| **Status** | Module exists but minimal implementation |

#### Reports (`/reports`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Business intelligence and usage analytics |
| **Visualizations** | Check-ins trend, AI sessions, Weekly patterns, Language distribution, India heatmap |
| **Tables** | State-wise performance, Top performing hotels |
| **Export** | CSV export functionality |

### 3.3 Administration Modules

#### Team & Users (`/users`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Manage ATC internal user accounts |
| **Data Displayed** | User name, email, role, status, last login |
| **Actions** | Add User (slide-over), Edit, Reset Password, Delete |
| **Features** | DataTable with search, pagination, export |

#### Roles & Access (`/roles`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Configure role-based access control |
| **Tabs** | ATC Admin Roles, Hotel Roles |
| **ATC Roles** | Super Admin, Operations Manager, Finance Manager, Support Staff |
| **Hotel Roles** | Hotel Admin, Front Desk, Kiosk Manager, Viewer |
| **Actions** | View/Edit permissions, Delete (non-super-admin), Add new role |

#### Audit Logs (`/audit`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | Security and activity logging (read-only) |
| **Data Displayed** | Timestamp, user, action, category, details |
| **Categories** | Hotel, Kiosk, Alert, Billing, User |
| **Actions** | Filter, Export |

#### Settings (`/settings`)
| Aspect | Description |
|--------|-------------|
| **Purpose** | System-wide configuration |
| **Sections** | General (Company name, Support email), Notifications (Toggles), Security (Session timeout, 2FA) |
| **System Info** | Version, Environment, Last Updated |

---

## 4. Design System & UX Principles

### 4.1 Design Philosophy
- **Clean & Dense:** Power-user tool optimized for information density
- **Operational Focus:** High-contrast status badges for quick recognition
- **Consistent Layout:** Fixed sidebar, responsive main content
- **Dark Mode:** Full dark mode support throughout

### 4.2 Color Palette
| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| Primary | Slate-900 | Slate-100 |
| Success/Online | Emerald-600 | Emerald-400 |
| Warning | Amber-500 | Amber-400 |
| Error/Offline | Rose-600 | Rose-400 |
| Info | Blue-600 | Blue-400 |

### 4.3 Status Badges
| Status | Color | Usage |
|--------|-------|-------|
| Active | Emerald | Hotel status, user status |
| Inactive | Slate | Disabled accounts |
| Suspended | Rose | Blocked hotels/users |
| Pending | Amber | Awaiting action |
| Onboarding | Blue | New hotel setup |
| Online | Emerald | Kiosk connectivity |
| Offline | Rose | Kiosk connectivity |
| Warning | Amber | Kiosk issues |

### 4.4 Component Patterns
- **Cards:** Rounded-lg, subtle border, shadow-sm
- **Tables:** Striped hover, sticky headers
- **Modals:** Centered, backdrop blur, slide-in animation
- **Buttons:** Primary (slate-900), Secondary (white/border), Destructive (rose)
- **Forms:** Clean labels, focus rings, validation states

---

## 5. Role-Based Access Summary

### 5.1 Page-Level Access Matrix

| Page | Super Admin | Ops Manager | Finance Manager | Support |
|------|:-----------:|:-----------:|:---------------:|:-------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Hotels | ✅ | ✅ | ❌ | 👁️ |
| Kiosk Fleet | ✅ | ✅ | ❌ | 👁️ |
| Subscriptions | ✅ | ❌ | ✅ | ❌ |
| Invoicing | ✅ | ❌ | ✅ | ❌ |
| Reports | ✅ | ✅ | ✅ | 👁️ |
| Team & Users | ✅ | ❌ | ❌ | ❌ |
| Roles & Access | ✅ | ❌ | ❌ | ❌ |
| Audit Logs | ✅ | 👁️ | 👁️ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ |

**Legend:** ✅ Full Access | 👁️ View Only | ❌ No Access

---

## 6. Key Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Sidebar` | `components/layout/Sidebar.tsx` | Main navigation, permission filtering |
| `Header` | `components/layout/Header.tsx` | Top bar with search, theme, notifications |
| `ClientLayout` | `components/layout/ClientLayout.tsx` | Wraps sidebar + header + content |
| `DataTable` | `components/ui/DataTable.tsx` | Reusable table with search, pagination, export |
| `ConfirmModal` | `components/modals/ConfirmModal.tsx` | Confirmation dialogs |
| `Toast` | `components/ui/Toast.tsx` | Notification system |
| `Dropdown` | `components/ui/Dropdown.tsx` | Action menus |
| `Filters` | `components/ui/Filters.tsx` | Search and filter chips |
| `Charts` | `components/ui/Charts.tsx` | Recharts wrappers (Area, Bar, Donut, Line) |

---

## 7. UX Intent Summary

### Why this structure?
1. **Sidebar Navigation:** Persistent access to all modules without losing context
2. **Grouped Modules:** Logical separation helps users find features based on their role
3. **Dashboard First:** Quick system health check before diving into details
4. **Dense Information:** Designed for operations staff who need to scan data quickly
5. **Role Filtering:** Navigation auto-hides inaccessible modules for cleaner UX
6. **Dark Mode:** Reduces eye strain for users monitoring dashboards for extended periods

---

## 8. Next Reports in Series

1. ☑️ **Report 01:** Super-Admin Panel Overview (This Document)
2. ⏳ **Report 02:** Dashboard Module Deep-Dive
3. ⏳ **Report 03:** Hotels Module Deep-Dive
4. ⏳ **Report 04:** Kiosk Fleet Module Deep-Dive
5. ⏳ **Report 05:** Finance & Subscriptions Module Deep-Dive
6. ⏳ **Report 06:** Reports & Analytics Module Deep-Dive
7. ⏳ **Report 07:** User Management Module Deep-Dive
8. ⏳ **Report 08:** Roles & Access Module Deep-Dive
9. ⏳ **Report 09:** Audit Logs & Settings Module Deep-Dive
10. ⏳ **Report 10:** Hotel Panel Overview (Separate Application)

---

**End of Report 01**

*Awaiting user confirmation to proceed to next report.*
