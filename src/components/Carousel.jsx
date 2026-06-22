import { useState, useEffect } from "react";

// Auto-advancing image slideshow with prev/next arrows, dot indicators,
// pause-on-hover and ←/→ keyboard support. Pure React — no dependency.
//   <Carousel
//     items={[{ src: "...", caption: "...", alt: "..." }, ...]}
//     interval={4000}
//     height={420} />
export default function Carousel({ items = [], interval = 4000, height = 420 }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;
  const go = (next) => setI(((next % n) + n) % n);

  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setInterval(() => setI((c) => (c + 1) % n), interval);
    return () => clearInterval(t);
  }, [paused, n, interval]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "ArrowRight") go(i + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, n]);

  if (n === 0) return null;
  const cur = items[i];

  return (
    <figure className="my-2">
      <div
        className="relative rounded-xl overflow-hidden border border-rule/20 bg-paper2 group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative" style={{ height }}>
          {items.map((it, idx) => (
            <img
              key={idx}
              src={it.src}
              alt={it.alt || it.caption || `slide ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>

        {n > 1 && (
          <>
            <button
              aria-label="Previous slide"
              onClick={() => go(i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/60 text-paper grid place-items-center text-lg leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink/80"
            >
              ‹
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/60 text-paper grid place-items-center text-lg leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink/80"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === i ? "bg-paper" : "bg-paper/40 hover:bg-paper/70"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {cur.caption && (
        <figcaption className="font-serif text-sm text-ink2 mt-2 text-center italic">{cur.caption}</figcaption>
      )}
    </figure>
  );
}
