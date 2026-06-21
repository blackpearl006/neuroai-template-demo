// Data-visualisation colours (canvas / Three.js / SVG) derived from the active
// theme so charts match the page. Keeps the original export API:
//   palette, networkColors, sequentialColor
import { THEMES, NETWORK_COLORS } from "./themes";
import config from "../config";

const active = THEMES[config.theme] || THEMES.light;

function tripletToHex(triplet) {
  const [r, g, b] = triplet.split(/\s+/).map(Number);
  return `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`;
}

const c = active.colors;
export const palette = {
  paper:  tripletToHex(c.paper),
  paper2: tripletToHex(c.paper2),
  ink:    tripletToHex(c.ink),
  ink2:   tripletToHex(c.ink2),
  sig:    tripletToHex(c.sig),
  accent: tripletToHex(c.accent),
  shell:  active.dataviz.shell,
};

export const networkColors = NETWORK_COLORS;

function hexToRgb(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`;
}

// t in [0,1] → hex along the theme's sequential ramp.
export function sequentialColor(t) {
  const stops = active.dataviz.seq.map(hexToRgb);
  const s = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const i = Math.min(Math.floor(s), stops.length - 2);
  const f = s - i;
  const [r1, g1, b1] = stops[i];
  const [r2, g2, b2] = stops[i + 1];
  return rgbToHex(r1 + (r2 - r1) * f, g1 + (g2 - g1) * f, b1 + (b2 - b1) * f);
}
