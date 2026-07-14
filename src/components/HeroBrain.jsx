import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MeshScene } from "./Atlas3D";
import { loadAtlas } from "../lib/atlas";

const MESH_URL = `${import.meta.env.BASE_URL}assets/meshes/atlas.glb`;

// The saliency-coloured Brainnetome mesh, loaded and passed to the shared
// MeshScene. Same colouring as the Explorer's 3D view — the hero and the
// interactive viewer show the same brain.
function Brain({ onReady }) {
  const [regions, setRegions] = useState(null);
  useEffect(() => { loadAtlas("brainnetome").then((a) => setRegions(a.regions)); }, []);
  if (!regions) return null;
  return (
    <MeshScene
      regions={regions}
      meshUrl={MESH_URL}
      colorMode="importance"
      shellOpacity={0.22}
      onReady={onReady}
    />
  );
}

// Ambient hero brain — a single, borderless, slowly auto-rotating 3D mesh on a
// transparent canvas so it composites straight onto the page. Non-interactive by
// design (the real viewer lives in Explorer); pointer-events are off so it never
// traps scroll. Lazy-loaded and gated by prefers-reduced-motion at the call site.
export default function HeroBrain({ height = 460, onReady }) {
  return (
    <Canvas
      camera={{ position: [0, 20, 340], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ height, background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[300, 400, 200]} intensity={1.1} />
      <hemisphereLight skyColor="#cfe0ee" groundColor="#e9eef3" intensity={0.7} />
      <Suspense fallback={null}>
        <Brain onReady={onReady} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
