import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";

// Read the editable settings (content/config.yml) at build for <title>/meta.
const ymlCfg = loadYaml(readFileSync(fileURLToPath(new URL("./content/config.yml", import.meta.url)), "utf8")) || {};
const siteConfig = { meta: { lang: "en", ...(ymlCfg.meta || {}) }, deploy: { basePath: "./" } };

// Inject <title> + social/SEO meta from content/config.yml into index.html
// at build time, so metadata stays single-sourced with the rest of the site.
function htmlMeta(cfg) {
  const m = cfg.meta || {};
  const lang = m.lang || "en";
  const esc = (s = "") => String(s).replace(/"/g, "&quot;");
  const tags = [
    `<meta name="description" content="${esc(m.description)}"/>`,
    m.url && `<link rel="canonical" href="${esc(m.url)}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:title" content="${esc(m.title)}"/>`,
    `<meta property="og:description" content="${esc(m.description)}"/>`,
    m.url && `<meta property="og:url" content="${esc(m.url)}"/>`,
    m.ogImage && `<meta property="og:image" content="${esc(m.ogImage)}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    m.twitter && `<meta name="twitter:site" content="${esc(m.twitter)}"/>`,
    `<meta name="twitter:title" content="${esc(m.title)}"/>`,
    `<meta name="twitter:description" content="${esc(m.description)}"/>`,
    m.ogImage && `<meta name="twitter:image" content="${esc(m.ogImage)}"/>`,
  ].filter(Boolean).join("\n  ");

  return {
    name: "html-meta",
    transformIndexHtml(html) {
      return html
        .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
        .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
        .replace("<!--%META_TAGS%-->", tags);
    },
  };
}

// Base path comes from site.config.js (deploy.basePath). "./" (relative) works
// for both user-site root and project subpaths without further changes.
export default defineConfig({
  plugins: [react(), htmlMeta(siteConfig)],
  base: siteConfig.deploy?.basePath || "./",
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
