Here is the frontend architectural design for User & Role Management in the ATC Super Admin Panel.
1️⃣ Role Model (V1 Default Roles)
We categorize roles into two distinct "Universes": Internal (ATC) and External (Hotel). This separation prevents dangerous permission leaks (e.g., accidentally giving a hotel manager super admin access).
Universe A: ATC Internal Staff
These users operate across the entire platform.
Role NamePurposePermission IntentSuper AdminFull system control.System-Wide: Can delete hotels, change billing, manage internal users.Ops ManagerDay-to-day deployment & hardware health.Hardware Focus: Can add hotels, manage kiosks, view logs. No access to financial settings or internal user creation.Finance / SalesRevenue assurance and contract management.Money Focus: Can view dashboard stats, invoices, subscription statuses. Read-only on hardware config.Support AgentL1/L2 troubleshooting.Read-Only / Action-Limited: Can view hotel details and kiosk status to debug. Cannot change settings or delete data.
Universe B: Hotel Users
These users are scoped strictly to a single HotelID.
Role NamePurposePermission IntentHotel ManagerThe primary POC at the client site.Hotel-Wide: Can edit hotel profile, view their own billing, add their own staff.Front DeskStaff monitoring the physical kiosk.Operational: Can view "Live Kiosk Status" and guest check-in logs. No access to billing/settings.HousekeepingRoom readiness inputs (future proofing).Task-Specific: Minimal access. Likely only interacts with room status modules.

2️⃣ User Management Screens
This module allows ATC Admins to find, add, and fix user accounts.
A. User List View (The Directory)
A clean, split-view table interface.

* Primary Layout:

Top Tabs: [ ATC Staff ] [ Hotel Users ] (Splitting these checks prevents confusion).
Filter Bar: Search by Name/Email, Filter by Role, Filter by Hotel (only visible on Hotel Users tab).


* Data Table Columns (ATC Tab): Name, Email, Role (Badge), Status (Active/Invited), Last Login.
* Data Table Columns (Hotel Tab): Name, Hotel Name (Link), Role, Status.
* Primary Action: + Add New User button (Top Right).

B. "Add/Edit User" Slide-Over Panel
Do not use a full page; use a slide-over drawer so the context of the list remains visible.

* Step 1: User Type Selection

Radio Card: "Internal Staff (ATC)" vs "Hotel Client".
UX Note: Changing this selection dramatically changes the next fields.


* Step 2: Assignment Logic (Dynamic)

If Internal: Dropdown for Role (Super Admin, Ops, etc.).
If Hotel Client:

Select Hotel: Searchable dropdown (Must pick a valid Hotel first).
Select Role: Dropdown populated with Hotel-specific roles only.




* Step 3: Basic Info

Inputs: Full Name, Email Address, Phone (Optional).
Checkbox: "Send usage reports via email?"




3️⃣ Role & Permission Screens
This is where the Super Admin defines "Who can do what." To make this friendly for non-tech admins, we avoid technical resource names (e.g., POST /api/v1/hotels) and use Functional Modules.
A. Roles List

* Two sections: ATC Roles and Hotel Roles.
* Each card displays: Role Name, Number of Users assigned, Description.
* Action: Edit Permissions.

B. Permission Matrix (The "Grid")
This is the core editing screen.

* Header: Role Name (e.g., "Ops Manager") & Description.
* The Grid UI:

Rows: Functional Modules (Dashboard, Hotel Registry, Billing, User Mgmt).
Colums: Permission Levels.
Interaction: Simple Checkboxes.



Example Permission Matrix for "Ops Manager":
ModuleView (Read)Manage (Write/Edit)Delete (Admin Only)Dashboard✅⬜️⬜️Hotel Registry✅✅⬜️Kiosk Fleet✅✅⬜️Billing & Contracts⬜️⬜️⬜️User Mgmt (Internal)⬜️⬜️⬜️

* UX Principles for the Matrix:

Plain English: Don't use "Write". Use "Manage" or "Edit".
Grouping: Group rows under headers like "Operational Modules" and "Financial Modules".
Auto-Save or Clear Save: Since this affects security, use a prominent "Save Changes" button with a confirmation modal: "This will update permissions for 14 assigned users."




4️⃣ Navigation Placement
Where do these screens live in the Super Admin sidebar?
1. "Settings" Section (Bottom of Sidebar)
Grouping these features under a dedicated "Settings" or "Administration" header keeps the daily operational views (Hotels, Kiosks) clean.
Sidebar Menu Structure:
... (Main Nav)
----------------
ADMINISTRATION
  > Team & Users      <-- (Lists all Users)
  > Roles & Access    <-- (Permission Matrix)
  > Audit Logs
  > My Profile

2. Contextual Access (Shortcut)
While the main list is in Settings, convenient access is required inside the Hotel Details view.

* In "Hotel Details > Users" Tab:

Show only users for that specific hotel.
Include an + Add User button that pre-fills the "Hotel" field in the form.
Why: When onboarding a new hotel, the Ops Manager is already looking at the Hotel page. They shouldn't have to navigate away to "Global Settings" to add the hotel manager.




5️⃣ Summary of UI Components Needed
To build this, the frontend team needs these standard components:

1. Split-View data Table: Support for tabbed filtering at the top level.
2. Permission Toggles: A robust checkbox component that supports "Indeterminate" states (optional, but good if grouping sub-permissions).
3. Role Badge: Visual distinction (e.g., Purple for Super Admin, Blue for Hotel Manager).
4. Slide-Over Drawer: Standard layout for "Add User" forms to prevent page reloading.
5. Searchable Select: Critical for selecting "Which Hotel?" when adding a user with thousands of hotels in the system.