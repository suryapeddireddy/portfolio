# Progress Tracker

## Current Phase
- Phase 3: Browser-local Admin Dashboard

## Active Goal
- Completed browser-local admin editing; production authentication and shared publishing remain future work.

## Completed
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
- Add server authentication and a shared data store if the CMS needs production publishing across devices.
