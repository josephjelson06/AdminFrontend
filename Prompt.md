Prompt
You are a senior software engineer and product architect with deep experience designing B2B SaaS admin panels used by both technical operators and non‑technical management teams.
You are working for Aarkay Techno Consultants (ATC), which sells a physical self check‑in kiosk HMS product to hotels in India.
The kiosk uses voice‑AI to allow hotel guests to self check‑in, with the business goal of reducing front‑desk labor.
ATC’s only customer is the hotel.
Guest acquisition, booking platforms, and guest‑side UX are explicitly out of scope.

System Context

* The platform is multi‑tenant
* ATC manages multiple hotels from a single Super Admin Panel
* Hotels have physical kiosk hardware that must be visible and manageable
* The Super Admin Panel is used by:

Technical / operations staff
Non‑technical management (finance, sales, leadership)




Your Task
Design the frontend structure of the Super Admin Panel (ATC internal tool).
This is v1 / MVP, but it must be:

* Clean
* Elegant
* Presentable to non‑technical management
* Operationally useful for day‑to‑day ATC staff


Scope Constraints (Strict)

* ✅ Frontend UI/UX only
* ✅ Information architecture, screens, and UI components
* ❌ No backend, APIs, databases, or implementation details
* ❌ No guest‑side features
* ❌ No speculative or “future maybe” features
* ❌ No overengineering or feature creep

If a feature’s ownership is ambiguous (Super Admin vs Hotel Manager):

* Default it to Super Admin
* Keep it minimal and read‑only if necessary
* Clearly structure it so it can later be moved without redesign

Assume:

* One primary Super Admin role (no complex RBAC for v1)
* Power‑user internal tool, but usable by non‑technical managers


Functional Areas to Consider (Non‑Exhaustive)
The Super Admin Panel must support both operations and management visibility, including:

* 
Hotel lifecycle management

New hotel onboarding
Renewals
Active / inactive status


* 
Subscription & plans

Hotel subscription plans

Standard plan (limited languages per kiosk)
Advanced plan (more languages)


Plan validity, renewals, upgrades


* 
Payments & contracts

Payment status (pending, failed, successful)
Annual Maintenance Contracts (AMC)
Subscription billing visibility (high‑level)


* 
Kiosk & AI usage oversight

Kiosks as physical hardware units
AI usage metrics (high‑level, management‑friendly)
Language usage across kiosks


* 
User & access management

Basic internal and hotel‑side user visibility (minimal)


* 
Reports & analytics (Management‑friendly)

Monthly trends
AI usage summaries
Language distribution
Revenue‑related summaries
Geographic views (India heat map, city‑level reports)
Top hotels (by usage or revenue)




These reports are for internal ATC decision‑making, not hotel operations.


Deliverables
1️⃣ Core Modules
Identify all core Super Admin modules required in v1.
For each module:

* Purpose
* Primary user (Ops vs Management)
* Why it belongs in the Super Admin panel


2️⃣ Screen & Component Breakdown
For each module:

* Key screens/sub‑pages
* Essential UI components only
(tables, filters, charts, forms, status indicators)


3️⃣ Navigation Structure
Design a navigation system that:

* Separates Operational vs Management / Reports concerns
* Is intuitive for non‑technical leadership
* Avoids clutter and deep nesting


4️⃣ Reporting Philosophy (Important)
Design reports that are:

* High‑signal, low‑noise
* Understandable without technical context
* Focused on business health, not raw system telemetry

Avoid vanity dashboards.

Design Philosophy

* MVP‑first, but not amateur
* Operational clarity over visual flash
* Simple tables and charts beat complex dashboards
* If a feature does not clearly help ATC operate, bill, or evaluate hotels, exclude it


Output Style

* Structured
* Clear headings
* Concise, precise explanations
* No filler
* No assumptions beyond what’s stated