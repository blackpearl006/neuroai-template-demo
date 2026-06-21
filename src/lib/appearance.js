// Applies the active color theme + font theme to the document at boot, and
// exposes live setters for the ThemeToggle / FontPicker controls.
import { THEMES } from "./themes";
import { FONT_THEMES } from "./fonts";
import config from "../config";

const LS_THEME = "neuroai:theme";
const LS_FONT  = "neuroai:font";

function injectGoogleFont(url) {
  if (!url) return;
  const id = "google-font-" + btoa(url).slice(0, 12);
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

export function applyTheme(key) {
  const t = THEMES[key] || THEMES[config.theme] || THEMES.light;
  const root = document.documentElement;
  Object.entries(t.colors).forEach(([k, v]) => root.style.setProperty(`--c-${k}`, v));
  document.body.style.background = t.pageBg || `rgb(${t.colors.paper})`;
  root.dataset.theme = key in THEMES ? key : config.theme;
}

export function applyFont(key) {
  const f = FONT_THEMES[key] || FONT_THEMES[config.fonts] || FONT_THEMES.apple;
  const root = document.documentElement;
  root.style.setProperty("--font-sans", f.sans);
  root.style.setProperty("--font-serif", f.serif);
  root.style.setProperty("--font-mono", f.mono);
  injectGoogleFont(f.google);
}

// Boot: prefer a user's saved live choice, else the config default.
export function applyAppearance() {
  const savedTheme = localStorage.getItem(LS_THEME);
  const savedFont  = localStorage.getItem(LS_FONT);
  applyTheme(savedTheme && savedTheme in THEMES ? savedTheme : config.theme);
  applyFont(savedFont && savedFont in FONT_THEMES ? savedFont : config.fonts);
  if (config.fontScale) document.documentElement.setAttribute("data-fontscale", config.fontScale);
}

export function setTheme(key) {
  applyTheme(key);
  localStorage.setItem(LS_THEME, key);
}
export function setFont(key) {
  applyFont(key);
  localStorage.setItem(LS_FONT, key);
}
export function currentTheme() {
  return localStorage.getItem(LS_THEME) || config.theme;
}
export function currentFont() {
  return localStorage.getItem(LS_FONT) || config.fonts;
}
