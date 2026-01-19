# Project: ATC Super Admin Panel (MVP)

## 1. Product Context
We are building a B2B V1 Super Admin Panel for "Aarkay Techno Consultants" (ATC).
ATC sells physical self check-in kiosks to hotels in India.
Consumers of this app are ATC internal staff (Ops & Management).

## 2. Technical Stack
- Framework: Next.js 14+ (App Router)
- Language: TypeScript (Strict mode)
- Styling: Tailwind CSS
- Icons: Lucide React
- Components: Shadcn/UI style (Radix UI primitives + Tailwind)
- State: React Server Components (RSC) where possible, Client components for interaction.

## 3. Design Philosophy ("The Vibe")
- **Clean & Dense:** This is a power-user tool. Avoid whitespace padding meant for marketing sites.
- **Operational:** Statuses (Online/Offline/Active) should be high-contrast badges.
- **Navigation:** Left vertical sidebar. Fixed header.
- **Color Palette:**
  - Primary: Slate-900 (Corporate)
  - Success: Emerald-600 (Revenue/Online)
  - Warning: Amber-500 (Checkups)
  - Error: Rose-600 (Offline/Churned)

## 4. Core Features to Scaffold
1.  **Sidebar Shell:** A persistent layout with links to Dashboard, Hotels, Fleet, Finance.
2.  **Dashboard:** KPI Cards (Total Hotels, Active Kiosks) and a Recent Activity feed.
3.  **Hotel Registry:** A data table listing hotels with status badges.
4.  **Kiosk Fleet:** A view showing physical hardware status (Online vs Offline).

## 5. Constraints
- NO Backend. Use the `mock-data.ts` file provided.
- NO Auth (Mock the logged-in user state).
- Use clearly defined interfaces from `types/schema.ts`.    