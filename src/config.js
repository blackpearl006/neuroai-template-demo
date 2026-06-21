// Active config resolver.
// Edit your site in ./site.config.js. This file just selects which config is
// live: the default paper config, or the Lorem-Ipsum minimal showcase when the
// page is opened with `?variant=minimal` (handy for previewing the toolbox).
import demo from "./site.config";
import minimal from "./site.config.minimal";

let active = demo;
if (typeof window !== "undefined") {
  const variant = new URLSearchParams(window.location.search).get("variant");
  if (variant === "minimal") active = minimal;
}

export default active;
