// ═════════════════════════════════════════════════════════════════════════
//  ★ THE ONE FILE TO EDIT ★
//  This is the single source of truth for your paper website. A non-coder can
//  adapt the whole site by editing the values below — no component code needed.
//
//  Quick map:
//    identity   → who/what (title, authors, links shown in the hero & footer)
//    meta       → browser tab + social-share cards (SEO)
//    deploy     → GitHub Pages base path
//    theme      → color theme key   (see src/lib/themes.js)
//    fonts      → font theme key     (see src/lib/fonts.js)
//    sections   → which sections show, and in what order
//    taxonomy   → the data dimensions for the ROI-fingerprint explorer
//    content    → the editable text of each section
//
//  Must be PURE DATA (no `window`/`document`) — vite.config.js imports it too.
// ═════════════════════════════════════════════════════════════════════════

const config = {
  // ── Identity ────────────────────────────────────────────────────────────
  identity: {
    title:       "NeuroAI Paper Template",
    titleAccent: "Template",              // word in the title rendered in the accent colour
    tagline:     "A fast, config-driven website template for AI & neuroscience papers. Interactive brain viewers, carousels, galleries, comparison sliders, math and code — all editable from a single file.",
    eyebrow:     "Open-source · Vite + React · GitHub Pages",
    authors:     "Your Name et al.",
    institution: "Your Institution",
    year:        2026,
    repoUrl:     "https://github.com/blackpearl006/neuroai-template-demo",
  },

  // ── Browser tab + social share (Open Graph / Twitter) ────────────────────
  meta: {
    title:       "NeuroAI Paper Template — interactive research website",
    description: "A clean, config-driven template for AI / neuroscience paper websites: brain viewers, carousels, galleries, comparison sliders, math, code and more.",
    ogImage:     "og-image.png",          // lives in /public
    twitter:     "@your_handle",
    url:         "https://blackpearl006.github.io/neuroai-template-demo/",
    lang:        "en",
  },

  // ── Deploy ────────────────────────────────────────────────────────────────
  // "./" (relative) is the robust default: works at a user-site root
  // (https://you.github.io/) AND a project subpath (https://you.github.io/repo/)
  // without changes, because this is a single-page app with no client routing.
  deploy: { basePath: "./" },

  // ── Appearance (see src/lib/themes.js and src/lib/fonts.js) ───────────────
  theme:     "light",      // "light" | "dark" | "gradient"
  fonts:     "editorial",  // "apple" | "editorial" | "modern" | "display"
  fontScale: "md",         // "sm" | "md" | "lg" | "xl"  (readers can also change this live)
  showThemeToggle: true,   // show the live theme/font pickers (artist persona)

  // ── Sections: order + on/off. Drop one by setting enabled:false ───────────
  // `id` matches a section component key in App.jsx; `nav` label feeds the TOC.
  sections: [
    { id: "hero",          nav: null,            enabled: true },
    { id: "abstract",      nav: "Overview",      enabled: true },
    { id: "architecture",  nav: "Architecture",  enabled: true },
    { id: "preprocessing", nav: "Preprocessing", enabled: true },
    { id: "explorer",      nav: "Explorer",      enabled: true },
    { id: "results",       nav: "Results",       enabled: true },
    { id: "showcase",      nav: "Components",    enabled: true },
    { id: "resources",     nav: "Resources",     enabled: true },
  ],

  // ── Editable section content ──────────────────────────────────────────────
  content: {
    hero: {
      // Set `cover` to a project banner image for Clarity's "cover" title layout;
      // delete it for the "no-cover" layout. Path is relative to /public.
      cover:   "demo/brain-06.jpg",
      cohorts: ["Brain viewers", "Carousel", "Gallery", "Compare slider", "Math", "Code", "Tables"],
      badge:   "Edit one file",
      primaryCta:   { label: "Explore brain regions →", href: "#explorer" },
      secondaryCta: { label: "Get the template",        href: "#resources" },
    },

    abstract: {
      eyebrow: "About",
      title:   "What this template gives you",
      lede:    "A polished, single-page paper site you adapt by editing one config file. The sections below are a live demo — keep what you need, switch off the rest. The data shown is illustrative placeholder content.",
      stats: [
        { stat: "1",   label: "file to edit",  detail: "site.config.js drives the whole site" },
        { stat: "12+", label: "components",    detail: "viewers, carousel, gallery, math, code…" },
        { stat: "3",   label: "themes",        detail: "light · dark · gradient, switchable live" },
        { stat: "0",   label: "build config",  detail: "push to main → GitHub Pages deploys" },
      ],
      columns: [
        { heading: "Config-driven",  body: "Title, authors, sections, theme, fonts and every block of copy live in src/site.config.js. A non-coder can adapt the whole site without touching component code — turn sections on or off and reorder them in one array." },
        { heading: "Batteries included", body: "Interactive brain/volume viewers, an auto-advancing carousel, an image gallery with lightbox, before/after comparison sliders, LaTeX math, copy-button code blocks, responsive tables and callouts — all demonstrated in the Components section below." },
      ],
    },

    architecture: {
      eyebrow: "Model",
      title:   "A compact 3D-CNN for brain age",
      lede:    "An SFCN-style network reads a whole-brain T1 MRI and regresses a single predicted age. Edit the diagram blocks in site.config.js → content.architecture.diagram.",
      // Optional: override the diagram. Defaults to a 6-block SFCN.
      // diagram: { input: "T1 MRI · 182³", output: "Brain age (yrs)", stages: [{ ch: 32, fmap: "91³" }, ...] },
    },

    preprocessing: {
      eyebrow: "Data",
      title:   "Preprocessing",
      lede:    "A light, standard pipeline turns each raw T1 scan into a clean, aligned volume the model can read.",
      steps:   ["Bias correction", "Brain extraction", "Linear registration", "WM normalisation"],
    },

    explorer: {
      eyebrow:      "Explore",
      title:        "Important brain regions",
      lede:         "Which regions drive the prediction? Pick a brain atlas and a view — interactive 3D, 2D projections, or a sortable table. The Brainnetome atlas is shown as a parcellated mesh; every other atlas renders as coordinate nodes. (~20% of regions are flagged important — illustrative placeholder data.)",
      defaultAtlas: "brainnetome",
      defaultView:  "split",
    },

    results: {
      eyebrow: "Results",
      title:   "Results & Discussion",
      lede:    "The headline numbers, then what they mean. Swap in your own metrics, table and findings.",
      metrics: [
        { stat: "3.1 yr", label: "Mean abs. error", detail: "held-out test set" },
        { stat: "0.95",   label: "Pearson r",       detail: "predicted vs. true age" },
        { stat: "12k",    label: "Scans",           detail: "training + validation" },
        { stat: "20%",    label: "Regions driving", detail: "of the full atlas" },
      ],
      table: {
        caption: "Performance by cohort (illustrative).",
        columns: [
          { key: "cohort", label: "Cohort" },
          { key: "n",      label: "N",         align: "right" },
          { key: "mae",    label: "MAE (yr)",  align: "right" },
          { key: "r",      label: "r",         align: "right" },
        ],
        rows: [
          { cohort: "Site A", n: "4,210", mae: "2.9", r: "0.96" },
          { cohort: "Site B", n: "3,884", mae: "3.2", r: "0.95" },
          { cohort: "Site C", n: "3,950", mae: "3.4", r: "0.94" },
        ],
      },
      findings: [
        { heading: "Where the signal lives", body: "The most important regions concentrate in association cortex and key subcortical structures — consistent across atlases, which suggests the result is not an artefact of one particular parcellation." },
        { heading: "What it means",          body: "A compact convolutional model recovers a robust brain-age signal from raw structural MRI, and the regions it relies on are anatomically plausible. Replace this prose with your own discussion." },
      ],
      discussion: "These numbers are placeholders. Edit site.config.js → content.results to drop in your real metrics, per-cohort table and takeaways.",
    },

    resources: {
      eyebrow: "Resources",
      title:   "Get the template",
      lede:    "Fork it, edit src/site.config.js, drop your figures in /public, and push to main — GitHub Pages does the rest. Replace these links with your own paper, code and data.",
      links: [
        { label: "GitHub",        href: "https://github.com/blackpearl006/neuroai-template-demo", desc: "Fork the template",          icon: "⌥" },
        { label: "Preprint",      href: "#", desc: "Link your arXiv / bioRxiv",   icon: "📄" },
        { label: "Code",          href: "#", desc: "Link your project repo",      icon: "⬇" },
        { label: "Data",          href: "#", desc: "Link your dataset / Zenodo",  icon: "📊" },
      ],
      citation: `@misc{yourname2026yourpaper,
  title   = {Your Paper Title Here},
  author  = {Your Name and Co-Authors},
  year    = {2026},
  note    = {Built with the NeuroAI paper template}
}`,
    },
  },
};

export default config;
