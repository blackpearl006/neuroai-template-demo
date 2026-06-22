import Section from "../components/Section";
import AtlasExplorer from "../components/AtlasExplorer";
import config from "../config";

// The interactive centrepiece: pick a brain atlas, pick a view (3D / 2D /
// table / split) and explore which regions matter. Fully generic — no cohorts,
// analyses or thresholds. Edit text in content/config.yml → content.explorer.
export default function Explorer() {
  const c = config.content.explorer || {};
  return (
    <Section
      id="explorer"
      eyebrow={c.eyebrow || "Explore"}
      title={c.title || "Important brain regions"}
      lede={c.lede || "Which regions drive the model's prediction? Choose a brain atlas and a view to explore the most important regions in 3D, in 2D projections, or as a sortable table."}
    >
      <AtlasExplorer defaultAtlas={c.defaultAtlas || "brainnetome"} defaultView={c.defaultView || "split"} />
    </Section>
  );
}
