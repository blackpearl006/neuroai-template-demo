import { useMemo, useRef, useState } from "react";
import config from "../config";
import { THEMES } from "../lib/themes";
import { FONT_THEMES } from "../lib/fonts";
import { setTheme, setFont, currentTheme, currentFont } from "../lib/appearance";

// ── Layout Studio ──────────────────────────────────────────────────────────
// Open with ?studio=1. A dev-only planner: preview the live site across device
// frames, reorder/toggle sections, recolour/retype, then export a config snippet
// to paste into src/site.config.js. Never shipped in the published page.
// (See docs/LAYOUT_STUDIO.md for the design + roadmap.)

const DEVICES = [
  { key: "iphone", label: "iPhone", w: 390, h: 844 },
  { key: "ipad",   label: "iPad",   w: 834, h: 1112 },
  { key: "mac",    label: "Mac",    w: 1280, h: 800 },
  { key: "4k",     label: "4K",     w: 1920, h: 1080 },
];

const BASE = import.meta.env.BASE_URL;

export default function Studio() {
  const [device, setDevice] = useState(DEVICES[2]);
  const [variant, setVariant] = useState("demo");
  const [sections, setSections] = useState(() => config.sections.map((s) => ({ ...s })));
  const [theme, setThemeState] = useState(currentTheme());
  const [font, setFontState] = useState(currentFont());
  const [bump, setBump] = useState(0); // forces iframe reload
  const iframeRef = useRef(null);

  const reload = () => setBump((b) => b + 1);
  const pickTheme = (k) => { setTheme(k); setThemeState(k); reload(); };
  const pickFont  = (k) => { setFont(k);  setFontState(k); reload(); };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = sections.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setSections(next);
  };
  const toggle = (i) =>
    setSections((prev) => prev.map((s, k) => (k === i ? { ...s, enabled: !s.enabled } : s)));

  const snippet = useMemo(() => {
    const lines = sections
      .map((s) => `    { id: ${JSON.stringify(s.id)}, nav: ${JSON.stringify(s.nav ?? null)}, enabled: ${s.enabled} },`)
      .join("\n");
    return `  // Paste into src/site.config.js\n  theme: ${JSON.stringify(theme)},\n  fonts: ${JSON.stringify(font)},\n  sections: [\n${lines}\n  ],`;
  }, [sections, theme, font]);

  const copy = () => navigator.clipboard?.writeText(snippet);
  const download = () => {
    const blob = new Blob([snippet], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "site.layout.txt";
    a.click();
  };

  const previewSrc = `${BASE}${variant === "minimal" ? "?variant=minimal" : ""}#studio${bump}`;
  // Scale the device frame down to fit the preview pane when it's wider than ~900px.
  const scale = Math.min(1, 880 / device.w);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* top bar */}
      <header className="flex items-center justify-between gap-4 px-5 py-3 border-b border-rule/20 bg-paper2">
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-lg">🧩</span>
          <h1 className="font-sans font-bold text-ink">Layout Studio</h1>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink2/60">dev preview</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-rule/30 overflow-hidden">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDevice(d)}
              className={`font-mono text-xs px-3 py-1.5 transition-colors ${
                device.key === d.key ? "bg-ink text-paper" : "text-ink2 hover:text-ink hover:bg-paper"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <a href={BASE} className="font-mono text-xs text-ink2 hover:text-ink underline">← back to site</a>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* sidebar */}
        <aside className="w-80 shrink-0 border-r border-rule/20 bg-paper2/60 overflow-y-auto p-4 space-y-6">
          <Group label="Preview">
            <div className="flex gap-1 rounded-lg border border-rule/30 overflow-hidden text-xs font-mono">
              {["demo", "minimal"].map((v) => (
                <button key={v} onClick={() => { setVariant(v); reload(); }}
                  className={`flex-1 px-3 py-1.5 ${variant === v ? "bg-ink text-paper" : "text-ink2 hover:text-ink"}`}>
                  {v}
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] text-ink2/60 mt-2">{device.w}×{device.h}px</p>
          </Group>

          <Group label="Sections (reorder · toggle)">
            <ul className="space-y-1">
              {sections.map((s, i) => (
                <li key={s.id} className="flex items-center gap-2 rounded-lg border border-rule/20 bg-paper px-2.5 py-1.5">
                  <button onClick={() => toggle(i)} aria-label="toggle"
                    className={`w-8 text-center font-mono text-[10px] rounded ${s.enabled ? "text-accent" : "text-ink2/40"}`}>
                    {s.enabled ? "ON" : "off"}
                  </button>
                  <span className={`flex-1 font-sans text-sm ${s.enabled ? "text-ink" : "text-ink2/50 line-through"}`}>{s.id}</span>
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="font-mono text-ink2 hover:text-ink disabled:opacity-25 px-1">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="font-mono text-ink2 hover:text-ink disabled:opacity-25 px-1">↓</button>
                </li>
              ))}
            </ul>
            <p className="font-serif text-xs text-ink2/70 mt-2 italic">Section changes apply on export. Theme/font preview live.</p>
          </Group>

          <Group label="Theme">
            <Pills items={THEMES} active={theme} onPick={pickTheme} />
          </Group>
          <Group label="Font">
            <Pills items={FONT_THEMES} active={font} onPick={pickFont} />
          </Group>

          <Group label="Export">
            <pre className="font-mono text-[10px] leading-relaxed bg-paper rounded-lg p-3 border border-rule/20 overflow-x-auto whitespace-pre">{snippet}</pre>
            <div className="flex gap-2 mt-2">
              <button onClick={copy} className="flex-1 font-mono text-xs bg-ink text-paper rounded-lg px-3 py-2 hover:bg-rule">Copy</button>
              <button onClick={download} className="flex-1 font-mono text-xs border border-rule/30 text-ink2 rounded-lg px-3 py-2 hover:text-ink">Download</button>
            </div>
          </Group>
        </aside>

        {/* preview pane */}
        <div className="flex-1 min-w-0 overflow-auto bg-ink/5 flex items-start justify-center p-6">
          <div
            className="bg-paper rounded-[28px] border-[6px] border-ink/80 shadow-2xl overflow-hidden shrink-0"
            style={{ width: device.w, height: device.h, transform: `scale(${scale})`, transformOrigin: "top center" }}
          >
            <iframe
              ref={iframeRef}
              key={previewSrc}
              title="preview"
              src={previewSrc}
              style={{ width: device.w, height: device.h, border: 0, display: "block" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Group = ({ label, children }) => (
  <div>
    <p className="font-mono text-[10px] uppercase tracking-widest text-ink2/70 mb-2">{label}</p>
    {children}
  </div>
);

const Pills = ({ items, active, onPick }) => (
  <div className="grid grid-cols-1 gap-1">
    {Object.entries(items).map(([k, v]) => (
      <button key={k} onClick={() => onPick(k)}
        className={`text-left font-sans text-sm rounded-lg px-3 py-1.5 border transition-colors ${
          active === k ? "border-accent text-ink bg-paper" : "border-rule/20 text-ink2 hover:text-ink hover:border-rule/40"
        }`}>
        {v.label}
      </button>
    ))}
  </div>
);
