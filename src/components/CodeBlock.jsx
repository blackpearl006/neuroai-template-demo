import { useMemo, useState } from "react";
import hljs from "highlight.js/lib/common";
import "../styles/code.css";

// Syntax-highlighted code with a copy button. Use for code listings, commands,
// and the BibTeX citation block.
//   <CodeBlock language="python" code={"import torch\n..."} />
export default function CodeBlock({ code = "", language, filename }) {
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    const src = code.replace(/\n$/, "");
    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(src, { language }).value;
      }
      return hljs.highlightAuto(src).value;
    } catch {
      return src.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));
    }
  }, [code, language]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="relative rounded-xl border border-rule/20 bg-paper2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-rule/15">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink2/70">
          {filename || language || "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="font-mono text-[11px] uppercase tracking-widest text-ink2 hover:text-ink transition-colors"
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="hljs font-mono" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
