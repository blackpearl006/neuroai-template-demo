import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { applyAppearance } from "./lib/appearance";

// Apply the active color/font theme before first paint.
applyAppearance();

// ?studio=1 opens the dev-only Layout Studio instead of the site.
const isStudio =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("studio") === "1";
const Studio = lazy(() => import("./components/Studio"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isStudio ? (
      <Suspense fallback={null}>
        <Studio />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
