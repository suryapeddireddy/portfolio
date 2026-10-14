# UI & Design Context

## Reference Aesthetic
- Primary Reference: https://www.radnaabazar.com/en (Aceternity UI / Bento Grid Dark Mode)
- Visual Style: "Futuristic Command Deck" — dark-slate surfaces, 1px subtle borders, neon accents, high contrast.

## Design Tokens (`src/app/globals.css`)
- Base Page Background: `#030712` (`.bg-command-grid`)
- Surface Cards: Deep Cyber-Slate `#0B0F17` (`.deck-card`)
- Border Color: `#1E293B` (hover: `rgba(6, 182, 212, 0.4)`)
- Accent Cyan: `#06B6D4` (handles, metric values, interactive links)
- Accent Mint: `#10B981` (live status badges, success indicators)
- Accent Amber: `#F59E0B` (pedigree, JEE rank, highlights)
- Text Primary: `#F8FAFC`
- Text Muted: `#94A3B8`

## Typography
- Headers & Body: Inter / System UI
- Badges, Metrics & Code Tags: JetBrains Mono / `font-mono`

## Micro-Interactions
- Framer Motion for slide-over drawer transitions.
- Native CSS hover glows on `.deck-card` elements.