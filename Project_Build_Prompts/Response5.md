Here is the frontend structural design for the ATC Hotel Panel (Client-side).
This panel is designed for the Hotel Manager and staff to manage their specific property’s kiosk operations.

1️⃣ Core Modules
These modules focus on daily property operations and guest processing, distinct from the Super Admin's platform-wide focus.
ModulePurposePrimary UserWhy it belongs in V1Lobby DashboardImmediate view of Kiosk status (Online/Offline) and today's check-in stats.All RolesStaff must know instantly if the kiosk is down or if a VIP checked in.Guest LogSearchable history of all check-ins processed by the kiosk.Front Desk"Did Mr. Sharma check in yet?" - Basic operational necessity.Room StatusSimple view to toggle rooms "Ready" or "Cleaning" (if not fully integrated with PMS).HousekeepingKiosks cannot assign rooms if they are dirty. Ops team needs to update this fast.Kiosk ConfigCustomize visual settings: Logo, Welcome Message, Enabled Languages.ManagerHotels need to brand the experience and control language limits based on their plan.Hotel SettingsProfile management (Address, Contact) and Team Management (Add Staff).ManagerSelf-serve administration to reduce support tickets to ATC.Billing & PlansView subscription validity, Plan limits, and Download Invoices.Manager / FinanceTransparency on when service will expire.

2️⃣ Role-Based Visibility Matrix
The UI adapts based on the logged-in user's role.
RoleDashboardGuest LogRoom StatusKiosk ConfigSettings & TeamBillingHotel ManagerFull ViewManage (Export)ManageManageManageViewFront DeskView OnlyView OnlyManage❌ (Hidden)❌ (Hidden)❌ (Hidden)Housekeeping❌ (Hidden)❌ (Hidden)Manage❌ (Hidden)❌ (Hidden)❌ (Hidden)FinanceView Only❌ (Hidden)❌ (Hidden)❌ (Hidden)❌ (Hidden)View + Download

* View Only: Can see data but cannot edit settings or configurations.
* Manage: Can Create, Edit, Delete, or toggle status.
* Hidden: The menu item does not appear in the sidebar.


3️⃣ Screen & Component Breakdown
A. Lobby Dashboard

* Key Screens: Overview.
* UI Components:

Status Indicators: Large "Traffic Light" cards for Kiosks (🟢 Lobby Kiosk 1: Online).
Counters: Today's Check-ins, Rooms Assigned, Verification Failures (Alert).
Activity Feed: Simple list: "Room 304 - Check-in Success - 2 mins ago."



B. Guest Log

* Key Screens: List View, Guest Detail Modal.
* UI Components:

Search Bar: Search by Guest Name, Booking ID, or Room Number.
Date Filter: "Today," "Yesterday," "Custom Range."
Data Table: Name, Check-in Time, Room #, ID Verification (Verified/Manual), Language Used.
Filters: "Show Failed Check-ins only" (Helps Front Desk identify guests needing help).



C. Room Status (Housekeeping)

* Key Screens: Grid View (Mobile friendly).
* UI Components:

Room Cards: Large, touch-friendly cards showing Room Number.
Color States:

🟩 Green: Ready (Available for Kiosk).
🟨 Amber: Cleaning in Progress.
🟥 Red: Occupied / Dirty.


Action: Tap card to cycle status (Dirty -> Cleaning -> Ready).



D. Kiosk Config

* Key Screens: Appearance, Languages.
* UI Components:

Asset Uploader: "Upload Hotel Logo" (Preview box).
Welcome Message Input: Text area for "Hi, welcome to [Hotel Name]...".
Language Toggles: Checkboxes for Languages (Hindi, English, Tamil).

Constraint Logic: If Plan = Standard, disable checkboxes after 2 languages are selected with a tooltip: "Upgrade to Advanced to unlock more languages."





E. Billing & Plans

* Key Screens: Subscription Status, Invoice History.
* UI Components:

Plan Card: Shows "Standard Plan" badge.
Renewal Date: "Renewing in 45 days."
Invoice Table: Date, Amount, Status (Paid/Pending), Download PDF Icon.




4️⃣ Navigation Structure
Sidebar Layout (Top to Bottom):
1. Operations (Daily Use)

* Dashboard (Home icon)
* Guests (User icon - The Log)
* Rooms (Bed icon - Housekeeping status)

2. Configuration (Setup)

* Kiosk Settings (Monitor icon - Logo, Language)
* My Hotel (Building icon - Address, Profile)
* Team Access (Users icon - Add Front Desk agents)

3. Account (Business)

* Subscription & Billing (Credit Card icon)
* Help & Support (Lifebuoy icon)

User Profile Footer:

* [User Name]
* [Role Badge: Manager]
* Log Out


5️⃣ UX & Design Principles

1. Mobile-First for Ops: The "Room Status" and "Dashboard" modules should be responsive. Front Desk staff often stand or move around; Housekeeping is always mobile.
2. Mistake-Proofing: Critical actions (like disabling a Kiosk or changing the welcome language) should have a gentle confirmation toast or modal.
3. High-Contrast Status: Kiosk "Offline" status should be loud (Red Banner at top of Dashboard). Hotel staff are not technical; they need to know immediately if the machine is broken so they can man the desk manually.
4. No "Tech Speak":

Bad Label: "Device Telemetry"
Good Label: "Kiosk Health"
Bad Label: "User RBAC"
Good Label: "Staff & Permissions"