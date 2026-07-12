import React from "react";

// Catches render-time errors (e.g. a malformed value in content/) so a small
// mistake shows a friendly, on-brand notice instead of a blank white page —
// making the README's "a typo can't white-screen the site" promise actually true.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("The page failed to render — likely a formatting slip in a content/ file.", error, info);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-paper">
        <div className="max-w-lg">
          <p className="font-mono text-[11px] uppercase tracking-widest text-sig mb-3">Content error</p>
          <h1 className="font-sans text-2xl font-semibold text-ink mb-3">This page hit a snag while rendering.</h1>
          <p className="font-serif text-ink2 leading-relaxed mb-4">
            It’s almost always a small formatting slip in one of the files in{" "}
            <code className="font-mono text-sm text-ink">content/</code> — a missing quote, a stray
            character, or a deleted line. Your writing is safe; fix the file and the page comes back.
          </p>
          <pre className="font-mono text-xs text-ink2 bg-paper2 border border-rule/20 rounded-lg p-3 overflow-x-auto">
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      </div>
    );
  }
}
