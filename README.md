# P. Surya — Futuristic Command Deck Portfolio

[![Next.js 15](https://img.shields.io/badge/Next.js-15_(App_Router)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Active_Development-10B981?style=for-the-badge)](https://github.com/suryapeddireddy/portfolio)

A high-performance, single-page developer portfolio and system command deck built for **P. Surya** (Peddireddy Suryaprakash Reddy) — Mining Engineering graduate from **IIT Kharagpur** transitioning toward **Computational Science, High-Performance Computing (HPC), and Parallel Systems**.

Inspired by modern dark-mode developer tools and Bento Grid interfaces ([radnaabazar.com](https://www.radnaabazar.com/en)), this application showcases competitive programming benchmarks, OpenMP parallel solvers, cache-optimized C++ engines, and operational field engineering experience.

---

## ⚡ Core Technical Identity & Metrics

- **Pedigree:** B.Tech (Honours) in Mining Engineering, **IIT Kharagpur** (2025)
- **Competitive Programming:** LeetCode Peak Rating **1874** (1,500+ Algorithmic Problems Solved)
- **Competitive Benchmarks:** JEE Advanced All India Rank **8000**
- **Core Focus Areas:** High-Performance Computing (HPC), Parallel Algorithms, OpenMP Multithreading, C++17/20 Systems Programming, Numerical Linear Algebra, and Spatial Indexing.

---

## 🛠️ Tech Stack & System Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, React 19) |
| **Styling** | Tailwind CSS v4 (`@import "tailwindcss";` syntax) |
| **Icons & Micro-UI** | Lucide React (`lucide-react`) |
| **Animations** | Framer Motion (`framer-motion`) — 60fps micro-interactions |
| **Language** | TypeScript (Strict mode enabled) |
| **Development** | Spec-Driven Agentic Engineering Workflow (`.context/` system) |

---

## 🤖 Agentic Engineering Architecture

This repository uses a **Context-Driven / Spec-Driven AI Engineering Workflow**. 

All architectural guardrails, design tokens, data models, and coding standards are defined in a root-level `.context/` system. Local AI agents (Cursor, Copilot, Claude Code, or Codex) execute against these strict specifications to guarantee zero component hallucination, zero hydration bugs, and zero performance bloat.

```text
surya-portfolio/
├── .context/                # Agent System Guardrails & Specs
│   ├── AGENTS.md            # System prompt execution rules
│   ├── ARCHITECTURE.md      # Next.js App Router boundaries & contracts
│   ├── CODE_STANDARDS.md    # TypeScript interfaces & React rules
│   ├── DESIGN_SYSTEM.md     # Obsidian dark mode tokens & layout specs
│   ├── progress-tracker.md  # Implementation state & session log
│   ├── project-overview.md  # Product goals & candidate credentials
│   └── ui-context.md        # Color palettes, typography & Aceternity refs
├── src/
│   ├── app/                 # Next.js App Router pages & CSS
│   ├── components/          # Self-contained UI presentation components
│   ├── data/                # Typed single source of truth (`portfolioData.ts`)
│   └── types/               # TypeScript contracts (`index.ts`)
└── README.md