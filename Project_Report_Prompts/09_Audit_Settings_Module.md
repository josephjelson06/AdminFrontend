# Audit Logs & Settings Module Deep-Dive

**Report Type:** Module-Level Documentation  
**Panel:** ATC Super-Admin Panel  
**Module:** Audit Logs, Settings, Profile  
**Routes:** `/audit`, `/settings`, `/profile`  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 9 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
This report covers three administration pages:
- **Audit Logs** (`/audit`) - Security and activity logging (read-only)
- **Settings** (`/settings`) - System-wide configuration
- **Profile** (`/profile`) - Current user's personal settings

### 1.2 Who Uses It
| Page | Super Admin | Ops Manager | Finance Manager | Support |
|------|:-----------:|:-----------:|:---------------:|:-------:|
| Audit Logs | ✅ | 👁️ | 👁️ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ |
| Profile | ✅ | ✅ | ✅ | ✅ |

### 1.3 Position in Application
- **Sidebar Location:** Administration → Audit Logs, Settings
- **Profile:** Accessible via sidebar user section
- **Routes:** `/audit`, `/settings`, `/profile`

---

## 2. Audit Logs Page (`/audit`)

### 2.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Audit Logs" | "Security and activity log (read-only)"         │
│                                          [🔍 Filter] [↓ Export]  │
├──────────────────────────────────────────────────────────────────┤
│  Audit Log Table                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Timestamp    │ User       │ Action         │ Category │ Details││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ 19 Jan 11:45 │ Rahul S.   │ Hotel Status.. │ [hotel]  │ Chang..││
│  │ 19 Jan 10:30 │ Priya M.   │ Kiosk Assigned │ [kiosk]  │ Assig..││
│  │ 19 Jan 09:15 │ ⚙️ System  │ Heartbeat Alert│ [alert]  │ Kiosk..││
│  │ ...                                                          ││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  Showing {X} recent logs                                          │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Page Header
| Element | Description |
|---------|-------------|
| **Title** | "Audit Logs" |
| **Subtitle** | "Security and activity log (read-only)" |
| **Filter Button** | Secondary button with Filter icon (placeholder) |
| **Export Button** | Primary button with Download icon (placeholder) |

### 2.3 Audit Log Table

#### Table Columns
| Column | Header | Content | Alignment |
|--------|--------|---------|-----------|
| Timestamp | "TIMESTAMP" | Calendar icon + formatted date/time | Left |
| User | "USER" | User icon + name (Activity icon for System) | Left |
| Action | "ACTION" | Action description (font-medium) | Left |
| Category | "CATEGORY" | CategoryBadge component | Left |
| Details | "DETAILS" | Details text (truncated) | Left |

#### Category Badge Colors
| Category | Background | Text Color |
|----------|------------|------------|
| hotel | blue-100 | blue-700 |
| kiosk | purple-100 | purple-700 |
| alert | rose-100 | rose-700 |
| billing | emerald-100 | emerald-700 |
| user | amber-100 | amber-700 |

### 2.4 Mock Audit Log Data
| ID | User | Action | Category | Details |
|----|------|--------|----------|---------|
| log-001 | Rahul Sharma | Hotel Status Changed | hotel | Changed Lemon Tree Premier status from Active to Suspended |
| log-002 | Priya Menon | Kiosk Assigned | kiosk | Assigned kiosk ATC-SN-9988 to Royal Orchid Bangalore |
| log-003 | System | Heartbeat Alert | alert | Kiosk ATC-SN-7766 offline for more than 24 hours |
| log-004 | Amit Patel | Invoice Generated | billing | Generated invoice INV-2026-001 for Royal Orchid Bangalore |
| log-005 | Rahul Sharma | User Created | user | Created new user account for sneha@atc.in |
| log-006 | Priya Menon | Hotel Onboarded | hotel | Onboarded new hotel: Sayaji Hotel, Indore |

### 2.5 Footer
| Element | Description |
|---------|-------------|
| **Left Side** | "Showing {X} recent logs" |

---

## 3. Settings Page (`/settings`)

### 3.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Settings" | "System configuration and preferences"             │
├──────────────────────────────────────────────────────────────────┤
│  Main Content (2/3)              │  Sidebar (1/3)                │
│  ┌────────────────────────────┐  │  ┌──────────────────────────┐ │
│  │ ⚙️ General Settings        │  │  │ System Info              │ │
│  │ • Company Name             │  │  │ • Version: v1.0.0        │ │
│  │ • Support Email            │  │  │ • Environment: Production│ │
│  ├────────────────────────────┤  │  │ • Last Updated: Jan 19   │ │
│  │ 🔔 Notifications           │  │  └──────────────────────────┘ │
│  │ ☑️ Email alerts for offline│  │                               │
│  │ ☑️ Payment overdue notify  │  │  [💾 Save Changes]            │
│  │ ☑️ Contract renewal remind │  │                               │
│  ├────────────────────────────┤  │                               │
│  │ 🛡️ Security                │  │                               │
│  │ • Session Timeout [30 min] │  │                               │
│  │ ☐ Require 2FA for all users│  │                               │
│  └────────────────────────────┘  │                               │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Page Header
| Element | Description |
|---------|-------------|
| **Title** | "Settings" |
| **Subtitle** | "System configuration and preferences" |

### 3.3 General Settings Section
| Field | Type | Default Value | Icon |
|-------|------|---------------|------|
| Company Name | text | "Aarkay Techno Consultants" | Settings |
| Support Email | email | "support@atc.in" | - |

### 3.4 Notifications Section
| Toggle | Type | Default | Description |
|--------|------|---------|-------------|
| Email alerts for offline kiosks | checkbox | ☑️ On | - |
| Payment overdue notifications | checkbox | ☑️ On | - |
| Contract renewal reminders | checkbox | ☑️ On | - |

### 3.5 Security Section
| Field | Type | Options/Default | Icon |
|-------|------|-----------------|------|
| Session Timeout | select | 30 minutes, 1 hour, 4 hours, 8 hours | Shield |
| Require 2FA for all users | checkbox | ☐ Off | - |

### 3.6 System Info Sidebar
| Field | Value |
|-------|-------|
| Version | v1.0.0 |
| Environment | Production |
| Last Updated | Jan 19, 2026 |

### 3.7 Save Button
| Property | Value |
|----------|-------|
| **Location** | Below System Info |
| **Label** | "Save Changes" |
| **Icon** | Save |
| **Type** | Primary (full width) |
| **Behavior** | Placeholder (no actual save) |

---

## 4. Profile Page (`/profile`)

### 4.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "My Profile" | "Manage your account settings and preferences"   │
├──────────────────────────────────────────────────────────────────┤
│  Main Content (2/3)              │  Sidebar (1/3)                │
│  ┌────────────────────────────┐  │  ┌──────────────────────────┐ │
│  │ Personal Information       │  │  │ Account Details          │ │
│  │ [Edit Profile / Save]      │  │  │ • Role: [Super Admin]    │ │
│  │ ┌─────┐                    │  │  │ • Member Since: Mar 2024 │ │
│  │ │ AU  │  Full Name         │  │  │ • Status: 🟢 Active      │ │
│  │ │     │  Email             │  │  └──────────────────────────┘ │
│  │ │     │  Phone             │  │                               │
│  │ └─────┘  Department        │  │  ┌──────────────────────────┐ │
│  └────────────────────────────┘  │  │ Active Sessions          │ │
│  ┌────────────────────────────┐  │  │ Windows PC (Current)     │ │
│  │ Security                   │  │  │ Chrome • Mumbai, IN      │ │
│  │ 🔑 Password      [Change]  │  │  │                          │ │
│  │ 🛡️ 2FA  Enabled  [Config]  │  │  │ [Sign out all others]    │ │
│  │ 🔔 Login Alerts  [Toggle]  │  │  └──────────────────────────┘ │
│  └────────────────────────────┘  │                               │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Page Header
| Element | Description |
|---------|-------------|
| **Title** | "My Profile" |
| **Subtitle** | "Manage your account settings and preferences" |

### 4.3 Personal Information Card

#### Edit Mode Toggle
| State | Button Text | Button Style |
|-------|-------------|--------------|
| Viewing | "Edit Profile" | Slate background |
| Editing | "Save Changes" | Emerald background |

#### Avatar Section
| Element | Description |
|---------|-------------|
| **Container** | 24x24 rounded-xl, bg-slate-900 |
| **Content** | User initials (3xl font, white) |
| **Camera Button** | Only visible in edit mode |

#### Form Fields
| Field | Type | Editable | Default Value |
|-------|------|----------|---------------|
| Full Name | text | Yes | "Admin User" |
| Email | email | Yes | "admin@atc.in" |
| Phone | tel | Yes | "+91 98765 43210" |
| Department | text | Yes | "Technology" |

### 4.4 Security Card

#### Security Items
| Item | Icon | Status/Info | Action |
|------|------|-------------|--------|
| Password | Key | "Last changed 30 days ago" | [Change] button |
| Two-Factor Authentication | Shield | "Enabled" (emerald) | [Configure] button |
| Login Alerts | Bell | "Get notified of new sign-ins" | Toggle switch |

### 4.5 Account Details Sidebar
| Field | Value |
|-------|-------|
| Role | Badge: "Super Admin" (purple) |
| Member Since | Formatted date (Mar 2024) |
| Status | 🟢 Active (emerald dot + text) |

### 4.6 Active Sessions Sidebar
| Element | Description |
|---------|-------------|
| **Current Session** | Device name + "Current" badge |
| **Session Details** | Browser + Location |
| **Sign Out Link** | "Sign out all other sessions" (rose text) |

---

## 5. Button & Action Mapping

### 5.1 Audit Logs Actions
| Button | Type | Behavior |
|--------|------|----------|
| Filter | Secondary | Placeholder (no action) |
| Export | Primary | Placeholder (no action) |

### 5.2 Settings Actions
| Button | Type | Behavior |
|--------|------|----------|
| Save Changes | Primary | Placeholder (no actual save) |

### 5.3 Profile Actions
| Button | Type | Behavior |
|--------|------|----------|
| Edit Profile | Secondary | Toggle isEditing state to true |
| Save Changes | Primary (emerald) | Save profile, show toast, toggle off |
| Change Password | Secondary | Show toast "Check your email for reset link" |
| Configure 2FA | Secondary | Placeholder |
| Login Alerts | Toggle | Toggle default checked |
| Sign out all others | Link | Show toast "All other sessions have been logged out" |

---

## 6. State Management

### 6.1 Profile Page State
```typescript
const [isEditing, setIsEditing] = useState(false);
const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@atc.in',
    phone: '+91 98765 43210',
    role: 'Super Admin',
    department: 'Technology',
    joinDate: '2024-03-15',
});
```

### 6.2 Settings Page State
- No client-side state (static server component)
- Form fields use `defaultValue` (uncontrolled)

### 6.3 Audit Page State
- No client-side state (static server component)
- Displays mock data directly

---

## 7. Data Dependencies

### 7.1 Audit Log Type
```typescript
interface AuditLog {
    id: string;
    timestamp: string;
    user: string;           // User name or "System"
    action: string;         // Action description
    details: string;        // Detailed message
    category: 'hotel' | 'kiosk' | 'alert' | 'billing' | 'user';
}
```

### 7.2 Mock Data Sources
| Page | Data Location | Description |
|------|---------------|-------------|
| Audit | Inline `MOCK_AUDIT_LOGS` | Array of 6 log entries |
| Settings | Inline defaults | Static default values |
| Profile | Inline `useState` | Default user profile |

---

## 8. Helper Components

### 8.1 CategoryBadge (Audit)
| Purpose | Display category with color coding |
| Props | `category: string` |
| Styling | Colored pill badge with capitalize |

---

## 9. Imports & Dependencies

### 9.1 Audit Logs
```typescript
import { Shield, Calendar, User, Activity, Filter, Download } from 'lucide-react';
```

### 9.2 Settings
```typescript
import { Settings, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
```

### 9.3 Profile
```typescript
import { useState } from 'react';
import { User, Mail, Phone, Shield, Key, Bell, Camera, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
```

---

## 10. Role-Based Visibility

| Element | Super Admin | Ops Manager | Finance Manager | Support |
|---------|:-----------:|:-----------:|:---------------:|:-------:|
| Audit Logs page | ✅ | 👁️ | 👁️ | ❌ |
| Audit Export | ✅ | ❌ | ❌ | - |
| Settings page | ✅ | ❌ | ❌ | ❌ |
| Profile page | ✅ | ✅ | ✅ | ✅ |

---

## 11. Navigation Flow

### 11.1 Entry Points
| From | Action | Result |
|------|--------|--------|
| Sidebar | Click "Audit Logs" | `/audit` |
| Sidebar | Click "Settings" | `/settings` |
| Sidebar | Click user profile area | `/profile` |

### 11.2 Exit Points
| From | Action | Result |
|------|--------|--------|
| Any page | Click sidebar item | Navigate elsewhere |

---

## 12. UX Intent

### Why are these pages structured this way?

1. **Audit Logs - Read-Only**
   - Security logs should not be editable
   - Filter and Export are placeholders for future functionality
   - Category badges provide quick visual scanning

2. **Settings - Grouped Sections**
   - Logical grouping: General, Notifications, Security
   - System Info separate in sidebar (read-only reference)
   - Single save button for all changes

3. **Profile - Two-Column Layout**
   - Personal info is editable, account details are not
   - Security options centralized
   - Active sessions for security awareness

4. **Edit Toggle Pattern**
   - Profile shows view mode by default
   - Explicit edit mode prevents accidental changes
   - Save confirmation via toast

---

## 13. Component File Summary

| Component | File Path | Size | Purpose |
|-----------|-----------|------|---------|
| Audit Logs | `app/audit/page.tsx` | ~7KB | Activity log table |
| Settings | `app/settings/page.tsx` | ~7KB | System configuration |
| Profile | `app/profile/page.tsx` | ~14KB | User profile editor |

---

## 14. Potential Improvements (Documented, Not Implemented)

> ⚠️ **Note:** These are observations, not current features.

**Audit Logs:**
- Actual filter implementation (date range, category, user)
- Export to CSV/PDF
- Pagination for large log volumes
- Search functionality

**Settings:**
- Actual form submission and persistence
- Theme picker (light/dark/system)
- Locale/timezone settings
- Email template customization

**Profile:**
- Avatar upload functionality
- Password change form
- 2FA setup wizard
- Session management (revoke specific sessions)

---

**End of Report 09**

*This completes the Super-Admin Panel documentation. Awaiting user confirmation to proceed to Report 10: Hotel Panel Overview.*
