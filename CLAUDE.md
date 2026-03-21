# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16.2.0** with App Router (`src/app/`)
- **React 19.2.4**
- **TypeScript 5** — strict mode, path alias `@/*` → `src/*`
- **Tailwind CSS v4** — configured via CSS (`@import "tailwindcss"` in `globals.css`), no `tailwind.config.*` file
- **ESLint 9** with flat config (`eslint.config.mjs`)

## Architecture

Uses the Next.js App Router under `src/app/`. All routes, layouts, and pages live there. The project is a fresh scaffold — no database, auth, or business logic has been added yet.
