/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Colours resolve to CSS variables set at runtime by lib/appearance.js,
      // so themes are config-driven AND switchable live. The `<alpha-value>`
      // placeholder keeps opacity modifiers (e.g. border-rule/20) working.
      colors: {
        paper:  "rgb(var(--c-paper) / <alpha-value>)",
        paper2: "rgb(var(--c-paper2) / <alpha-value>)",
        ink:    "rgb(var(--c-ink) / <alpha-value>)",
        ink2:   "rgb(var(--c-ink2) / <alpha-value>)",
        rule:   "rgb(var(--c-rule) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        sig:    "rgb(var(--c-sig) / <alpha-value>)",
      },
      fontFamily: {
        sans:  ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono:  ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        prose: "62ch",
        wide:  "76rem",
      },
    },
  },
  plugins: [],
};
