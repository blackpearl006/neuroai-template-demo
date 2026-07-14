// Clean SFCN-style architecture diagram in the Clarity tradition: a distinct
// panel, low-contrast blocks, a warm accent on the prediction head, and a
// caption. Pure HTML/CSS — no image asset. Edit `stages` to retarget it to your
// own model.
//
//   <Architecture
//     input="T1 MRI · 182³"
//     stages={[{ ch: 32, fmap: "91³" }, ...]}
//     output="Brain age (yrs)" />

const DEFAULT_STAGES = [
  { ch: 32,  fmap: "91³" },
  { ch: 64,  fmap: "45³" },
  { ch: 128, fmap: "22³" },
  { ch: 256, fmap: "11³" },
  { ch: 256, fmap: "5³" },
  { ch: 64,  fmap: "5³" },
];

function Arrow() {
  return <span className="text-ink2/40 font-mono text-xl shrink-0 select-none px-1">→</span>;
}

// A conv block: Conv 3³ → BN → ReLU → MaxPool. Uniform-size solid block (Clarity
// tradition) — the growing channel count is the centred label and deepens the
// fill; the shrinking feature-map size is read from the dimension beneath it.
function ConvBlock({ ch, fmap, maxCh }) {
  const fill = 0.14 + 0.66 * (ch / maxCh); // channels deepen the fill
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div
        className="w-16 h-20 rounded-lg border border-sig/50 flex items-center justify-center"
        style={{ background: `rgb(var(--c-sig) / ${fill})` }}
        title={`Conv 3³ · BN · ReLU · MaxPool 2³ — ${ch} channels`}
      >
        <span className="font-sans text-base text-ink font-bold tabular-nums">{ch}</span>
      </div>
      <span className="font-mono text-xs text-ink2 tabular-nums">{fmap}</span>
    </div>
  );
}

export default function Architecture({
  input = "T1 MRI · 182³",
  stages = DEFAULT_STAGES,
  output = "Brain age (yrs)",
  caption = "SFCN (Simple Fully Convolutional Network): six Conv→BatchNorm→ReLU→MaxPool blocks progressively halve the volume while deepening the channels, followed by global average pooling and a fully-connected head that regresses a single brain-age value.",
}) {
  const maxCh = Math.max(...stages.map((s) => s.ch));
  return (
    <figure className="my-2">
      <div className="rounded-2xl border border-rule/20 bg-paper2 px-5 py-6 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          {/* Input — dashed I/O node */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-20 rounded-lg border-2 border-dashed border-ink/35 bg-ink/[0.03] flex items-center justify-center">
              <span className="font-mono text-xs text-ink2 -rotate-90 whitespace-nowrap tracking-wide">input</span>
            </div>
            <span className="font-mono text-xs text-ink2 text-center max-w-[72px] leading-tight">{input}</span>
          </div>
          <Arrow />

          {/* Conv blocks ×N */}
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <ConvBlock {...s} maxCh={maxCh} />
              {i < stages.length - 1 && <Arrow />}
            </div>
          ))}
          <Arrow />

          {/* Global average pool */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-14 h-14 rounded-full border border-ink/30 bg-paper flex items-center justify-center">
              <span className="font-mono text-[11px] text-ink2 text-center leading-tight">avg<br/>pool</span>
            </div>
            <span className="font-mono text-xs text-ink2/70 uppercase tracking-wide">global</span>
          </div>
          <Arrow />

          {/* FC head — solid accent (a real layer, not an I/O node) */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="px-4 py-4 rounded-lg bg-accent/15 border border-accent/60 flex items-center justify-center">
              <span className="font-sans text-sm font-bold text-ink whitespace-nowrap">FC → ŷ</span>
            </div>
            <span className="font-mono text-xs text-ink2 text-center max-w-[88px] leading-tight">{output}</span>
          </div>
        </div>
      </div>
      <figcaption className="font-serif text-sm text-ink2 mt-3 text-center italic max-w-prose mx-auto">{caption}</figcaption>
    </figure>
  );
}
