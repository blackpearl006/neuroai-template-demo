// Assembles the site config from the editable files in /content:
//   config.yml     → settings (identity, meta, theme, sections, hero)
//   <section>.md   → prose (YAML frontmatter for labels + Markdown body)
//   *.csv          → tables / cards (stats, metrics, results-table, links)
//   citation.bib   → BibTeX
// A non-coder edits those files; this turns them into the object the app reads.
import { load as loadYaml } from "js-yaml";
import { marked } from "marked";
import cfgRaw from "/content/config.yml?raw";
import citationRaw from "/content/citation.bib?raw";

const mdFiles = import.meta.glob("/content/*.md", { query: "?raw", import: "default", eager: true });
const csvFiles = import.meta.glob("/content/*.csv", { query: "?raw", import: "default", eager: true });

const baseName = (p) => p.split("/").pop().replace(/\.\w+$/, "");

// "---\n<yaml>\n---\n<markdown>" → { ...frontmatter, html, bodyText }
function parseDoc(raw) {
  let data = {}, body = raw;
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (m) {
    try { data = loadYaml(m[1]) || {}; }
    catch (e) { console.error("Front-matter formatting error (this section will look blank until fixed):", e.message); }
    body = m[2];
  }
  body = body.trim();
  return { ...data, html: body ? marked.parse(body) : "", bodyText: body };
}

// Minimal CSV parser (handles quoted fields with commas) → array of row objects.
function parseCSV(text) {
  const rows = [];
  let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; if (f !== "" || row.length) { row.push(f); rows.push(row); row = []; f = ""; } }
    else f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0];
  return rows.slice(1).filter((r) => r.some((v) => v !== "")).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const md = Object.fromEntries(Object.entries(mdFiles).map(([p, raw]) => [baseName(p), parseDoc(raw)]));
const csv = Object.fromEntries(Object.entries(csvFiles).map(([p, raw]) => [baseName(p), parseCSV(raw)]));

let cfg = {};
try { cfg = loadYaml(cfgRaw) || {}; }
catch (e) { console.error("content/config.yml formatting error — check indentation/quotes:", e.message); }
const resultsRows = csv["results-table"] || [];
const resultsCols = resultsRows.length
  ? Object.keys(resultsRows[0]).map((h, i) => ({ key: h, label: h, align: i === 0 ? undefined : "right" }))
  : [];

const config = {
  identity: {
    title: cfg.title, titleAccent: cfg.titleAccent, authors: cfg.authors,
    institution: cfg.institution, year: cfg.year, repoUrl: cfg.repoUrl,
  },
  meta: { lang: "en", ...(cfg.meta || {}) },
  deploy: { basePath: "./" },
  theme: cfg.theme || "light",
  fonts: cfg.fonts || "editorial",
  fontScale: cfg.fontScale || "md",
  showThemeToggle: cfg.showThemeToggle !== false,
  sections: cfg.sections || [],
  content: {
    hero: {
      eyebrow: md.hero?.eyebrow,
      taglineHtml: md.hero ? marked.parseInline(md.hero.bodyText || "") : "",
      ...(cfg.hero || {}),
    },
    abstract:      { ...(md.abstract || {}), stats: csv.stats || [] },
    architecture:  { ...(md.architecture || {}) },
    preprocessing: { ...(md.preprocessing || {}) },
    explorer:      { ...(md.explorer || {}) },
    results:       { ...(md.results || {}), metrics: csv.metrics || [], table: { columns: resultsCols, rows: resultsRows } },
    resources:     { ...(md.resources || {}), links: csv.links || [], citation: (citationRaw || "").trim() },
  },
};

export default config;
