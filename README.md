# ATC Super Admin Panel (MVP)

A professional B2B Super Admin Dashboard built for **Aarkay Techno Consultants (ATC)**. This panel is designed for internal staff to manage and monitor physical self check-in kiosks deployed at various hotel locations across India.

## 🚀 Technical Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Components:** Custom Radix-based UI components (Shadcn style)

## ✨ Key Features

- **Dashboard:** Real-time KPI cards (Total Hotels, Active Kiosks) and operational activity feeds.
- **Hotel Registry:** Comprehensive data table for managing hotel listings with high-contrast status badges.
- **Kiosk Fleet:** Hardware monitoring view to track physical kiosk health (Online vs. Offline).
- **Finance & Reports:** Data visualization and reporting for operational oversight.
- **Global Search:** Quick access to hotels, kiosks, and settings.
- **Onboarding Wizard:** Multi-step workflow for registering new hotels and users.

## 🎨 Design Philosophy

- **Clean & Dense:** Focused on utility and data density for power users.
- **Operational:** Statuses are clearly demarcated with corporate-standard color palettes.
- **Responsive:** Optimized for desktop management with a persistent sidebar layout.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Implementation Details

- **Mock Data:** This version (V1) is a frontend-only MVP. All data is served from `lib/mock-data.ts`.
- **No Backend:** No external API calls are made. 
- **Type Safety:** All data models are strictly typed in `types/schema.ts`.

---

*Built by Aarkay Techno Consultants.*
