Here is the comprehensive logic and structural design for the ATC Super Admin Panel v1.
1️⃣ Core Modules
These modules represent the high-level buckets of functionality required to operate the business and manage the platform.
ModulePurposePrimary UserWhy it allows ATC to operateDashboard (Command Center)Instant visibility into system health, daily activity, and critical alerts.Joint (Ops & Mgmt)Provides a "pulse check" without digging into tables.Hotel RegistryThe central database of all clients. Handles onboarding, status (Active/Suspended/Churned), and profile details.Ops (Execution)  Mgmt (Visibility)ATC cannot bill or service a client without a unified record of the hotel entity.Kiosk FleetInventory management of physical hardware units and their association with hotels.OpsSeparates the physical asset from the hotel account. Essential for tracking deployment and maintenance.Billing & ContractsManagement of Subscriptions, Annual Maintenance Contracts (AMC), invoices, and payment statuses.Mgmt (Finance/Sales)Vital for revenue assurance. Tracks who owes money and upgrade opportunities.Business Intelligence (Reports)High-level analytics on usage, language adoption, geography, and top performers.Mgmtdemonstrative ROI for sales and strategic planning for leadership.Admin SettingsInternal user management (ATC staff) and global configuration.OpsMinimum requirement to secure the panel and manage staff access.

2️⃣ Screen & Component Breakdown
A. Dashboard (Command Center)

* Key Screens: Single Overview Page.
* UI Components:

KPI Cards: Total Active Hotels, Active Kiosks, Revenue MTD (Month-to-Date), Total Check-ins Today.
Alert Feed: "Hardware Offline > 24hrs," "Payment Overdue," "Contract Expiring < 15 days."
Mini-Chart: 7-Day Trend of Check-in Volume (AI Usage).



B. Hotel Registry

* Key Screens: Hotel List View, Hotel Detail View, "Onboard New Hotel" Wizard.
* UI Components:

Data Table: Sortable columns (Hotel Name, City, Tier, Status, Implementation Date).
Status Badges: Color-coded (🟢 Active, 🟡 Onboarding, 🔴 Suspended, ⚫ Churned).
Tabbed Detail Panel:

Overview: Contact info, GSTIN, Address.
Kiosks: List of assigned hardware serial numbers.
Plan: Current subscription details.


Action Menu: "Suspend Service," "Edit Details," "Reset Admin Password."



C. Kiosk Fleet

* Key Screens: Global Fleet List, Unassigned Inventory.
* UI Components:

Filters: Filter by Status (Online/Offline), Hardware Model, Assigned/Unassigned.
Status Indicators:

🟢 Online: Heartbeat received < 5 mins.
🟡 Warning: Heartbeat received < 1 hour.
🔴 Offline: No signal > 1 hour.


Inventory Table: Serial Number, Model, Assigned Hotel, Current Software Version.
Quick Action: "Release from Hotel" (for hardware swaps).



D. Billing & Contracts

* Key Screens: Invoices List, Subscription Overview, AMC Tracker.
* UI Components:

Subscription Table: Hotel Name, Plan (Standard/Advanced), Start Date, Renewal Date.
AMC Status Bar: Visual progress bar showing warranty/contract time remaining per hotel.
Payment Status Flags: "Paid," "Pending," "Overdue" (with days counter).
Revenue Summary Widget: Monthly Recurring Revenue (MRR) calculation.



E. Business Intelligence (Reports)

* Key Screens: Usage Analytics, Geographic Distribution, Leaderboards.
* UI Components:

India Heat Map: Visual density of live kiosks by state/city.
Language Pie Chart: Usage breakdown (e.g., Hindi 40%, English 30%, Tamil 10%, etc.) to justify Advanced Plan value.
Bar Chart: Check-ins per month (Year-over-Year comparison).
Top 10 Table: Hotels with highest check-in volume (identifies power users for upsell).




3️⃣ Navigation Structure
The navigation sidebar is designed to clearly separate the "Business/Money" view from the "Operational/Fix-it" view.
Sidebar Navigation:

1. Dashboard

Overview


2. Operations (Ops Focus)

Hotels (Manage Clients)
Kiosk Fleet (Manage Hardware)
User Access (Manage ATC Staff)


3. Business & Finance (Mgmt Focus)

Subscriptions & AMC
Invoicing Log
Reports & Analytics


4. System

Audit Logs (Read-only security log)
My Profile



UX Interaction Note:

* Top Bar: Global Search (Search by Hotel Name, Serial Number, or City).
* Breadcrumbs: Always visible to ensure easy navigation back from deep pages (e.g., Hotels > Hotel Taj Palace > Kiosk Details).


4️⃣ Reporting Philosophy
The goal for ATC reporting is Business Justification and Operational Health. We avoid "Vanity Metrics" (like raw API hits) in favor of metrics that prove the kiosk saves the hotel money.
1. High-Signal Metrics (Include these):

* Self Check-in Rate: What % of hotel guests used the kiosk vs. the front desk? Why: This proves the ROI of the product to the hotel.
* Voice AI Engagement: Average duration of voice interaction. Why: Shows if the AI is actually helpful or if users are struggling.
* Language Diversity: Count of non-English interactions. Why: Justifies selling the "Advanced Plan" with regional language support.
* Renewal Risk: List of hotels with low usage in the last 30 days. Why: Proactive churn prevention.

2. Low-Noise Design:

* Filters first: All report pages open with a date-range picker and a "Region/City" filter. Management usually wants to know "How is Mumbai doing?" not how the whole world is doing.
* Plain English Labels: Use "Guests Checked In" instead of "Session_Success_Count".
* Exportable: All tables must have a "Download CSV" button for Finance teams who want to manipulate data in Excel.

3. The "No-Go" Zone (Exclude these for V1):

* Real-time voice stream logs (Privacy/Compliance risk).
* Granular hardware telemetry (CPU temp, RAM usage) – This belongs in a technical DevOps dashboard, not the business admin panel.
* Guest PII (Personally Identifiable Information) – Reports should be aggregated to protect ATC from privacy liabilities.