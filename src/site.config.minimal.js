// Minimal "Your Paper" starter config — open the site with `?variant=minimal`
// to preview it. Same shape as site.config.js but with Lorem-Ipsum placeholder
// text and the Apple system font. Copy this over site.config.js to start a brand
// new paper from a clean slate.
import demo from "./site.config";

const config = {
  ...demo,

  identity: {
    title:       "Your Paper Title Goes Here",
    titleAccent: "Here",
    tagline:     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A one-sentence, plain-language summary of your study that a non-expert can follow.",
    eyebrow:     "Topic · Method · Atlas",
    authors:     "First Author, Second Author, et al.",
    institution: "Your Institution",
    year:        2026,
    repoUrl:     "https://github.com/your-org/your-repo",
  },

  meta: {
    ...demo.meta,
    title:       "Your Paper Title",
    description: "A one-line description of your paper for search engines and social cards.",
  },

  theme: "light",
  fonts: "apple",

  // A clean starter set: overview + the full component toolbox + resources.
  // (The data-heavy fingerprint sections are omitted until you add your data.)
  sections: [
    { id: "hero",      nav: null,        enabled: true },
    { id: "abstract",  nav: "Overview",  enabled: true },
    { id: "showcase",  nav: "Toolbox",   enabled: true },
    { id: "resources", nav: "Resources", enabled: true },
  ],

  content: {
    ...demo.content,
    hero: {
      ...demo.content.hero,
      cohorts: ["Dataset A", "Dataset B", "Dataset C", "Dataset D"],
      badge:   "N datasets",
    },
    abstract: {
      eyebrow: "Overview",
      title:   "What we found",
      lede:    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. State your headline finding here.",
      stats: [
        { stat: "1,234", label: "participants", detail: "across N sites" },
        { stat: "100",   label: "regions",      detail: "your atlas" },
        { stat: "12",    label: "key finding",  detail: "what it means" },
        { stat: "5×",    label: "models",       detail: "ensemble / folds" },
      ],
      columns: [
        { heading: "First contribution",  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Describe your first key contribution in one short paragraph." },
        { heading: "Second contribution", body: "Ut enim ad minim veniam, quis nostrud exercitation. Describe your second key contribution in one short paragraph." },
      ],
    },
    resources: {
      eyebrow: "Resources",
      title:   "Data & Code",
      lede:    "Lorem ipsum — links to your paper, code, weights and data.",
      links: [
        { label: "Paper",  href: "#", desc: "Preprint / DOI", icon: "📄" },
        { label: "Code",   href: "#", desc: "GitHub repo",    icon: "⌥" },
        { label: "Weights", href: "#", desc: "Model checkpoints", icon: "⬇" },
        { label: "Data",   href: "#", desc: "Processed data",  icon: "📊" },
      ],
      citation: `@article{yourkey2026,
  title   = {Your Paper Title},
  author  = {Author, First and others},
  journal = {Journal},
  year    = {2026}
}`,
    },
  },
};

export default config;
