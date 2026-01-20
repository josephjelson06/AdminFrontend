Example (How User & Role Management is implemented in another project)



Prompt for Code Editor
Here's a detailed prompt you can use:

User Management & Role-Based Access Control (RBAC) System
Build a complete User Management and Role Management module with the following features:
1. Role Management
Role Master List Page:

* Display a data table with columns: Serial Number (#), Role Name, Actions (edit/delete)
* Add "Export PDF" and "Export Excel" buttons for data export
* Include a search bar to filter roles
* Add "Customize Columns" dropdown to show/hide columns
* Implement pagination with "Rows per page" selector (default: 10) and page navigation
* Show row selection count (e.g., "0 of 2 row(s) selected")
* Add a primary "Add Role" button that navigates to the Create Role form

Create/Edit Role Page:

* Role Name text input field (required)
* Page Permissions section with collapsible/accordion categories:

Masters (expandable): Country Master, Brand Master, Product Master, Magazine Master, Customer Master, Transporter Master, Intimation Master, Issue Person Master, Route Master, Supplier Master
Storage & Inward (expandable): REIT Indent Inward, Inward Storage
Dispatch (expandable)
Consumption (expandable)


* Each sub-menu item has 4 permission checkboxes: Select All, Add, Edit, Delete
* "Select All" checkbox should toggle all permissions for that row
* Save and Cancel buttons

2. User Management
User List Page:

* Data table with columns: Serial Number (#), Username, Company Name, Role, Actions (edit/delete)
* Same export, search, customize columns, and pagination features as Role Master
* Primary "Add User" button

Add/Edit User Form:

* Username (text input, required)
* Password (password input, required for new users)
* Role (dropdown/select populated from existing roles)
* Save and Cancel buttons

3. Technical Requirements

* Implement proper form validation
* Role dropdown in User form should fetch roles dynamically from Role Master
* Store permissions as JSON structure for each role
* Protect routes based on user's assigned role permissions
* Include confirmation dialogs for delete actions

4. Navigation Structure
User Management (sidebar menu)
├── Role Manage → Role Master list
└── User Manage → User Management list


Copy this prompt and adjust based on your tech stack (React, Vue, Angular, etc.) and backend preferences. Want me to tailor it for a specific framework?