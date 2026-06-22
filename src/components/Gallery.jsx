import { useState, useEffect } from "react";

// Responsive image grid (like Clarity's columns-2 / columns-6). Click any tile
// to open a lightbox (Esc or click backdrop to close). Matches the FigureModal
// overlay style.
//   <Gallery cols={3} items={[{ src, alt, caption }, ...]} caption="..." />
const COLS = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  6: "grid-cols-3 sm:grid-cols-6",
};

export default function Gallery({ items = [], cols = 3, caption }) {
  const [open, setOpen] = useState(null); // active index, or null

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (items.length === 0) return null;

  return (
    <figure className="my-2">
      <div className={`grid ${COLS[cols] || COLS[3]} gap-3`}>
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            className="relative overflow-hidden rounded-lg border border-rule/20 bg-paper2 aspect-[4/3] group"
            aria-label={`Open image ${i + 1}`}
          >
            <img
              src={it.src}
              alt={it.alt || it.caption || `image ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {caption && (
        <figcaption className="font-serif text-sm text-ink2 mt-3 text-center italic">{caption}</figcaption>
      )}

      {open !== null && (
        <div
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-w-4xl w-full bg-paper rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={items[open].src} alt={items[open].caption || "figure"} className="w-full rounded" />
            {items[open].caption && (
              <p className="mt-3 text-sm text-ink2 font-sans">{items[open].caption}</p>
            )}
            <button onClick={() => setOpen(null)} className="mt-4 font-mono text-xs text-ink2 hover:text-ink">
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </figure>
  );
}
