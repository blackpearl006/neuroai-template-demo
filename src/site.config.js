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
    title:       "Explainable Brain-Age Fingerprints",
    titleAccent: "Fingerprints",          // word in the title rendered in the accent colour
    tagline:     "Uncovering universal and population-specific patterns of brain ageing across 3,569 individuals and 8 cohorts — made interpretable with Integrated Gradients.",
    eyebrow:     "Brain Age · Integrated Gradients · Brainnetome Atlas",
    authors:     "Ninad Aithal et al.",
    institution: "Indian Institute of Science, Bangalore",
    year:        2026,
    repoUrl:     "https://github.com/neuroai-template/neuroai-template.github.io",
  },

  // ── Browser tab + social share (Open Graph / Twitter) ────────────────────
  meta: {
    title:       "Brain-Age Fingerprints — Explainable Brain-Age Biomarkers",
    description: "Interactive explorer for brain-age fingerprints across 8 cohorts using Integrated Gradients on deep brain-age models.",
    ogImage:     "og-image.png",          // lives in /public
    twitter:     "@your_handle",
    url:         "https://neuroai-template.github.io/",
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
      cohorts: ["ADNI", "OASIS3", "MAYO", "CAMCAN", "SALD", "SRPBS", "BrainLat", "ABIL"],
      badge:   "8 cohorts · 4 continents",
      primaryCta:   { label: "Explore Fingerprints →", href: "#playground" },
      secondaryCta: { label: "Paper & Code",            href: "#resources" },
    },

    abstract: {
      eyebrow: "Study",
      title:   "What we found",
      lede:    "Twenty-six Universal ROIs emerge as consistent brain-age predictors across all 8 cohorts. Population-specific patterns reveal distinct ageing signatures, with marked differences in East Asian and Latin American brains when trained on Caucasian-only data.",
      stats: [
        { stat: "3,569", label: "participants",   detail: "8 cohorts · 4 continents" },
        { stat: "246",   label: "brain ROIs",     detail: "Brainnetome atlas, whole-brain" },
        { stat: "26",    label: "Universal ROIs",  detail: "significant in all 8 cohorts" },
        { stat: "100",   label: "brain-age models", detail: "5 folds × 20 repeats ensemble" },
      ],
      columns: [
        { heading: "Cross-sectional fingerprints", body: "Using Integrated Gradients on an ensemble of 100 models, we identify which Brainnetome ROIs most strongly influence brain-age predictions per subject, then aggregate across subjects within each cohort to produce cohort-specific fingerprints." },
        { heading: "Population generalisation",     body: "Models trained exclusively on Caucasian cohorts show substantial MAE degradation on East Asian (SRPBS) and Latin American (BrainLat) test sets, while models trained on diverse data achieve consistent performance — highlighting the importance of multi-population training." },
      ],
    },

    resources: {
      eyebrow: "Resources",
      title:   "Data & Code",
      lede:    "All model weights, data, and analysis code will be released on acceptance. Pre-release access available on request.",
      links: [
        { label: "Preprint",       href: "#", desc: "arXiv (coming soon)",            icon: "📄" },
        { label: "GitHub",         href: "#", desc: "Training code + IG pipeline",     icon: "⌥" },
        { label: "Model Weights",  href: "#", desc: "Zenodo — 100 model checkpoints",  icon: "⬇" },
        { label: "Processed Data", href: "#", desc: "ROI attribution CSVs (Zenodo)",   icon: "📊" },
      ],
      citation: `@article{aithal2026brainage,
  title   = {Explainable Brain-Age Fingerprints across
             Diverse Populations},
  author  = {Aithal, Ninad and others},
  journal = {TBD},
  year    = {2026}
}`,
    },
  },
};

export default config;
