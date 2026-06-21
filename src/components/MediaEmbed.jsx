// Lazy video / GIF / image embed with caption.
//   <MediaEmbed src="demo.mp4" autoplay loop muted caption="..." />
//   <MediaEmbed src="rotation.gif" caption="..." />
// Autoplay is suppressed for users who prefer reduced motion.
export default function MediaEmbed({
  src,
  poster,
  caption,
  autoplay = false,
  loop = true,
  muted = true,
  controls = true,
  rounded = true,
}) {
  const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(src);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const shell = rounded ? "rounded-xl" : "";

  return (
    <figure className="my-2">
      <div className={`${shell} overflow-hidden border border-rule/20 bg-paper2`}>
        {isVideo ? (
          <video
            className="block w-full"
            src={src}
            poster={poster}
            autoPlay={autoplay && !prefersReduced}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline
            preload="metadata"
          />
        ) : (
          <img className="block w-full" src={src} alt={caption || "media"} loading="lazy" />
        )}
      </div>
      {caption && (
        <figcaption className="font-serif text-sm text-ink2 mt-2 text-center italic">{caption}</figcaption>
      )}
    </figure>
  );
}
