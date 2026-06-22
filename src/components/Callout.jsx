// Coloured note / tip / warning callout box.
//   <Callout kind="tip" title="Heads up">Body text or elements…</Callout>
const KINDS = {
  note:    { icon: "ℹ", ring: "border-rule/30",   bg: "bg-paper2" },
  tip:     { icon: "✦", ring: "border-sig/40",    bg: "bg-sig/5" },
  warning: { icon: "▲", ring: "border-accent/40", bg: "bg-accent/5" },
};

export default function Callout({ kind = "note", title, children }) {
  const k = KINDS[kind] || KINDS.note;
  return (
    <div className={`my-4 rounded-xl border ${k.ring} ${k.bg} px-5 py-4 flex gap-3`}>
      <span className="font-mono text-sig select-none leading-relaxed">{k.icon}</span>
      <div className="font-serif text-ink2 leading-relaxed">
        {title && <p className="font-sans font-semibold text-ink mb-1">{title}</p>}
        {children}
      </div>
    </div>
  );
}
