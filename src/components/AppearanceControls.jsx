import { useState, useEffect } from "react";
import { THEMES } from "../lib/themes";
import { FONT_THEMES } from "../lib/fonts";
import { setTheme, setFont, currentTheme, currentFont } from "../lib/appearance";

const SCALES = ["sm", "md", "lg", "xl"];
const applyScale = (s) => document.documentElement.setAttribute("data-fontscale", s);

// One floating control (bottom-right) for theme + font + text size — readers can
// recolour, re-type and resize the whole site live. Persists in localStorage.
// Hide it with showThemeToggle:false in content/config.yml.
export default function AppearanceControls() {
  const [open, setOpen] = useState(false);
  const [theme, setThemeState] = useState(currentTheme());
  const [font, setFontState] = useState(currentFont());
  const [scale, setScale] = useState("md");

  useEffect(() => {
    const saved = localStorage.getItem("fontscale");
    const initial = SCALES.includes(saved) ? saved : "md";
    setScale(initial); applyScale(initial);
  }, []);

  const pickTheme = (k) => { setTheme(k); setThemeState(k); };
  const pickFont  = (k) => { setFont(k);  setFontState(k); };
  const setScaleV = (s) => { setScale(s); applyScale(s); try { localStorage.setItem("fontscale", s); } catch {} };
  const idx = SCALES.indexOf(scale);

  const pickCls = (on) =>
    `text-left font-sans text-sm rounded-lg px-3 py-1.5 border transition-colors ${
      on ? "border-accent text-ink bg-paper" : "border-rule/20 text-ink2 hover:text-ink hover:border-rule/40"
    }`;
  const head = "font-sans text-xs font-semibold text-ink2 mb-1.5";

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open && (
        <div className="mb-2 w-60 rounded-xl border border-rule/30 bg-paper2 shadow-xl p-4 animate-fade-in">
          <p className={head}>Theme</p>
          <div className="grid grid-cols-1 gap-1 mb-4">
            {Object.entries(THEMES).map(([k, t]) => (
              <button key={k} onClick={() => pickTheme(k)} className={pickCls(theme === k)}>{t.label}</button>
            ))}
          </div>

          <p className={head}>Font</p>
          <div className="grid grid-cols-1 gap-1 mb-4">
            {Object.entries(FONT_THEMES).map(([k, f]) => (
              <button key={k} onClick={() => pickFont(k)} className={pickCls(font === k)}>{f.label}</button>
            ))}
          </div>

          <p className={head}>Text size</p>
          <div className="flex items-center rounded-lg border border-rule/30 bg-paper overflow-hidden w-max">
            <button onClick={() => idx > 0 && setScaleV(SCALES[idx - 1])} disabled={idx === 0} aria-label="Decrease text size"
              className="font-sans px-3 py-1 text-sm text-ink2 hover:bg-paper2 hover:text-ink disabled:opacity-30 transition-colors">A−</button>
            <span aria-hidden className="font-sans text-xs text-ink2 px-3 border-x border-rule/20 uppercase">{scale}</span>
            <button onClick={() => idx < SCALES.length - 1 && setScaleV(SCALES[idx + 1])} disabled={idx === SCALES.length - 1} aria-label="Increase text size"
              className="font-sans px-3 py-1 text-base font-semibold text-ink hover:bg-paper2 disabled:opacity-30 transition-colors">A+</button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Display settings — theme, font, text size"
        aria-expanded={open}
        className="ml-auto flex items-center gap-2 rounded-full border border-rule/30 bg-paper2/95 backdrop-blur px-4 py-2 shadow-lg hover:border-ink/40 transition-colors"
      >
        <span aria-hidden className="font-serif text-base font-semibold text-ink leading-none">Aa</span>
        <span className="font-sans text-xs font-medium text-ink2">Display</span>
      </button>
    </div>
  );
}
