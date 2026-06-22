// Renders pre-parsed Markdown HTML (from /content/*.md) with paper-prose styling.
export default function Markdown({ html, className = "" }) {
  if (!html) return null;
  return <div className={`prose-paper max-w-prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
