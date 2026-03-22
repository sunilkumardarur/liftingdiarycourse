# UI Coding Standards

## Component Library

**All UI components must use [Shadcn UI](https://ui.shadcn.com/) exclusively.**

- Do **not** create custom UI components (buttons, inputs, dialogs, cards, etc.)
- Do **not** use any other component library (MUI, Radix primitives directly, Headless UI, etc.)
- Shadcn UI components live in `src/components/ui/` — add new ones via the CLI:

```bash
npx shadcn@latest add <component-name>
```

## Styling

- Use Tailwind CSS utility classes for layout, spacing, and visual decoration (gradients, shadows, colours).
- Do not write custom CSS classes — use Tailwind utilities and Shadcn's CSS variable system instead.
- Theme customisation goes in `src/app/globals.css` via CSS variables (Shadcn's default theming approach).

## Structure

| Path | Purpose |
|---|---|
| `src/components/ui/` | Shadcn UI components (auto-generated, do not hand-edit) |
| `src/app/**/` | Page-level files that compose Shadcn components |

## Visual Design Language

These standards apply to **all** current and future pages.

### Colour palette

The app uses an **indigo/violet** primary accent defined in `globals.css`:

| Token | Usage |
|---|---|
| `primary` | Buttons, links, selected states, icon backgrounds |
| `primary/5` – `primary/10` | Card tint backgrounds |
| `violet-500` | Secondary accent (stats, gradients) |
| `emerald-500` | Positive/duration stats |

Muscle group badge colours are defined per-group in the dashboard (see `dashboard/page.tsx`).

### Page backgrounds

Every page uses a subtle gradient background to give depth:

```tsx
className="bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30"
```

### Header / navigation

- Sticky, blurred, `bg-background/80 backdrop-blur-sm`
- Brand logo: small coloured square (`bg-primary`) with initials + app name
- Auth buttons use Shadcn `Button` with `asChild` wrapping Clerk components

### Page headers (within pages)

- Icon: `w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-md`
- Title: `text-2xl font-bold tracking-tight`
- Subtitle: `text-sm text-muted-foreground`
- Followed by a `<Separator />`

### Cards

- Use `Card`, `CardHeader`, `CardContent`, `CardTitle` from Shadcn — never raw `<div>` with border classes
- Stat cards: `bg-gradient-to-br from-{color}/5 to-{color}/10 border-{color}/20 shadow-sm`
- Section cards: `shadow-sm overflow-hidden`
- Card headers with light gradient: `bg-gradient-to-r from-primary/5 to-violet-500/5 border-b`
- Empty state cards: `border-dashed border-2 shadow-none bg-transparent`

### Badges

- Use `Badge` from Shadcn for all tags, labels, set types, and muscle groups
- Muscle groups: coloured `variant="outline"` badge with per-group bg/text/border colours
- Set types: coloured `variant="secondary"` badge
- Metadata (time, duration): `variant="secondary"` with `font-normal`

### Calendar

- Use Shadcn `Calendar` component — never a native `<input type="date">`
- For date navigation (not a picker trigger), render inline with `captionLayout="dropdown"` inside a `Card`
- Wrap in a left sidebar panel: `w-72 border-r bg-background/60 backdrop-blur-sm`

### Tables

- Use `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- Header row: `bg-muted/40 hover:bg-muted/40` with `h-8 text-xs` head cells
- Never use raw `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>`

### Layouts

- Two-column dashboard: left sidebar (`w-72 shrink-0`) + scrollable main (`flex-1`)
- Page wraps: `flex flex-col` with gradient background on the outermost element
- Consistent padding: `p-6` for main content areas, `p-4` for side panels

### Dark mode

- All pages must support dark mode. Use `dark:` variants alongside light classes everywhere colour is applied.
- Theme is toggled via `ThemeToggle` component (Sun/Moon button) in the header — powered by `next-themes`.
- Background: always pair `from-slate-50 via-indigo-50/40 to-violet-50/30` with `dark:from-slate-950 dark:via-indigo-950/30 dark:to-violet-950/20`.
- Coloured badges must include `dark:bg-*/30 dark:text-*-300` variants.

### Expand / collapse patterns

- Do not show all details by default — use a "Show Details" / "Hide Details" `Button` toggle.
- Collapsible sections are implemented as client components with `useState`.

### DB durations

- All durations are stored in **seconds** in the database. Display formatted as `Xh Ym` or `Ym` using the shared `formatDuration(seconds)` helper.

## Rules Summary

1. **Only Shadcn UI components** — no custom-built UI primitives, no native form elements.
2. Add components via `npx shadcn@latest add`, never by hand-writing files in `src/components/ui/`.
3. Apply the visual design language (gradients, cards, badges, colour palette) to **every** page — new and existing.
4. Before writing UI code: audit every element in every affected file, map each to a Shadcn component, install them all, then write code.
5. Keep this document updated whenever new conventions are established or exceptions are approved.

## Shadcn components in use

| Component | Used in |
|---|---|
| `Button` | `layout.tsx`, `page.tsx` (Clerk auth via `asChild`) |
| `Badge` | `dashboard/page.tsx` (muscle groups, set types, metadata) |
| `Card`, `CardHeader`, `CardTitle`, `CardContent` | `dashboard/page.tsx`, all pages |
| `Calendar` | `dashboard/DatePicker.tsx` (inline month view) |
| `Separator` | `dashboard/page.tsx`, `page.tsx` |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `dashboard/page.tsx` |
