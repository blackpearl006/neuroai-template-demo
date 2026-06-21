// ─────────────────────────────────────────────────────────────────────────
// Font themes. Each theme is a { sans, serif, mono } trio.
// `google` is the stylesheet URL to inject (null = native/system fonts, no network).
// applyAppearance() writes the active trio to --font-{sans,serif,mono} CSS vars,
// which Tailwind's font-sans/serif/mono utilities resolve to.
//
// The site uses: sans = headings/UI, serif = body prose, mono = code/labels.
// To add a pairing: copy a block, pick fonts, paste the Google Fonts URL (or null).
// ─────────────────────────────────────────────────────────────────────────

export const FONT_THEMES = {
  // Native Apple system stack — zero download, pixel-perfect on macOS/iOS,
  // graceful fallback elsewhere. Best default for speed + offline.
  apple: {
    label: "Apple System",
    sans:  `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif`,
    serif: `"New York", ui-serif, Georgia, Charter, "Times New Roman", serif`,
    mono:  `"SF Mono", ui-monospace, Menlo, Monaco, "Cascadia Mono", monospace`,
    google: null,
  },

  // Editorial — the original brainage look. Warm, magazine-like.
  editorial: {
    label: "Editorial",
    sans:  `"Sora", sans-serif`,
    serif: `"Newsreader", serif`,
    mono:  `"JetBrains Mono", monospace`,
    google: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;600&display=swap",
  },

  // Modern — neutral, ML-paper feel (Inter is the de-facto standard).
  modern: {
    label: "Modern",
    sans:  `"Inter", sans-serif`,
    serif: `"Source Serif 4", serif`,
    mono:  `"IBM Plex Mono", monospace`,
    google: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@400;600&display=swap",
  },

  // Display — expressive, poster-grade. For the "make ART" persona.
  display: {
    label: "Display",
    sans:  `"Space Grotesk", sans-serif`,
    serif: `"Lora", serif`,
    mono:  `"Spline Sans Mono", monospace`,
    google: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Spline+Sans+Mono:wght@400;600&display=swap",
  },
};
