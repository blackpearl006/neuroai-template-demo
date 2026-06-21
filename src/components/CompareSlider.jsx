import "img-comparison-slider";

// Before/after image comparison slider (e.g. Healthy vs Unhealthy, raw vs
// processed). Drag the handle to reveal. Wraps the img-comparison-slider web
// component.
//   <CompareSlider
//     before={{ src: "...", label: "Healthy" }}
//     after={{ src: "...", label: "Unhealthy" }}
//     caption="..." />
export default function CompareSlider({ before, after, caption, height = 360 }) {
  return (
    <figure className="my-2">
      <div className="relative rounded-xl overflow-hidden border border-rule/20 bg-paper2">
        <img-comparison-slider className="block w-full" style={{ "--divider-color": "rgb(var(--c-accent))" }}>
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img slot="first" src={before.src} alt={before.label || "before"} style={{ height, width: "100%", objectFit: "cover" }} />
          <img slot="second" src={after.src} alt={after.label || "after"} style={{ height, width: "100%", objectFit: "cover" }} />
        </img-comparison-slider>

        {before.label && (
          <span className="absolute top-3 left-3 font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded bg-ink/70 text-paper pointer-events-none">
            {before.label}
          </span>
        )}
        {after.label && (
          <span className="absolute top-3 right-3 font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded bg-ink/70 text-paper pointer-events-none">
            {after.label}
          </span>
        )}
      </div>
      {caption && (
        <figcaption className="font-serif text-sm text-ink2 mt-2 text-center italic">{caption}</figcaption>
      )}
    </figure>
  );
}
