import { useState } from "react";
import { THEMES } from "../lib/themes";
import { FONT_THEMES } from "../lib/fonts";
import { setTheme, setFont, currentTheme, currentFont } from "../lib/appearance";

// Floating theme + font switcher (bottom-right). For the "make it your own"
// persona — readers can recolour and re-type the whole site live. Choices
// persist in localStorage. Hide it by setting showThemeToggle:false in config.
export default function AppearanceControls() {
  const [open, setOpen] = useState(false);
  const [theme, setThemeState] = useState(currentTheme());
  const [font, setFontState] = useState(currentFont());

  const pickTheme = (k) => { setTheme(k); setThemeState(k); };
  const pickFont  = (k) => { setFont(k);  setFontState(k); };

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open && (
        <div className="mb-2 w-60 rounded-xl border border-rule/30 bg-paper2 shadow-xl p-4 animate-fade-in">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink2/70 mb-1.5">Theme</p>
          <div className="grid grid-cols-1 gap-1 mb-4">
            {Object.entries(THEMES).map(([k, t]) => (
              <button
                key={k}
                onClick={() => pickTheme(k)}
                className={`text-left font-sans text-sm rounded-lg px-3 py-1.5 border transition-colors ${
                  theme === k ? "border-accent text-ink bg-paper" : "border-rule/20 text-ink2 hover:text-ink hover:border-rule/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-widest text-ink2/70 mb-1.5">Font</p>
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(FONT_THEMES).map(([k, f]) => (
              <button
                key={k}
                onClick={() => pickFont(k)}
                className={`text-left font-sans text-sm rounded-lg px-3 py-1.5 border transition-colors ${
                  font === k ? "border-accent text-ink bg-paper" : "border-rule/20 text-ink2 hover:text-ink hover:border-rule/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Theme and font settings"
        aria-expanded={open}
        className="ml-auto flex items-center gap-2 rounded-full border border-rule/30 bg-paper2/95 backdrop-blur px-4 py-2 shadow-lg hover:border-ink/40 transition-colors"
      >
        <span aria-hidden="true" className="text-base">🎨</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink2">Theme</span>
      </button>
    </div>
  );
}
