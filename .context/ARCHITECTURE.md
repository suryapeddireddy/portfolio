# System Architecture Context

## Technical Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript (Strict Mode)
- Styling: Tailwind CSS v4 (`@import "tailwindcss";` syntax)
- Icons: Lucide React (`lucide-react`)
- Micro-Animations: Framer Motion (`framer-motion`)

## System Boundaries & Directory Layout
- `src/app/` — Next.js App Router pages and global layout
- `src/components/` — UI presentation components (`HeroDeck`, `ProjectBento`, `ProjectDrawer`, `Timeline`)
- `src/types/` — TypeScript data interfaces (`Category`, `Project`, `Metric`, `ProfileConfig`)
- `src/data/` — Static portfolio data store (`portfolioData.ts`)