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
    { id: "playground",    nav: "Explorer",      enabled: true },
    { id: "comparisons",   nav: "Comparisons",   enabled: true },
    { id: "methods",       nav: "Methods",       enabled: true },
    { id: "preprocessing", nav: "Preprocessing", enabled: true },
    { id: "showcase",      nav: "Components",    enabled: true },
    { id: "resources",     nav: "Resources",     enabled: true },
  ],

  // ── Fingerprint-explorer taxonomy ─────────────────────────────────────────
  // The data dimensions of the ROI attribution study. Wired into the Playground,
  // Comparisons, ROI table, radar and filter bar. Replace with your own cohorts/
  // analyses; `roiCount` must match your regions.json / fingerprints arrays.
  taxonomy: {
    roiCount:   246,
    atlasName:  "Brainnetome",
    cohorts:    ["ADNI", "OASIS3", "MAYO", "CAMCAN", "SALD", "SRPBS", "BrainLat", "ABIL"],
    analyses: [
      { key: "main",         label: "Main" },
      { key: "longitudinal", label: "Longitudinal" },
      { key: "female",       label: "Female" },
      { key: "male",         label: "Male" },
      { key: "left_hem",     label: "Left hem." },
      { key: "right_hem",    label: "Right hem." },
      { key: "caucasian",    label: "Caucasian-trained" },
    ],
    thresholds: [
      { key: "top_5_perc_rois",  label: "Top 5%" },
      { key: "top_10_perc_rois", label: "Top 10%" },
      { key: "top_15_perc_rois", label: "Top 15%" },
      { key: "top_20_perc_rois", label: "Top 20%" },
    ],
  },

  // ── Editable section content ──────────────────────────────────────────────
  content: {
    hero: {
      // Set `cover` to a project banner image for Clarity's "cover" title layout;
      // delete it for the "no-cover" layout. Path is relative to /public.
      cover:   "demo/brain-06.jpg",
      cohorts: ["Brain viewers", "Carousel", "Gallery", "Compare slider", "Math", "Code", "Tables"],
      badge:   "Edit one file",
      primaryCta:   { label: "See the components →", href: "#showcase" },
      secondaryCta: { label: "Get the template",     href: "#resources" },
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
