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
  return <span className="text-ink2/40 font-mono text-lg shrink-0 select-none px-0.5">→</span>;
}

// A conv block: Conv 3³ → BN → ReLU → MaxPool. Box height encodes the shrinking
// feature map; fill opacity encodes the growing channel count.
function ConvBlock({ ch, fmap, i, maxCh }) {
  const h = 96 - i * 9;                 // feature map shrinks with depth
  const fill = 0.12 + 0.6 * (ch / maxCh); // channels deepen the fill
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <div
        className="w-14 rounded-md border border-sig/40 flex items-end justify-center"
        style={{ height: h, background: `rgb(var(--c-sig) / ${fill})` }}
        title={`Conv 3³ · BN · ReLU · MaxPool 2³ — ${ch} channels`}
      >
        <span className="font-mono text-[10px] text-ink/80 font-bold pb-1">{ch}</span>
      </div>
      <span className="font-mono text-[9px] text-ink2 tabular-nums">{fmap}</span>
      <span className="font-mono text-[8px] text-ink2/60 uppercase tracking-wide">block {i + 1}</span>
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
        <div className="flex items-center gap-2 min-w-max">
          {/* Input */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-16 h-24 rounded-md border-2 border-ink/30 bg-ink/5 flex items-center justify-center">
              <span className="font-mono text-[10px] text-ink2 -rotate-90 whitespace-nowrap">input</span>
            </div>
            <span className="font-mono text-[9px] text-ink2 text-center max-w-[64px] leading-tight">{input}</span>
          </div>
          <Arrow />

          {/* Conv blocks ×N */}
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <ConvBlock {...s} i={i} maxCh={maxCh} />
              {i < stages.length - 1 && <Arrow />}
            </div>
          ))}
          <Arrow />

          {/* Global average pool */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-12 h-12 rounded-full border border-ink/30 bg-paper flex items-center justify-center">
              <span className="font-mono text-[9px] text-ink2 text-center leading-tight">avg<br/>pool</span>
            </div>
            <span className="font-mono text-[8px] text-ink2/60 uppercase tracking-wide">global</span>
          </div>
          <Arrow />

          {/* FC head — warm accent */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="px-4 py-3 rounded-md bg-accent/15 border border-accent/50 flex items-center justify-center">
              <span className="font-mono text-[11px] font-bold text-ink whitespace-nowrap">FC → ŷ</span>
            </div>
            <span className="font-mono text-[9px] text-ink2 text-center max-w-[80px] leading-tight">{output}</span>
          </div>
        </div>
      </div>
      <figcaption className="font-serif text-sm text-ink2 mt-3 text-center italic max-w-prose mx-auto">{caption}</figcaption>
    </figure>
  );
}
