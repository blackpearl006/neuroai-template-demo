import Section from "../components/Section";
import FigureModal from "../components/FigureModal";
import config from "../config";

const asset = (p) => (!p || /^https?:/.test(p) ? p : `${import.meta.env.BASE_URL}${p}`);

// The model, as a figure. Authors drop their own architecture image into
// public/ and point `figure:` at it in content/architecture.md — there's no
// diagram code to maintain, so this works for CNNs, transformers, anything.
export default function ArchitectureSection() {
  const c = config.content.architecture || {};
  const src = asset(c.figure || "assets/architecture.svg");
  const caption = c.caption || "Model architecture.";
  return (
    <Section
      id="architecture"
      eyebrow={c.eyebrow || "Model"}
      title={c.title || "Architecture"}
      lede={c.lede || "A compact 3D convolutional network maps a whole-brain T1 MRI to a single predicted age."}
    >
      <figure>
        <img
          src={src}
          alt={caption}
          className="block w-full h-auto max-h-[440px] object-contain mx-auto rounded-2xl border border-rule/15"
        />
        <figcaption className="mt-4 flex items-center justify-between gap-4 flex-wrap">
          <span className="font-serif text-sm text-ink2 italic max-w-prose">{caption}</span>
          <FigureModal src={src} caption={caption} label="+ Enlarge" />
        </figcaption>
      </figure>
    </Section>
  );
}
