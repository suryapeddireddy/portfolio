# Progress Tracker

## Current Phase
- Phase 4: Supabase project publishing

## Active Goal
- Supabase project fetching and CRUD implemented; live database verification awaits the required environment configuration. Profile and metrics remain browser-local; production authentication remains future work.

## Completed

- [x] Resume session reuse (2026-10-30): removed Resume Manager's email/password form, credential state, and password sign-in. Upload/delete helpers call `supabase.auth.getSession()` and use the shared authenticated Storage client. The manager observes auth changes, disables mutations without a session, and retains the PDF input, Upload Resume button, live link, and confirmed Delete action. AdminDashboard already renders this component, so its wrapper needed no change.
- Session reuse verification: `npx tsc --noEmit` and `git diff --check` passed. The initial sandboxed TypeScript command failed with a Node filesystem EPERM; the approved run outside the sandbox passed. Browser interactions and authenticated live uploads/deletes remain untested because no browser session is available. This checkout's AdminLogin still uses a local passcode and has no GitHub OAuth implementation; the manager reuses a Supabase session when present, but the local passcode alone cannot provide one. Current Supabase session/Storage documentation was reviewed; the changelog fetch was unavailable.

- [x] Resume Manager (2026-10-30): added validated local PDF uploads (PDF header, extension/MIME, nonempty, 6 MB limit), replacement of `resumes/resume.pdf`, live preview link, confirmed deletion, and pending/success/error feedback. Added the three requested Supabase storage helpers and a dynamic public resume hook; Hero view/download actions and terminal `cv`/`resume` commands now resolve uploaded CVs with the existing static PDF fallback. URLs include a version query and uploads use zero cache duration.
- Resume verification: `npm run build`, `npm run lint`, and `git diff --check` passed. A read-only live Storage HTTP listing returned 200 with no visible resume objects; this does not establish bucket existence or write permissions. The static PDF exists. Browser interactions and live uploads/deletions have not been tested. The SDK-only probe hit the installed SDK's native WebSocket requirement on Node 20; the HTTP probe succeeded instead.
- Resume setup: apply `.context/resume-storage-setup.sql` in the Supabase SQL editor if needed. The revised script replaces the old custom-claim policies with authenticated SELECT/INSERT/UPDATE/DELETE access scoped to `resumes/resume.pdf`; no separate storage account is required. SQL has not been applied by this session.

- [x] Structured experience dates (2026-10-30): added start/end month and year inputs, a current-role checkbox, required date and range validation, snake_case database mappings, and structured localStorage persistence. Current roles sort first, then entries sort by descending start year/month in the manager and timeline. Period badges are generated from dates; recognized legacy periods migrate on read and unknown legacy text remains visible. Starter entries now use structured dates. Restored missing experience Supabase CRUD exports, retaining the documented `domain_tags` database mapping.
- Structured date verification: `npm run build` (including TypeScript) and `npm run lint` passed. Targeted sorting, formatting, and legacy migration checks passed. Live read verification could not connect from this environment; live writes and browser interactions were not tested. Apply `.context/experience-date-columns.sql` in the Supabase SQL editor before saving structured dates remotely; schema changes have not been applied by this session.

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
