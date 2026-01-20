# User Management Module Deep-Dive

**Report Type:** Module-Level Documentation  
**Panel:** ATC Super-Admin Panel  
**Module:** Team & Users  
**Route:** `/users`  
**Date Generated:** 2026-01-20  
**Status:** Complete - Report 7 of Documentation Series

---

## 1. High-Level Overview

### 1.1 Purpose
The **User Management Module** enables administration of ATC internal user accounts:
- View and search all system users
- Add new users via invitation or direct creation
- Assign roles to users
- Reset passwords
- Delete user accounts
- Export user data

### 1.2 Who Uses It
| Role | Access Level | Primary Use |
|------|-------------|-------------|
| Super Admin | Full Access | Complete user management |
| Operations Manager | No Access | Not relevant to role |
| Finance Manager | No Access | Not relevant to role |
| Support Staff | No Access | Not relevant to role |

### 1.3 Position in Application
- **Sidebar Location:** Administration → Team & Users
- **Route:** `/users`
- **Entry Points:** Sidebar navigation

---

## 2. Page Layout & Structure

### 2.1 Visual Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Page Header                                                      │
│  "Team & Users" | "Manage user accounts and access"              │
│                                                    [+ Add User]   │
├──────────────────────────────────────────────────────────────────┤
│  DataTable Component                                              │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ [🔍 Search by name or email...]          [PDF ↓] [Excel ↓]  ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ # | User          | Email         | Role    | Status | Last  ││
│  │ 1 | [Avatar] Name | email@...     | [Badge] | Active | 2h ago││
│  │ 2 | [Avatar] Name | email@...     | [Badge] | Invited| Never ││
│  │ ... (paginated)                                    [Actions] ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ Showing 1-10 of 12                    [< Prev] 1 2 [Next >]  ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Responsive Behavior
| Breakpoint | Behavior |
|------------|----------|
| Desktop (md+) | Full table with all columns |
| Mobile (sm) | Hidden: Email, Status, Last Login columns |
| Mobile (sm) | Email shown inline under username |

---

## 3. Component Breakdown

### 3.1 Page Header

| Element | Description |
|---------|-------------|
| **Title** | "Team & Users" |
| **Subtitle** | "Manage user accounts and access" |
| **Add User Button** | Primary button with UserPlus icon |

---

### 3.2 DataTable Component

The page uses a reusable `DataTable` component with the following configuration:

#### DataTable Props
| Prop | Value |
|------|-------|
| `data` | `MOCK_USERS` array |
| `columns` | 7 column definitions |
| `searchPlaceholder` | "Search by name or email..." |
| `searchKeys` | ['username', 'email'] |
| `showExport` | true |
| `onExport` | handleExport function |
| `getRowKey` | (user) => user.id |
| `emptyIcon` | Search icon |
| `emptyTitle` | "No users found" |
| `emptyDescription` | "Try adjusting your search or filters" |

---

### 3.3 Table Columns

#### Column 1: Index (#)
| Property | Value |
|----------|-------|
| **ID** | 'index' |
| **Header** | "#" |
| **Content** | Row number (1-indexed) |
| **Width** | w-12 |

#### Column 2: User
| Property | Value |
|----------|-------|
| **ID** | 'user' |
| **Header** | "User" |
| **Content** | Avatar circle + Username + (Email on mobile) |

##### User Cell Structure
```
┌─────────────────────────────────────┐
│  [Circle with Initials]  Username  │
│                          📧 email  │ ← Mobile only
└─────────────────────────────────────┘
```

#### Column 3: Email
| Property | Value |
|----------|-------|
| **ID** | 'email' |
| **Header** | "Email" |
| **Content** | Email address |
| **Mobile** | Hidden (hideOnMobile: true) |

#### Column 4: Role
| Property | Value |
|----------|-------|
| **ID** | 'role' |
| **Header** | "Role" |
| **Content** | TableBadge with role name |
| **Data Source** | getRoleName(user.roleId) |

#### Column 5: Status
| Property | Value |
|----------|-------|
| **ID** | 'status' |
| **Header** | "Status" |
| **Content** | StatusBadge component |
| **Mobile** | Hidden (hideOnMobile: true) |

##### Status Badge Variants
| Status | Variant | Color |
|--------|---------|-------|
| active | success | Emerald |
| invited | warning | Amber |
| default | default | Slate |

#### Column 6: Last Login
| Property | Value |
|----------|-------|
| **ID** | 'lastLogin' |
| **Header** | "Last Login" |
| **Content** | Clock icon + timestamp or "Never" |
| **Mobile** | Hidden (hideOnMobile: true) |

#### Column 7: Actions
| Property | Value |
|----------|-------|
| **ID** | 'actions' |
| **Header** | "Actions" |
| **Content** | Dropdown menu |
| **Alignment** | Right |
| **Width** | w-24 |

---

### 3.4 Row Actions Dropdown

| Menu Item | Icon | Click Behavior |
|-----------|------|----------------|
| Edit User | Edit2 | Shows toast "Edit feature coming soon" |
| Reset Password | Key | Shows toast "Password reset email sent" |
| Delete User | Trash2 | Opens ConfirmModal |

#### Delete User Confirmation
| Property | Value |
|----------|-------|
| **Modal Component** | ConfirmModal |
| **Title** | "Delete User" |
| **Message** | "Are you sure you want to delete \"{username}\"? This action cannot be undone." |
| **Confirm Text** | "Delete" |
| **Variant** | danger |

---

## 4. Add User SlideOver

### 4.1 Component Overview
| Property | Value |
|----------|-------|
| **Component** | `AddUserSlideOver` |
| **File** | `components/modals/AddUserSlideOver.tsx` |
| **Size** | ~10KB |
| **Animation** | Slides in from right |

### 4.2 SlideOver Structure
```
┌───────────────────────────────────────────┐
│  Header                                    │
│  "Add New User" | "Create a new user acct" │
├───────────────────────────────────────────┤
│  Form Fields                               │
│                                            │
│  👤 Username *                             │
│  [John Doe                            ]    │
│                                            │
│  ✉️ Email Address *                        │
│  [user@example.com                    ]    │
│                                            │
│  📱 Phone Number (Optional)                │
│  [+91 98765 43210                     ]    │
│                                            │
│  Role *                                    │
│  [Select a role...              ▼    ]     │
│  [Role description appears here]           │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │ ☑️ Send invitation email           │    │
│  │    User will create their own pwd  │    │
│  └────────────────────────────────────┘    │
│                                            │
│  🔒 Password * (if invite unchecked)       │
│  [••••••••                            ]    │
│                                            │
├───────────────────────────────────────────┤
│  [Cancel]              [📤 Send Invitation]│
└───────────────────────────────────────────┘
```

### 4.3 Form Fields

| Field | Icon | Type | Required | Placeholder |
|-------|------|------|----------|-------------|
| Username | User | text | Yes | "John Doe" |
| Email Address | Mail | email | Yes | "user@example.com" |
| Phone Number | Phone | tel | No | "+91 98765 43210" |
| Role | - | select | Yes | "Select a role..." |
| Send Invite | - | checkbox | - | Default: checked |
| Password | Lock | password | Conditional | "••••••••" |

### 4.4 Form State
```typescript
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [phone, setPhone] = useState('');
const [roleId, setRoleId] = useState('');
const [sendInvite, setSendInvite] = useState(true);
```

### 4.5 Conditional Logic

| Condition | Behavior |
|-----------|----------|
| sendInvite = true | Password field hidden |
| sendInvite = false | Password field required |
| roleId selected | Role description shown below dropdown |

### 4.6 Validation Rules

| Validation | Error Message |
|------------|---------------|
| Missing username, email, or role | "Please fill in all required fields." |
| No invite + no password | "Password is required if not sending an invite." |

### 4.7 Submit Actions

| Send Invite | Button Label | Success Message |
|-------------|--------------|-----------------|
| true | "Send Invitation" | "Invitation sent to {email}" |
| false | "Create User" | "User \"{username}\" created." |

---

## 5. Button & Action Mapping

### 5.1 Page Header Actions

| Button | Type | Icon | Click Behavior |
|--------|------|------|----------------|
| Add User | Primary | UserPlus | Opens AddUserSlideOver |

### 5.2 DataTable Actions

| Element | Type | Behavior |
|---------|------|----------|
| Search input | Text field | Filters by username or email |
| PDF export | Icon button | Calls handleExport('pdf') |
| Excel export | Icon button | Calls handleExport('excel') |
| Pagination | Buttons | Navigate pages |

### 5.3 Export Functionality

```typescript
const handleExport = (format: 'pdf' | 'excel') => {
    addToast('info', 'Export Started', `Exporting users to ${format.toUpperCase()}...`);
};
```

*Note: Export shows toast but doesn't actually generate files in current build.*

---

## 6. Data Dependencies

### 6.1 Type Definitions
```typescript
interface SystemUser {
    id: string;
    username: string;
    email: string;
    roleId: string;
    status: 'active' | 'invited' | 'disabled';
    lastLogin: string | null;
}
```

### 6.2 Mock Data Sources
| Source | Location | Purpose |
|--------|----------|---------|
| `MOCK_USERS` | `lib/rbac-data.ts` | User list |
| `MOCK_ROLES` | `lib/rbac-data.ts` | Role options for dropdown |

### 6.3 Helper Functions
| Function | Purpose |
|----------|---------|
| `getRoleName(roleId)` | Convert role ID to display name |

---

## 7. Shared Components

### 7.1 DataTable Component
| Location | `components/ui/DataTable.tsx` |
| Purpose | Reusable table with search, pagination, export |
| Features | Responsive columns, sorting-ready, empty state |

### 7.2 TableBadge Component
| Location | `components/ui/DataTable.tsx` |
| Purpose | Styled badge for table cells |
| Variants | default, success, warning |

### 7.3 SlideOver Component
| Location | `components/ui/SlideOver.tsx` |
| Purpose | Right-sliding panel for forms |
| Props | isOpen, onClose, title, description, size |

### 7.4 ConfirmModal Component
| Location | `components/modals/ConfirmModal.tsx` |
| Purpose | Confirmation dialogs |
| Variants | danger (red confirm button) |

### 7.5 Dropdown Component
| Location | `components/ui/Dropdown.tsx` |
| Purpose | Action menus |
| Features | Right-aligned, multiple items |

---

## 8. Imports & Dependencies

### 8.1 Users Page
```typescript
import { UserPlus, MoreHorizontal, Edit2, Key, Trash2, Clock, Mail, Search } from 'lucide-react';
import { MOCK_USERS, MOCK_ROLES, getRoleName, SystemUser } from '@/lib/rbac-data';
import { DataTable, Column, TableBadge } from '@/components/ui/DataTable';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { AddUserSlideOver } from '@/components/modals/AddUserSlideOver';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
```

### 8.2 AddUserSlideOver
```typescript
import { User, Mail, Lock, Phone, Send } from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';
import { MOCK_ROLES } from '@/lib/rbac-data';
import { useToast } from '@/components/ui/Toast';
```

---

## 9. Role-Based Visibility

| Element | Super Admin | Others |
|---------|:-----------:|:------:|
| View users page | ✅ | ❌ |
| Search users | ✅ | - |
| Add User | ✅ | - |
| Edit User | ✅ | - |
| Reset Password | ✅ | - |
| Delete User | ✅ | - |
| Export | ✅ | - |

*Note: Only Super Admin has access to this module.*

---

## 10. Navigation Flow

### 10.1 Entry Points
| From | Action | Result |
|------|--------|--------|
| Sidebar | Click "Team & Users" | Navigate to `/users` |

### 10.2 Exit Points
| From | Action | Result |
|------|--------|--------|
| Users page | Click sidebar item | Navigate elsewhere |

---

## 11. UX Intent

### Why is the User Management module structured this way?

1. **DataTable Pattern**
   - Familiar table format for user lists
   - Search enables quick user lookup
   - Pagination handles growth

2. **SlideOver for Add**
   - Doesn't navigate away from list
   - Side panel maintains context
   - Spacious form layout

3. **Invitation Flow**
   - Default sends email invitation
   - Toggle for direct creation (internal use)
   - Clear password conditional

4. **Role Selection**
   - Dropdown shows all available roles
   - Description helps understand permissions
   - Prevents invalid role assignment

5. **Destructive Confirm**
   - Delete requires explicit confirmation
   - "Cannot be undone" warning
   - Red button for danger

6. **Export Options**
   - PDF for formal reporting
   - Excel for data manipulation
   - Toast feedback for async operation

---

## 12. Potential Improvements (Documented, Not Implemented)

> ⚠️ **Note:** These are observations, not current features.

- Edit user modal/slideOver
- Bulk user import (CSV)
- User activity log
- Session management (force logout)
- Profile picture upload
- Email verification status
- Two-factor authentication toggle

---

## 13. Component File Summary

| Component | File Path | Size | Purpose |
|-----------|-----------|------|---------|
| Users Page | `app/users/page.tsx` | ~8KB | Main user list |
| AddUserSlideOver | `components/modals/AddUserSlideOver.tsx` | ~10KB | User creation form |
| DataTable | `components/ui/DataTable.tsx` | Shared | Reusable table |
| SlideOver | `components/ui/SlideOver.tsx` | Shared | Sliding panel |
| ConfirmModal | `components/modals/ConfirmModal.tsx` | Shared | Confirmations |

---

**End of Report 07**

*Awaiting user confirmation to proceed to Report 08: Roles & Access Module Deep-Dive.*
