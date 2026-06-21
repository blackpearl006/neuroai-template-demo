# Layout Studio — design notes & decision

> Captured from a late-night idea: *"an interactive layout planner inside the
> website — switch between device frames (iPhone / iPad / Mac / big display),
> drag-drop sections and elements (brain renders, tables, headings, grids),
> resize the hero, add comments, then download a layout and drop it in the repo.
> Like Figma / Excalidraw. Is it hard? Separate? Good addition?"*

## Short answer

It's a **great** idea, and a **scoped** version fits this template beautifully —
because the site is already **config-driven** (`src/site.config.js` lists ordered,
toggleable `sections`). A visual editor that reads and writes that config is the
natural, low-risk realization. The **full freeform Figma/Excalidraw canvas** (drag
anything anywhere, resize hero width by hand, comments, arbitrary nesting) is a
different paradigm and a separate, much larger project. Recommendation: **build the
scoped "Layout Studio" here**; **defer the freeform builder** to its own project.

## Why scoped beats freeform (for this template)

The site renders **React section components** stacked vertically, styled with
Tailwind and centered in `max-w-wide`. It is intentionally *not* an
absolute-positioned canvas. A freeform "place this 400px box here" builder would:

- fight the responsive, flow-based layout (what does "drag hero wider" mean at 375px vs 2560px?),
- require a second rendering engine + serialization format + collision/snapping logic,
- need its own export→codegen that emits arbitrary JSX (fragile, hard to keep on-brand),
- and add comments/collaboration (a whole backend) — well beyond a static GH-Pages template.

That's weeks of work and a maintenance burden that doesn't serve the "researcher
ships a clean paper site" goal. Excalidraw/Figma already exist for free-form mockups.

A **config editor**, by contrast, is days of work, reuses everything we built, and
stays perfectly on-brand because it can only compose blocks the template already
renders well.

## The scoped "Layout Studio" (what I'm building)

A `/studio` view (opened with `?studio=1`, never shipped in the published site) that:

1. **Device frame switcher** — preview the live site inside iPhone / iPad / Mac /
   4K frames (just a width-constrained iframe of the real site; 4 presets, as you said).
   This alone is hugely useful for the "works on every screen" goal.
2. **Section manager (drag to reorder, toggle on/off)** — a sidebar listing the
   `sections` from config; drag to reorder, switch on/off, set the nav label.
   Live-updates the preview.
3. **Theme + font + scale pickers** — reuse `AppearanceControls`; see the whole site
   re-skin instantly.
4. **Block palette (phase 2)** — a searchable list of insertable blocks (Heading,
   Prose, BrainRenderer, BrainGrid, DataTable, CompareSlider, MediaEmbed, Math,
   CodeBlock, 2-col grid). Drag into the order; configure minimal props inline.
5. **Export** — a "Copy / Download `site.config` snippet" button. The user pastes the
   `sections` (and any block definitions) into `src/site.config.js`, commits, done.
   No server, no auth — pure client-side, matches GH-Pages.

### Why export-as-config (not a binary download) is the right "download"
The artifact is just JSON/JS text. "Download" = copy to clipboard or save a
`site.config.layout.js`. Dropping it in the repo = paste into `site.config.js`. That
keeps everything diffable, reviewable, and agent-editable — and avoids a brittle
"import my .figma file" step.

### Comments?
Skipped for v1 — comments imply persistence/collaboration (backend). If wanted later,
the lightweight path is per-block `note:` strings in the config (visible only in
Studio), no backend. Noted, not built.

## Effort estimate

| Piece | Effort | Risk |
|---|---|---|
| Device frame switcher | ~0.5 day | low |
| Section reorder/toggle + live preview | ~1 day | low |
| Theme/font/scale (reuse) | ~0 | none |
| Export config snippet | ~0.5 day | low |
| Block palette + per-block props (phase 2) | ~2–3 days | medium |
| Freeform canvas + comments (NOT here) | weeks | high |

## Status: v1 shipped ✅

Open **`?studio=1`**. Implemented in `src/components/Studio.jsx` (lazy-loaded, dev-only):
device frame switcher (iPhone/iPad/Mac/4K) previewing the live site in an iframe,
demo/minimal toggle, section reorder + on/off, live theme/font pickers, and
Copy/Download of a `site.config` snippet. Theme/font preview is live; section
changes apply once you paste the exported snippet into `src/site.config.js`.

## Decision

- **Built (v1):** device switcher + section manager + appearance + export — a dev-only
  `?studio=1` view that never bloats the published page.
- **Phase 2 (nice-to-have):** block palette for inserting/arranging content blocks;
  inject planner edits into the preview live (config-override via context) so section
  changes preview without export.
- **Out of scope (separate project):** freeform Figma-style canvas, hand-resizing,
  real-time comments/collaboration. If you want that, it's its own repo — I'd
  recommend wrapping Excalidraw or building on `dnd-kit` + a canvas, with a backend
  for comments.

This keeps the template focused and shippable while still giving you the
"interactively plan your layout, then drop it in the repo" magic you described.
