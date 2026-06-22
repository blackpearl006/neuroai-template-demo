import { useState, useEffect } from "react";
import config from "../config";

// Sticky, hoverable table of contents built from the `nav` labels in
// content/config.yml. Dashes are always visible; labels reveal on hover. The
// section currently in view is highlighted (scrollspy via IntersectionObserver).
// Hidden on small screens (< lg). Rendered once from App.jsx.
export default function TableOfContents() {
  const items = config.sections.filter((s) => s.enabled && s.nav);
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    items.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  if (items.length < 2) return null;

  return (
    <nav className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40 group">
      <ul className="space-y-2.5">
        {items.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a href={`#${s.id}`} className="flex items-center gap-3">
                <span className={`block h-px transition-all duration-300 ${on ? "w-8 bg-sig" : "w-4 bg-rule/50 group-hover:bg-rule"}`} />
                <span className={`font-mono text-[11px] uppercase tracking-widest transition-all duration-300 ${on ? "opacity-100 text-ink" : "opacity-0 group-hover:opacity-100 text-ink2"}`}>
                  {s.nav}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
