import { lazy, Suspense } from "react";
import GlassBrain from "./GlassBrain";
import MediaEmbed from "./MediaEmbed";
import CompareSlider from "./CompareSlider";

// Heavy 3D/volume viewers are lazy so a page with only static images stays light.
const NiiVueViewer      = lazy(() => import("./NiiVueViewer"));
const BrainnetomeAtlas  = lazy(() => import("./BrainnetomeAtlas"));

const B = import.meta.env.BASE_URL;
// Prefix repo-relative asset paths with the deploy base; leave URLs untouched.
const asset = (p) => (!p || /^(https?:)?\/\//.test(p) || p.startsWith("data:") ? p : `${B}${p.replace(/^\//, "")}`);

const Loading = ({ height }) => (
  <div className="rounded-xl bg-ink/5 border border-rule/20 flex items-center justify-center" style={{ height }}>
    <span className="font-mono text-xs text-ink2">Loading viewer…</span>
  </div>
);

// One declarative brain/figure renderer. Pick a `type`; everything else is its props.
//   type "image"   → static PNG (glass brain, slice, figure)            { src, caption }
//   type "volume"  → interactive NIfTI viewer (NiiVue)                  { url, overlay, colormap, height }
//   type "mesh"    → interactive 3D atlas (rotate/auto-rotate built in) { counts, sig, regions, height }
//   type "video"   → mp4/webm                                          { src, autoplay, loop, caption }
//   type "gif"     → animated gif                                      { src, caption }
//   type "compare" → before/after slider (Healthy/Unhealthy)          { before, after, caption }
export default function BrainRenderer({ type = "image", height = 420, caption, ...props }) {
  switch (type) {
    case "volume":
      return (
        <Suspense fallback={<Loading height={height} />}>
          <NiiVueViewer url={asset(props.url)} overlay={asset(props.overlay)} colormap={props.colormap} overlayColormap={props.overlayColormap} height={height} />
          {caption && <Caption>{caption}</Caption>}
        </Suspense>
      );
    case "mesh":
      return (
        <Suspense fallback={<Loading height={height} />}>
          <BrainnetomeAtlas counts={props.counts} sig={props.sig} regions={props.regions} height={height} numCohorts={props.numCohorts || 1} />
          {caption && <Caption>{caption}</Caption>}
        </Suspense>
      );
    case "video":
      return <MediaEmbed src={asset(props.src)} poster={asset(props.poster)} autoplay={props.autoplay} loop={props.loop} muted={props.muted} controls={props.controls} caption={caption} />;
    case "gif":
      return <MediaEmbed src={asset(props.src)} caption={caption} />;
    case "compare":
      return <CompareSlider before={{ ...props.before, src: asset(props.before?.src) }} after={{ ...props.after, src: asset(props.after?.src) }} caption={caption} height={height} />;
    case "image":
    default:
      return <GlassBrain src={asset(props.src)} alt={props.alt || caption} caption={caption} />;
  }
}

const Caption = ({ children }) => (
  <p className="font-serif text-sm text-ink2 mt-2 text-center italic">{children}</p>
);
