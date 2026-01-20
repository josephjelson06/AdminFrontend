atc-admin-panel/
├── app/                        # Next.js App Router (Pages & Layouts)
│   ├── layout.tsx              # Root layout (Html/Body)
│   ├── page.tsx                # Dashboard (Home)
│   ├── hotels/                 # /hotels route
│   │   ├── page.tsx            # Hotel List Page
│   │   └── [id]/page.tsx       # Hotel Details Page
│   ├── fleet/                  # /fleet route
│   │   └── page.tsx            # Kiosk Fleet Page
│   ├── finance/                # /finance route
│   └── reports/                # /reports route
│
├── components/                 # Shared / Global UI Components
│   ├── ui/                     # Primitives (Buttons, Cards, Inputs - Shadcn-like)
│   ├── layout/                 # Sidebar, Header, PageShell
│   └── visual/                 # Charts, StatusBadges
│
├── features/                   # Domain-Specific Logic & Components
│   ├── hotels/
│   │   ├── components/         # HotelTable, HotelForm, HotelStatusBadge
│   │   └── types.ts            # Hotel-specific interfaces
│   ├── fleet/
│   │   ├── components/         # KioskTable, KioskHealthIndicator
│   │   └── types.ts            # Kiosk-specific interfaces
│   └── analytics/
│       ├── components/         # UsageChart, HeatMap
│       └── types.ts
│
├── lib/                        # Utilities & Constants
│   ├── utils.ts                # Helper functions (date formatting, cn)
│   ├── constants.ts            # Navigation links, config
│   └── mock-data.ts            # ❌ NO BACKEND - Mock JSON data lives here
│
└── types/                      # Global / Shared Types
    └── index.ts