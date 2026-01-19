Prompt
You are a senior software engineer and SaaS product architect with strong experience designing user management and role‑based access control (RBAC) systems for B2B admin panels.
You are working on the Super Admin Panel for Aarkay Techno Consultants (ATC), which operates a multi‑tenant HMS kiosk platform for hotels in India.

Objective
Design the frontend structure for User Management and Role Management inside the Super Admin Panel.
This system must be:

* Comprehensive but simple to understand
* Usable by non‑technical administrators
* Flexible without being overengineered
* Suitable for v1 / MVP


User Categories (Fixed)
The system must support two distinct user categories:
🔹 Category 1: ATC Internal Users
Users who manage the platform and business.
Include only necessary roles, such as:

* Super Admin
* Operations
* Finance
* Sales / Business
* Support


🔹 Category 2: Hotel Users
Users who belong to a single hotel.
Include only practical roles, such as:

* Hotel Manager
* Front Desk / Operations
* Housekeeping
* Hotel Finance (optional if justified)


Scope Constraints (Strict)

* ✅ Frontend only
* ✅ UI structure, screens, components, and flows
* ❌ No backend, auth logic, or database design
* ❌ No speculative enterprise‑grade RBAC
* ❌ No per‑user custom permissions in v1 (role‑based only)


Functional Requirements
The Super Admin must be able to:

1. 
Create and manage roles

Separate roles for ATC users and Hotel users
Clearly show role category and purpose


2. 
Assign permissions to roles

Permissions grouped by modules/screens
Checkbox‑based UI
Read / Write / Manage where appropriate (minimal)


3. 
Create and manage users

Assign user to:

Category (ATC or Hotel)
Role
Hotel (if applicable)




4. 
Control panel visibility

Decide which modules, pages, and actions
are visible to each role




Deliverables
1️⃣ Role Model

* List all roles (ATC + Hotel)
* Purpose of each role
* High‑level permission intent


2️⃣ User Management Screens
Describe:

* User list view
* Create / edit user flow
* Key UI components


3️⃣ Role & Permission Screens
Describe:

* Role list
* Role detail screen
* Permission assignment UI
* How permissions are grouped and displayed


4️⃣ Navigation Placement
Explain:

* Where User Management and Role Management live
* How they fit into the Super Admin navigation without clutter


UX Principles (Very Important)

* Non‑technical admins must understand it
* Prefer clarity over flexibility
* Checkbox‑based permission grids
* No intimidating security jargon
* Sensible defaults over empty states


Output Style

* Structured
* Clear headings
* Concise, no filler
* Practical and implementation‑ready