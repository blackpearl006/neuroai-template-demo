import Section from "../components/Section";
import Architecture from "../components/Architecture";
import config from "../config";

// The model. A clean Clarity-style SFCN diagram instead of a wall of text.
// Edit text/diagram in content/config.yml → content.architecture.
export default function ArchitectureSection() {
  const c = config.content.architecture || {};
  return (
    <Section
      id="architecture"
      eyebrow={c.eyebrow || "Model"}
      title={c.title || "Architecture"}
      lede={c.lede || "A compact 3D convolutional network maps a whole-brain T1 MRI to a single predicted age."}
    >
      <Architecture {...(c.diagram || {})} />
    </Section>
  );
}
