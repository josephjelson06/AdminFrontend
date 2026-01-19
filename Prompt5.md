Prompt
You are a senior software engineer and product designer with strong experience building role‑based B2B dashboards for hospitality and operations‑focused SaaS products.
You are designing the Hotel‑side web panel for Aarkay Techno Consultants (ATC), which sells a physical self check‑in kiosk HMS product to hotels in India.
The kiosk uses voice‑AI to allow guests to self check‑in, with the goal of reducing front‑desk labor.
ATC’s customer is the hotel, not the guest.

Panel Context

* This is a single Hotel Panel frontend
* The same panel UI is used by all hotel users
* Page visibility and actions are controlled by user role
* Each user belongs to one hotel only
* This is v1 / MVP


Hotel User Roles (Guided, Not Overengineered)
Design the panel assuming practical hotel roles, such as:

* Hotel Manager (primary user)
* Front Desk / Operations
* Housekeeping
* Hotel Finance (optional if justified)

Avoid adding roles unless they clearly serve hotel operations.

Your Task
Design the frontend structure of the Hotel Panel, with the Hotel Manager as the reference role.
The output must:

* Work for all hotel roles using role‑based page visibility
* Be simple enough for non‑technical hotel staff
* Look professional and presentable
* Avoid unnecessary complexity


Scope Constraints (Strict)

* ✅ Frontend UI/UX only
* ✅ Information architecture, pages, components
* ❌ No backend, APIs, or databases
* ❌ No guest‑side flows
* ❌ No ATC business or platform‑wide data
* ❌ No overengineering or enterprise complexity


Functional Focus Areas
The Hotel Panel should focus on day‑to‑day hotel operations, including:

* Kiosk overview & basic health
* Check‑in activity visibility (high‑level)
* Language configuration (within subscription limits)
* Hotel profile & settings
* Hotel users & roles (limited to their hotel)
* Subscription & billing visibility (mostly read‑only)
* Reports relevant to hotel operations (not ATC business)


Deliverables
1️⃣ Core Modules
List all core modules/pages in the Hotel Panel.
For each module:

* Purpose
* Primary hotel role(s) using it
* Why it belongs in v1


2️⃣ Role‑Based Visibility
For each role:

* Which modules/pages are visible
* Which actions are allowed (view / manage)

Keep this minimal and realistic.

3️⃣ Screen & Component Breakdown
For each module:

* Key screens/sub‑pages
* Essential UI components only
(tables, forms, toggles, status indicators)


4️⃣ Navigation Structure
Propose:

* Sidebar or top‑level navigation
* Ordering optimized for Hotel Manager daily use
* Clear separation between operations, settings, and billing


UX & Design Principles

* Designed for hotel staff, not engineers
* Fast to learn, hard to misuse
* Clear labels, minimal settings
* Sensible defaults over configuration overload


Output Style

* Structured
* Concise
* Clear headings
* No filler
* Implementation‑ready