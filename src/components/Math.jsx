import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// LaTeX math via KaTeX (fast, offline — no CDN).
//   <Math tex="\mathrm{MAE} = \frac{1}{N}\sum_i |\hat y_i - y_i|" />        // display
//   <Math inline tex="r = 0.92" />                                          // inline
export default function Math({ tex = "", inline = false, className = "" }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { displayMode: !inline, throwOnError: false });
    } catch {
      return tex;
    }
  }, [tex, inline]);

  const Tag = inline ? "span" : "div";
  return (
    <Tag
      className={`${inline ? "" : "my-4 overflow-x-auto text-ink"} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
