Adaptable Prompt for Code Editor

Implement a User Management and Role-Based Access Control (RBAC) system for this project.
Role Management
Role List Page:

* Data table displaying all roles with columns: Role Name, Actions (edit/delete)
* Search functionality, pagination, and export options (PDF/Excel)
* "Add Role" button to create new roles

Create/Edit Role Page:

* Role Name input field
* Dynamic Page Permissions section: Scan/detect all existing pages and modules in this project, then display them as collapsible categories. For each page/module, provide permission checkboxes:

Select All
View
Add
Edit
Delete


* Adapt the permission structure based on what makes sense for each module

User Management
User List Page:

* Data table with columns: Username, Email, Role, Actions
* Search, pagination, and export options
* "Add User" button

Create/Edit User Form:

* Username, Email, Password fields
* Role dropdown (populated dynamically from existing roles)

Core Requirements

* Adapt permissions to existing project structure — detect current sidebar menus, pages, or modules and build the permission matrix accordingly
* Store role permissions in a flexible JSON structure
* Implement route guards/middleware to enforce permissions
* Check permissions before rendering action buttons (hide "Edit" if user lacks edit permission, etc.)
* Include confirmation modals for destructive actions


This prompt tells the AI to analyze your existing project and build permissions around it rather than copying a fixed structure. Want me to adjust the tone or add anything?