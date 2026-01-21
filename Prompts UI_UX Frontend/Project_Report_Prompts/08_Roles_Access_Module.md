# Roles & Access Module Deep-Dive

**Report Type:** Module-Level Documentation  
**Panel:** ATC Super-Admin Panel  
**Module:** Roles & Access  
**Routes:** `/roles`, `/roles/[id]`, `/roles/new`  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 8 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
The **Roles & Access Module** manages role-based access control (RBAC) for the entire system:
- Configure ATC Admin roles (Super Admin internal staff)
- Configure Hotel Panel roles (Hotel staff)
- Set granular page-level and action-level permissions
- Create, edit, and delete custom roles

### 1.2 Who Uses It
| Role | Access Level | Primary Use |
|------|-------------|-------------|
| Super Admin | Full Access | Complete RBAC configuration |
| Operations Manager | No Access | Not relevant to role |
| Finance Manager | No Access | Not relevant to role |
| Support Staff | No Access | Not relevant to role |

### 1.3 Position in Application
- **Sidebar Location:** Administration → Roles & Access
- **Routes:** 
  - `/roles` - Role list with tabs
  - `/roles/[id]` - Edit existing role
  - `/roles/new` - Create new role
- **Entry Points:** Sidebar navigation

---

## 2. Routes Inventory

| Route | Page | Purpose |
|-------|------|---------|
| `/roles` | Roles List | View all ATC and Hotel roles with tabs |
| `/roles/[id]` | Edit Role | Modify role name, description, permissions |
| `/roles/new` | Create Role | Define new role with permissions |

---

## 3. Roles List Page (`/roles`)

### 3.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Roles & Access" | "Manage system roles and page permissions"   │
│                                                    [+ New Role]   │
├──────────────────────────────────────────────────────────────────┤
│  Tab Switcher                                                     │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ [🖥️ ATC Admin Roles (4)] │ [🏨 Hotel Roles (4)]              ││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  Role Cards Grid (based on active tab)                            │
│  ┌──────────────────┐ ┌──────────────────┐                       │
│  │ Role Name        │ │ Role Name        │                       │
│  │ [User Count]     │ │ [User Count]     │                       │
│  │ Description      │ │ Description      │                       │
│  │ [Permission Tags]│ │ [Page Access Tags]│                      │
│  │ [Edit] [Delete]  │ │ [Edit Access]    │                       │
│  └──────────────────┘ └──────────────────┘                       │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Page Header
| Element | Description |
|---------|-------------|
| **Title** | "Roles & Access" |
| **Subtitle** | "Manage system roles and page permissions" |
| **New Role Button** | Primary button with Plus icon |

### 3.3 Tab Switcher
| Tab | Icon | Label | Badge |
|-----|------|-------|-------|
| ATC Admin Roles | Monitor | "ATC Admin Roles" | Role count |
| Hotel Roles | Hotel | "Hotel Roles" | Role count |

---

### 3.4 ATC Admin Roles Tab

#### Role Card Structure
```
┌───────────────────────────────────────────────────────────────────┐
│  🛡️ {Role Name}                          [{X} users] (badge)     │
│  {Description}                                                     │
├───────────────────────────────────────────────────────────────────┤
│  Permissions:                                                      │
│  [Dashboard ✓] [Hotels R] [Fleet R] [Users RWD] [Roles RWD] [...]  │
├───────────────────────────────────────────────────────────────────┤
│  [✏️ Edit Permissions]                    [🗑️ Delete] (if not SA) │
└───────────────────────────────────────────────────────────────────┘
```

#### Permission Tags Format
| Symbol | Meaning |
|--------|---------|
| ✓ (checkmark) | Full access (all 4 permissions) |
| R | View only |
| RW | View + Add + Edit |
| RWD | View + Add + Edit + Delete |
| (no tag) | No access |

#### Card Actions
| Action | Condition | Behavior |
|--------|-----------|----------|
| Edit Permissions | Always | Navigate to `/roles/[id]` |
| Delete | Non-Super Admin only | Opens ConfirmModal |

---

### 3.5 Hotel Roles Tab

#### Role Card Structure
```
┌───────────────────────────────────────────────────────────────────┐
│  [Color Icon] {Role Name}                 [{X} users] (badge)     │
│  {Description}                                                     │
├───────────────────────────────────────────────────────────────────┤
│  Page Access:                                                      │
│  [Dashboard] [Guests] [Rooms] [Kiosk] [Team] [Billing] [...]      │
├───────────────────────────────────────────────────────────────────┤
│  [✏️ Edit Page Access]                                            │
└───────────────────────────────────────────────────────────────────┘
```

#### Hotel Role Colors
| Role | Icon | Color Theme |
|------|------|-------------|
| Hotel Admin | Shield | Purple |
| Front Desk | UserCheck | Emerald |
| Kiosk Manager | Cpu | Amber |
| Viewer | Eye | Slate |

#### Page Access Tags
Simple page name tags showing which Hotel Panel pages the role can access.

---

## 4. Edit Role Page (`/roles/[id]`)

### 4.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Roles                                                  │
│  "Edit Role"                                                      │
│  👥 {X} users assigned                       [🗑️ Delete Role]    │
├──────────────────────────────────────────────────────────────────┤
│  ⚠️ Super Admin Warning (if Super Admin role)                    │
│  "Super Admin has full system access. Permissions cannot be..."   │
├──────────────────────────────────────────────────────────────────┤
│  Role Details Card                                                │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Role Name *     [Input field]                                ││
│  │ Description     [Textarea]                                   ││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  Page Permissions Card                                            │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Configure access levels for each module...                   ││
│  │ ┌────────────────────────────────────────────────────────────┤│
│  │ │ Module      │ View │ Add │ Edit │ Delete │ Select All     │││
│  │ │ Dashboard   │  ☑️  │  ☑️ │  ☑️  │   ☑️   │     ☑️         │││
│  │ │ Hotels      │  ☑️  │  ☑️ │  ☑️  │   ☐   │     ☐         │││
│  │ │ ...         │      │     │      │        │                │││
│  │ └────────────────────────────────────────────────────────────┘│
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  [Cancel]                                        [💾 Save Changes]│
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Page Header
| Element | Description |
|---------|-------------|
| **Back Link** | "← Back to Roles" → `/roles` |
| **Title** | "Edit Role" |
| **User Count** | Users icon + "{X} users assigned" |
| **Delete Button** | Red text, hidden for Super Admin |

### 4.3 Super Admin Warning
| Condition | Display |
|-----------|---------|
| Role ID = 'role-001' | Amber warning box: "⚠️ Super Admin has full system access. Permissions cannot be modified for this role." |
| Other roles | Hidden |

### 4.4 Role Details Form
| Field | Type | Required | Disabled If |
|-------|------|----------|-------------|
| Role Name | text | Yes | Super Admin |
| Description | textarea (2 rows) | No | Super Admin |

### 4.5 Permission Grid Component
| Property | Value |
|----------|-------|
| **Component** | `PermissionGrid` |
| **Categories** | From `PERMISSION_CATEGORIES` |
| **Columns** | Module, View, Add, Edit, Delete, Select All |
| **Disabled** | If Super Admin role |

#### Permission Categories
| Category | Modules |
|----------|---------|
| Operations | Dashboard, Hotels, Kiosk Fleet |
| Business & Finance | Subscriptions, Invoicing, Reports |
| Administration | Team & Users, Roles & Access, Audit Logs, Settings |

### 4.6 Form State
```typescript
const [name, setName] = useState(role?.name || '');
const [description, setDescription] = useState(role?.description || '');
const [permissions, setPermissions] = useState<Record<string, ModulePermission>>(
    role?.permissions || {}
);
const [hasChanges, setHasChanges] = useState(false);
```

### 4.7 Save Confirmation Modal
| Property | Value |
|----------|-------|
| **Title** | "Save Changes" |
| **Message** | "This will update permissions for {X} users assigned to \"{name}\". Continue?" |
| **Confirm Text** | "Save Changes" |
| **Variant** | warning |

### 4.8 Delete Confirmation Modal
| Property | Value |
|----------|-------|
| **Title** | "Delete Role" |
| **Message** | "Are you sure you want to delete \"{name}\"? {X} users will be affected." |
| **Confirm Text** | "Delete" |
| **Variant** | danger |

---

## 5. Create Role Page (`/roles/new`)

### 5.1 Page Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Roles                                                  │
│  "Create New Role"                                                │
│  "Define role details and set permissions"                        │
├──────────────────────────────────────────────────────────────────┤
│  Role Details Card                                                │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Role Name *     [e.g., Operations Manager]                   ││
│  │ Description     [Brief description of this role's purpose...]││
│  └──────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────┤
│  Page Permissions Card                                            │
│  (Same PermissionGrid as Edit page, all unchecked by default)     │
├──────────────────────────────────────────────────────────────────┤
│  [Cancel]                                        [💾 Save Role]   │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 Initial State
| Field | Initial Value |
|-------|---------------|
| Name | '' (empty) |
| Description | '' (empty) |
| Permissions | All unchecked (from `createEmptyPermissions()`) |
| hasUnsavedChanges | false |

### 5.3 Unsaved Changes Modal
| Property | Value |
|----------|-------|
| **Condition** | Cancel clicked with hasUnsavedChanges = true |
| **Title** | "Discard Changes" |
| **Message** | "You have unsaved changes. Are you sure you want to leave?" |
| **Confirm Text** | "Discard" |
| **Variant** | warning |

---

## 6. Button & Action Mapping

### 6.1 Roles List Actions

| Button | Type | Location | Behavior |
|--------|------|----------|----------|
| New Role | Primary | Header | Navigate to `/roles/new` |
| ATC Tab | Tab | Tab bar | Show ATC roles |
| Hotel Tab | Tab | Tab bar | Show Hotel roles |
| Edit Permissions | Link | ATC card | Navigate to `/roles/[id]` |
| Edit Page Access | Link | Hotel card | Navigate to hotel role edit (placeholder) |
| Delete | Text button | ATC card | Opens ConfirmModal |

### 6.2 Edit Role Actions

| Button | Type | Condition | Behavior |
|--------|------|-----------|----------|
| Back to Roles | Link | Always | Navigate to `/roles` |
| Delete Role | Danger text | Non-Super Admin | Opens delete modal |
| Cancel | Secondary | Always | Navigate to `/roles` |
| Save Changes | Primary | hasChanges & !isSuperAdmin | Opens save modal |

### 6.3 Create Role Actions

| Button | Type | Behavior |
|--------|------|----------|
| Back to Roles | Link | Navigate to `/roles` |
| Cancel | Secondary | Check unsaved, navigate |
| Save Role | Primary | Validate, create, redirect |

---

## 7. Permission Grid Component

### 7.1 Component Overview
| Property | Value |
|----------|-------|
| **Component** | `PermissionGrid` |
| **File** | `components/ui/PermissionGrid.tsx` |
| **Purpose** | Render editable permission matrix |

### 7.2 Props
| Prop | Type | Description |
|------|------|-------------|
| categories | PermissionCategory[] | List of module groups |
| permissions | Record<string, ModulePermission> | Current permission state |
| onChange | (moduleId, permission, value) => void | Single toggle handler |
| onSelectAll | (moduleId, value) => void | Row toggle handler |
| disabled | boolean | Lock all checkboxes |

### 7.3 ModulePermission Type
```typescript
interface ModulePermission {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}
```

### 7.4 Grid Columns
| Column | Width | Content |
|--------|-------|---------|
| Module | Auto | Module name label |
| View | Fixed | Checkbox |
| Add | Fixed | Checkbox |
| Edit | Fixed | Checkbox |
| Delete | Fixed | Checkbox |
| Select All | Fixed | Checkbox (toggles all 4) |

---

## 8. Data Dependencies

### 8.1 Type Definitions
```typescript
interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Record<string, ModulePermission>;
    userCount: number;
}

interface HotelRole {
    id: string;
    name: string;
    description: string;
    pageAccess: string[];
    userCount: number;
    color: string;  // Theme color
}
```

### 8.2 Mock Data Sources
| Source | Location | Purpose |
|--------|----------|---------|
| `MOCK_ROLES` | `lib/rbac-data.ts` | ATC admin roles |
| `MOCK_HOTEL_ROLES` | `lib/rbac-data.ts` | Hotel panel roles |
| `PERMISSION_CATEGORIES` | `lib/rbac-data.ts` | Module groupings |

### 8.3 Helper Functions
| Function | Purpose |
|----------|---------|
| `createEmptyPermissions()` | Generate all-false permission object |
| `getPermissionSummary(permissions)` | Generate permission tags (R, RW, etc.) |

---

## 9. ATC Admin Roles (Default)

| Role | ID | User Count | Description |
|------|-----|------------|-------------|
| Super Admin | role-001 | 2 | Full system access with all permissions |
| Operations Manager | role-002 | 3 | Oversees hotel operations and kiosk fleet |
| Finance Manager | role-003 | 2 | Manages billing, subscriptions, and reports |
| Support Staff | role-004 | 4 | View-only access for customer support |

---

## 10. Hotel Roles (Default)

| Role | Color | User Count | Page Access |
|------|-------|------------|-------------|
| Hotel Admin | Purple | 6 | All pages |
| Front Desk | Emerald | 12 | Dashboard, Guests, Rooms |
| Kiosk Manager | Amber | 8 | Dashboard, Rooms, Kiosk Settings |
| Viewer | Slate | 4 | Dashboard only |

---

## 11. Role-Based Visibility

| Element | Super Admin | Others |
|---------|:-----------:|:------:|
| View roles page | ✅ | ❌ |
| Switch tabs | ✅ | - |
| Create new role | ✅ | - |
| Edit ATC role | ✅ | - |
| Delete ATC role | ✅ (except self) | - |
| Edit Hotel role access | ✅ | - |

---

## 12. Navigation Flow

### 12.1 Entry Points
| From | Action | Result |
|------|--------|--------|
| Sidebar | Click "Roles & Access" | `/roles` |

### 12.2 Internal Navigation
| From | Action | Result |
|------|--------|--------|
| `/roles` | Click "New Role" | `/roles/new` |
| `/roles` | Click "Edit Permissions" | `/roles/[id]` |
| `/roles/[id]` | Click "Back to Roles" | `/roles` |
| `/roles/new` | Click "Back to Roles" | `/roles` |
| `/roles/[id]` | Save or Cancel | `/roles` |
| `/roles/new` | Save | `/roles` |

---

## 13. UX Intent

### Why is the Roles module structured this way?

1. **Tab Separation**
   - Clear distinction between ATC internal roles and Hotel roles
   - Different permission models for each type

2. **Permission Grid**
   - Visual matrix makes permission auditing easy
   - Select All speeds up common configurations

3. **Super Admin Protection**
   - Cannot delete or modify Super Admin role
   - Prevents accidental lockout

4. **User Impact Warnings**
   - Save/Delete modals show affected user count
   - Prevents unintended access changes

5. **Hotel Role Simplicity**
   - Page-level access only (not CRUD operations)
   - Simpler model for hotel staff

6. **Unsaved Changes Protection**
   - Warns before discarding work
   - Prevents accidental data loss

---

## 14. Component File Summary

| Component | File Path | Size | Purpose |
|-----------|-----------|------|---------|
| Roles List | `app/roles/page.tsx` | ~14KB | Tabbed role view |
| Edit Role | `app/roles/[id]/page.tsx` | ~10KB | Permission editor |
| Create Role | `app/roles/new/page.tsx` | ~8KB | Role creation |
| PermissionGrid | `components/ui/PermissionGrid.tsx` | Shared | Permission matrix |
| ConfirmModal | `components/modals/ConfirmModal.tsx` | Shared | Confirmations |

---

**End of Report 08**

*Awaiting user confirmation to proceed to Report 09: Audit Logs & Settings Module Deep-Dive.*
