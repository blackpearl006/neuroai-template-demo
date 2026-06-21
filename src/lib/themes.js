// ─────────────────────────────────────────────────────────────────────────
// Color themes.
// Each theme defines its palette as space-separated RGB triplets ("r g b") so
// Tailwind's `<alpha-value>` opacity modifiers keep working (e.g. border-rule/20).
// `applyAppearance()` (lib/appearance.js) writes these to CSS variables at boot,
// which lets the site be both config-driven AND switched live by ThemeToggle.
//
// To add a theme: copy a block, rename the key, change the numbers. Done.
// ─────────────────────────────────────────────────────────────────────────

export const THEMES = {
  light: {
    label: "Light · Editorial",
    colors: {
      paper:  "250 247 242", // page background (warm cream)
      paper2: "240 237 229", // cards / secondary surfaces
      ink:    "26 35 50",    // primary text (near-navy)
      ink2:   "90 100 120",  // secondary text
      rule:   "42 50 69",    // dividers / borders
      accent: "232 155 44",  // warm amber — highlights
      sig:    "200 49 43",   // signal red — emphasis / significance
    },
    dataviz: { shell: "#8898AA", seq: ["#F0EDE5", "#E89B2C", "#C8312B"] },
  },

  dark: {
    label: "Dark · Observatory",
    colors: {
      paper:  "13 17 28",
      paper2: "23 29 44",
      ink:    "233 237 243",
      ink2:   "150 162 184",
      rule:   "120 134 160",
      accent: "240 178 90",
      sig:    "233 110 100",
    },
    pageBg: "#0d111c",
    dataviz: { shell: "#8898AA", seq: ["#171D2C", "#F0B25A", "#E96E64"] },
  },

  gradient: {
    label: "Gradient · Aurora",
    colors: {
      paper:  "248 246 252", // cards sit on a soft tint
      paper2: "255 255 255",
      ink:    "32 27 56",
      ink2:   "92 84 128",
      rule:   "120 110 160",
      accent: "168 85 247",  // violet
      sig:    "219 39 119",  // fuchsia
    },
    pageBg: "linear-gradient(135deg, hsl(280 70% 95%) 0%, hsl(330 80% 95%) 45%, hsl(30 85% 94%) 100%)",
    dataviz: { shell: "#9A8FB5", seq: ["#FFFFFF", "#A855F7", "#DB2777"] },
  },
};

// Categorical colours for brain networks — independent of light/dark theme.
export const NETWORK_COLORS = {
  "Default":           "#D64040",
  "Frontoparietal":    "#E9A528",
  "Dorsal Attention":  "#2A9E8F",
  "Ventral Attention": "#9B59B6",
  "Somatomotor":       "#3A7EC6",
  "Visual":            "#5DAD43",
  "Limbic":            "#D4956A",
  "AmyHip":            "#8B6F97",
  "Striatum":          "#5B8C5A",
  "Thalamus":          "#5B85A4",
  "AudLang":           "#E07B54",
  "Subcortical":       "#7A8FA6",
  "NA":                "#9AAABB",
};
