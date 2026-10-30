# Progress Tracker

## Current Phase
- Phase 4: Supabase project publishing

## Active Goal
- Supabase project fetching and CRUD implemented; live database verification awaits the required environment configuration. Profile and metrics remain browser-local; production authentication remains future work.

## Completed

- [x] Experience Management (2026-10-30): added the Experience Manager admin tab with role, organization, period, location, newline-separated highlights, comma-separated domain tags, editing, confirmed deletion, pending controls, and success/error alerts. Added optional experience IDs, typed Supabase fetch/upsert/delete helpers, and a shared dynamic timeline backed by `surya_portfolio_data_v1`. Older browser data migrates without losing profile, project, or metric edits; missing configuration permits browser-local CRUD, and failed reads retain cached/static fallback entries. Successful empty database results remain empty.
- Experience verification (2026-10-30): `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed. Read-only live REST queries verified `experiences` columns `id`, `role`, `organization`, `period`, `location`, `highlights`, and `domain_tags`; no rows were visible through the configured public key. Helpers map `domain_tags` to frontend `tags`; the existing frontend-only `type` is not written because the database has no such column. Live writes/deletes and browser interactions have not been tested; database write permissions remain dependent on the existing RLS configuration.
- [x] Final Responsive Polish & Production Build Verification (2026-10-20): updated root SEO/Open Graph metadata for P. Surya, IIT Kharagpur, and C++ HPC/systems; made project filters and cards responsive; refined the terminal control and modal layout. Validation passed with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- [x] Supabase integration (2026-10-19): added typed `src/lib/supabase.ts`, shared row conversion for `performance_gain`, `github_url`, `demo_url`, and flat `problem`/`solution` columns. `ProjectBento` fetches on mount with static portfolio fallback on failure; a successful empty result remains empty. `/admin` keeps its thin page wrapper and performs database loading, upsert, and confirmed deletion in `AdminDashboard.tsx`, with pending controls, success/error feedback, and editable project URLs. Missing configuration preserves static rendering and reports admin errors.
- Supabase verification: TypeScript, ESLint, and production build passed. Live read query could not run because the required public environment variables were not both available; no live mutations were attempted. Table columns and existing RLS permissions remain unverified. Expected table shape is documented by `ProjectRow` in `src/lib/supabase.ts`. Existing client passcode is only a UI gate; database write authorization must be enforced by Supabase RLS.
- [x] Resume PDF Integration: HeroDeck view/download actions and terminal `cv`/`resume` commands link to `/scientific_computing_CV.pdf`; commands automatically open a new tab and log a direct link. PDF asset still needs to be supplied at `public/scientific_computing_CV.pdf`.
- Resume integration validation (2026-10-18): TypeScript, ESLint, and production build passed. Browser interaction checks have not been run.
- [x] Terminal Command Palette: global Cmd/Ctrl + K shortcut, floating trigger, animated accessible terminal dialog, help/about/projects/stats/contact/socials/clear commands, and portfolio store integration.
- [x] Admin Dashboard (/admin): terminal-style passcode login, localStorage route gate and logout, profile/bio editor, project CRUD with delete confirmation, and metrics overrides. Browser-local edits persist and appear in HeroDeck and ProjectBento. Default passcode: `surya-admin`; optional build-time `NEXT_PUBLIC_ADMIN_PASSCODE` override. Client-side gate only, with no server authentication or shared CMS database.
- [x] Completed `EducationDeck.tsx` with the numbered education header, IIT Kharagpur highlight card, degree/location/period/CGPA details, and responsive four-category coursework matrix; rendered directly below `Timeline`. Preserved the existing exported `EducationItem` and `educationData`, and made data model imports type-only.
- [x] Completed `Timeline.tsx` with a vertical experience timeline, deck-card surfaces, role and organization headings, period badges, locations, highlights, and domain tags; rendered below `ProjectBento` on the root page.
- [x] Completed `ProjectBento.tsx` with cyan category filter pills, date/category badges, titles, taglines, summaries, tech pills, system specification buttons, GitHub icons, and empty states.
- [x] Completed `ProjectDrawer.tsx` with Framer Motion slide-over transitions, title/tagline/category header, architecture details, optional performance badge and external links, native dialog focus handling, Escape/backdrop dismissal, scroll locking, and reduced-motion support.
- [x] Added data-driven `HeroDeck.tsx` and rendered `ProjectBento` beneath it on the root page.
- [x] Exposed existing `src/app/data` and `src/app/types` through the specified `src/data` and `src/types` import paths without duplicating data.
- [x] Next.js 15 (App Router) + Tailwind CSS v4 project scaffold
- [x] Installed `lucide-react` and `framer-motion`
- [x] Defined TypeScript data models (`src/types/index.ts`)
- [x] Created CV-accurate mock data store (`src/data/portfolioData.ts`)
- [x] Created root `.context/` agent system documentation

## In Progress
- Validation: `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed on 2026-10-17. Storage behavior checks passed for auth/logout, profile and metric persistence, project add/delete, malformed data recovery, and blocked storage. HTTP smoke checks passed for `/`, `/admin`, and `/admin/login`; browser interaction and visual checks have not been run.
- [x] `src/components/HeroDeck.tsx` execution pass
- [x] Root page assembly (`src/app/page.tsx`)

## Next Up
- Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, verify the `projects` schema against `ProjectRow`, and validate database reads/upserts/deletes with the intended RLS policies.
- Replace the browser-local admin gate with production authentication before enabling privileged database writes.
