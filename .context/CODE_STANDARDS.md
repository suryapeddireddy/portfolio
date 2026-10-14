# Code Standards & Implementation Conventions

## TypeScript
- Strict mode throughout. Avoid `any`.
- Export typed interfaces (`Project`, `Metric`, `ProfileConfig`) from `src/types/index.ts`.

## React & Next.js
- Keep route pages (`src/app/page.tsx`) as thin layout containers.
- Move feature logic into self-contained components in `src/components/`.
- Ensure all interactive elements have accessible hover states and aria labels.