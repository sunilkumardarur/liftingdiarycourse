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

## UI Standards

See [`docs/ui.md`](docs/ui.md) for the **full** UI coding standards — read it before writing any UI code.

Key rules:
- **Only Shadcn UI components** (`src/components/ui/`) — no native HTML form elements, no custom UI primitives.
- Apply the **visual design language** (indigo/violet palette, gradient backgrounds, Card/Badge/Table patterns) to **every** page, current and future.
- Before writing UI code: audit every element in every affected file, map each to a Shadcn component, install missing ones via `npx shadcn@latest add`, then write code.
- Update `docs/ui.md` whenever new conventions are established.

### Shadcn components in use

| Component | Used in |
|---|---|
| `Button` | `layout.tsx` (Clerk auth buttons via `asChild`) |
| `Card`, `CardHeader`, `CardTitle`, `CardContent` | `dashboard/page.tsx` (workout cards) |
| `Calendar`, `Popover`, `PopoverTrigger`, `PopoverContent` | `dashboard/DatePicker.tsx` |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `dashboard/page.tsx` (sets table) |
