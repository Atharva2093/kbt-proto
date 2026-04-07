# kbt-proto
# ThermalWall AI Prototype

ThermalWall AI is a Next.js prototype for energy-efficient composite wall design. The app walks through the full workflow from a marketing landing page to thermal analysis, AI optimization, materials planning, procurement, reporting, and settings.

## What This Repo Has

### Landing Experience
- A branded homepage for ThermalWall AI with a hero section, value proposition, and calls to action.
- A challenges section that explains the problems the product solves: complexity, time cost, and energy waste.
- A simple four-step workflow showing the path from wall data entry to procurement.
- A benefits section focused on heat-loss reduction, energy savings, and decision automation.
- A footer and top navigation for quick access to the dashboard demo.

### Dashboard Shell
- A responsive dashboard layout with a left sidebar on desktop and a slide-out drawer on mobile.
- Navigation to Dashboard, Thermal Analysis, Optimization Engine, Material List, Procurement, Reports, and Settings.
- A top bar with project switching, notifications, and user/profile menus.
- A persistent “Back to Home” action.

### Dashboard Overview
- KPI cards for active projects, last heat loss, average energy savings, and estimated material cost.
- A “New Project” dialog for entering project name, building type, climate zone, and wall area.
- A recent projects table with status badges and an open-action shortcut into thermal analysis.

### Thermal Analysis
- Project information inputs for project name, climate zone, and wall area.
- Editable wall-layer stack with add/remove controls.
- Layer inputs for material name, conductivity, density, and thickness.
- Boundary condition inputs for inside and outside temperature.
- A thermal chart showing temperature distribution across wall thickness.
- Result cards for heat loss, U-value, and efficiency.
- A CTA that moves into the optimization flow after analysis is run.

### Optimization Engine
- An AI-generated optimized wall assembly with recommended layers and rationales.
- Performance improvements for heat-loss reduction, energy savings, and insulation rating.
- Navigation to material generation or back to analysis.

### Material List
- A bill-of-materials table for the optimized wall design.
- Quantity, unit cost, and total cost per material layer.
- A computed total material cost summary.
- Estimated annual savings and payback period.
- Actions to download a report or send the list to procurement.

### Procurement
- A procurement stepper showing the order flow from design to confirmation.
- Supplier listings with availability badges, unit prices, and adjustable quantities.
- Add-to-cart actions for each material.
- A cart summary with subtotal, shipping estimate, and grand total.
- A disabled checkout button until items are added.

### Reports
- A project overview panel with project metadata and wall area context.
- Temperature distribution charts and monthly energy cost comparison charts.
- A visual wall-layer diagram.
- Summary metrics for heat-loss reduction, annual energy savings, and total material cost.
- Share and download actions for the engineering report.

### Settings
- Profile controls for name, email, and company.
- Notification toggles for email, analysis completion, procurement updates, and weekly reports.
- Regional settings for temperature units, measurement system, and currency.
- Security actions for password changes and two-factor auth.
- Subscription information and account deletion controls.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI-based component primitives
- shadcn-style component set in `components/ui`
- Recharts for analysis and report visualizations
- `next-themes` for theme support
- Vercel Analytics

## Project Structure

- `app/page.tsx` - landing page
- `app/layout.tsx` - root layout and metadata
- `app/dashboard/layout.tsx` - dashboard shell
- `app/dashboard/page.tsx` - overview dashboard
- `app/dashboard/thermal-analysis/page.tsx` - thermal simulation workspace
- `app/dashboard/optimization/page.tsx` - AI optimization results
- `app/dashboard/materials/page.tsx` - material and cost breakdown
- `app/dashboard/procurement/page.tsx` - supplier and cart flow
- `app/dashboard/reports/page.tsx` - engineering report view
- `app/dashboard/settings/page.tsx` - user and app settings
- `components/ui/` - reusable UI primitives
- `components/theme-provider.tsx` - theme wrapper
- `lib/utils.ts` - shared utility helpers
- `app/globals.css` - theme tokens and global styles

## Scripts

- `pnpm dev` - start the development server
- `pnpm build` - build the app for production
- `pnpm start` - run the production build
- `pnpm lint` - run ESLint

## Run Locally

1. Install dependencies:

```bash
pnpm install
```

2. Start the app:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Notes

- This is a prototype/demo app with static sample data and UI interactions, not a full backend-powered product.
- The design system is already wired for dark-themed visual styling and responsive layout behavior.
- The app uses charting and form controls heavily, so most screens are focused on workflow simulation rather than content management.
