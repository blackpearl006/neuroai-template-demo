import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, GizmoHelper, GizmoViewport, Text } from "@react-three/drei";
import * as THREE from "three";
import { sequentialColor, palette } from "../lib/theme";
import { fitMniToMesh, loadAtlas } from "../lib/atlas";

const MESH_BASE = `${import.meta.env.BASE_URL}assets/meshes/`;
const SHELL_URL = `${MESH_BASE}atlas.glb`; // Brainnetome mesh doubles as the node-atlas shell
useGLTF.preload(SHELL_URL);
const BG = "#141E2D";

// Categorical lobe palette — every atlas CSV carries a `lobe`, so this is the
// one colour scheme that works for all of them.
const LOBE_COLORS = {
  Frontal: "#4E79A7", Temporal: "#F28E2B", Parietal: "#59A14F", Occipital: "#E15759",
  Insula: "#B07AA1", Limbic: "#9C755F", Cingulate: "#EDC948", Subcortical: "#76B7B2",
  Cerebellum: "#FF9DA7", Central: "#86BCB6", NA: "#8896a6",
};
const lobeColor = (l) => LOBE_COLORS[l] || LOBE_COLORS.NA;

// hex for a region given the active colour mode
function regionColor(r, mode, maxScore) {
  if (mode === "lobe") return lobeColor(r.lobe);
  return sequentialColor(maxScore > 0 ? r.score / maxScore : 0); // importance
}

function OrientationLabels() {
  const L = [
    { p: [-165, 0, 0], t: "L", c: "#C8312B" }, { p: [165, 0, 0], t: "R", c: "#3A7EC6" },
    { p: [0, 155, 0], t: "S", c: "#888" },     { p: [0, -155, 0], t: "I", c: "#888" },
    { p: [0, 0, -165], t: "A", c: "#888" },    { p: [0, 0, 165], t: "P", c: "#888" },
  ];
  return L.map(({ p, t, c }) => (
    <Text key={t} position={p} fontSize={11} color={c} anchorX="center" anchorY="middle" fontWeight="bold">{t}</Text>
  ));
}

function collectCentroids(scene) {
  const out = {};
  scene.updateMatrixWorld(true);
  scene.traverse((o) => {
    const m = o.isMesh && o.name.match(/^roi_(\d+)$/);
    if (m) { const c = new THREE.Vector3(); new THREE.Box3().setFromObject(o).getCenter(c); out[+m[1]] = [c.x, c.y, c.z]; }
  });
  return out;
}

// ── Parcellated mesh scene (Brainnetome) ──────────────────────────────────────
function MeshScene({ regions, colorMode, shellOpacity, onHover, meshUrl }) {
  const { scene } = useGLTF(meshUrl);
  const groupRef = useRef(null);
  const matsRef = useRef({});
  const byId = useMemo(() => new Map(regions.map((r) => [r.id, r])), [regions]);
  const maxScore = useMemo(() => Math.max(1e-6, ...regions.map((r) => r.score)), [regions]);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.clear();
    matsRef.current = {};
    const clone = scene.clone(true);
    clone.traverse((o) => {
      const m = o.isMesh && o.name.match(/^roi_(\d+)$/);
      if (!m) return;
      matsRef.current[+m[1]] = {
        mesh: o,
        std: new THREE.MeshBasicMaterial({ color: "#fff" }),
        shell: new THREE.MeshBasicMaterial({ color: "#A8BFD4", opacity: shellOpacity, transparent: true, depthWrite: false }),
      };
    });
    groupRef.current.add(clone);
  }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    Object.entries(matsRef.current).forEach(([id, { mesh, std, shell }]) => {
      const r = byId.get(+id);
      if (r?.sig) {
        std.color.set(regionColor(r, colorMode, maxScore));
        mesh.material = std; mesh.renderOrder = 2;
        mesh.raycast = THREE.Mesh.prototype.raycast.bind(mesh);
      } else {
        shell.opacity = shellOpacity; mesh.material = shell; mesh.renderOrder = 0; mesh.raycast = () => {};
      }
    });
  }, [byId, colorMode, shellOpacity, maxScore]);

  const move = useCallback((e) => {
    e.stopPropagation();
    const m = e.object?.name?.match(/^roi_(\d+)$/);
    if (m) { const r = byId.get(+m[1]); if (r) onHover?.(r, e.clientX, e.clientY); }
  }, [byId, onHover]);

  return <group ref={groupRef} onPointerMove={move} onPointerLeave={() => onHover?.(null)} />;
}

// ── Coordinate-node scene (all other atlases) ─────────────────────────────────
function NodeScene({ regions, colorMode, shellOpacity, onHover }) {
  const { scene } = useGLTF(SHELL_URL);
  const [ref, setRef] = useState(null);
  useEffect(() => { loadAtlas("brainnetome").then((a) => setRef(a)); }, []);

  // faint translucent brain shell from the Brainnetome glb
  const shell = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      if (o.isMesh) { o.material = new THREE.MeshBasicMaterial({ color: "#A8BFD4", opacity: shellOpacity, transparent: true, depthWrite: false }); o.raycast = () => {}; }
    });
    return clone;
  }, [scene, shellOpacity]);

  // MNI → mesh-space transform fitted from Brainnetome (coords ↔ mesh centroids)
  const toMesh = useMemo(() => {
    if (!ref) return null;
    const cents = collectCentroids(scene);
    const pairs = ref.regions.filter((r) => cents[r.id]).map((r) => ({ mni: [r.x, r.y, r.z], mesh: cents[r.id] }));
    return pairs.length > 10 ? fitMniToMesh(pairs) : null;
  }, [ref, scene]);

  const maxScore = useMemo(() => Math.max(1e-6, ...regions.map((r) => r.score)), [regions]);
  const nodes = useMemo(() => {
    if (!toMesh) return [];
    return regions.map((r) => ({ r, pos: toMesh([r.x, r.y, r.z]) }));
  }, [regions, toMesh]);

  if (!toMesh) return <primitive object={shell} />;
  return (
    <group>
      <primitive object={shell} />
      {nodes.map(({ r, pos }) => (
        <mesh
          key={r.id}
          position={pos}
          renderOrder={r.sig ? 2 : 1}
          onPointerOver={(e) => { e.stopPropagation(); onHover?.(r, e.clientX, e.clientY); }}
          onPointerOut={() => onHover?.(null)}
        >
          <sphereGeometry args={[r.sig ? 6 : 3, 16, 16]} />
          <meshBasicMaterial
            color={r.sig ? regionColor(r, colorMode, maxScore) : "#9fb4c8"}
            transparent={!r.sig}
            opacity={r.sig ? 1 : 0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

function ModeBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-2.5 py-1 font-mono text-[10px] rounded transition-colors ${active ? "bg-paper text-ink font-bold" : "text-paper/50 hover:text-paper/80 hover:bg-white/10"}`}>{children}</button>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export default function Atlas3D({ atlas, height = 520 }) {
  const [colorMode, setColorMode] = useState("importance");
  const [shellOpacity, setShellOpacity] = useState(0.18);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const h = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const onHover = useCallback((r, x, y) => {
    if (!r) { setTooltip(null); return; }
    const rect = boxRef.current?.getBoundingClientRect();
    if (rect) setTooltip({ r, x: x - rect.left, y: y - rect.top });
  }, []);

  const sigCount = atlas.regions.filter((r) => r.sig).length;
  const isMesh = (atlas.render || (atlas.hasMesh ? "mesh" : "nodes")) === "mesh";
  const meshUrl = `${MESH_BASE}${atlas.mesh || "atlas.glb"}`;

  return (
    <div ref={boxRef} className="relative w-full rounded-xl overflow-hidden select-none" style={{ background: BG, height: isFull ? "100vh" : height }}>
      <Canvas camera={{ position: [0, 30, 360], fov: 38 }} gl={{ antialias: true, alpha: false }} style={{ background: BG }}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[300, 400, 200]} intensity={1.0} />
        <hemisphereLight skyColor="#3A5A7A" groundColor="#1A2A3A" intensity={0.6} />
        <Suspense fallback={null}>
          {isMesh ? (
            <MeshScene key={atlas.key} regions={atlas.regions} meshUrl={meshUrl} colorMode={colorMode} shellOpacity={shellOpacity} onHover={onHover} />
          ) : (
            <NodeScene key={atlas.key} regions={atlas.regions} colorMode={colorMode} shellOpacity={shellOpacity} onHover={onHover} />
          )}
          <OrientationLabels />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={130} maxDistance={560} autoRotate={autoRotate} autoRotateSpeed={1.2} />
        <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
          <GizmoViewport axisColors={["#C8312B", "#5DAD43", "#3A7EC6"]} labelColor="white" />
        </GizmoHelper>
      </Canvas>

      <div className="absolute top-3 left-3 bg-ink/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
        <span className="font-mono text-[11px] text-sig font-bold">{sigCount}</span>
        <span className="font-mono text-[11px] text-paper/60"> important regions</span>
      </div>

      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-ink/70 backdrop-blur-sm rounded-lg flex">
        <ModeBtn active={colorMode === "importance"} onClick={() => setColorMode("importance")}>Importance</ModeBtn>
        <ModeBtn active={colorMode === "lobe"} onClick={() => setColorMode("lobe")}>Lobe</ModeBtn>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="font-mono text-[10px] text-paper/25 hidden md:block">drag · scroll · pinch</span>
        <button onClick={() => (isFull ? document.exitFullscreen?.() : boxRef.current?.requestFullscreen?.())} className="bg-ink/70 backdrop-blur-sm rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-paper/60 hover:text-paper transition-colors">{isFull ? "⤡" : "⤢"}</button>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end gap-2">
        <div className="flex-1">
          {colorMode === "importance" ? (
            <div className="inline-flex items-center gap-2 bg-ink/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="font-mono text-[10px] text-paper/40">low</span>
              <div className="w-20 h-1.5 rounded-full" style={{ background: `linear-gradient(to right, ${sequentialColor(0.05)}, ${sequentialColor(0.5)}, ${sequentialColor(1)})` }} />
              <span className="font-mono text-[10px] text-paper/40">high</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 bg-ink/70 backdrop-blur-sm rounded-lg px-3 py-2 max-w-[440px]">
              {[...new Set(atlas.regions.map((r) => r.lobe))].slice(0, 10).map((l) => (
                <span key={l} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: lobeColor(l) }} />
                  <span className="font-mono text-[9px] text-paper/60 whitespace-nowrap">{l}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 bg-ink/70 backdrop-blur-sm rounded-lg px-3 py-2">
          <span className="font-mono text-[10px] text-paper/40">Shell</span>
          <input type="range" min={0} max={0.5} step={0.02} value={shellOpacity} onChange={(e) => setShellOpacity(+e.target.value)} className="w-12 cursor-pointer" style={{ accentColor: "#C8312B" }} />
        </div>
        <button onClick={() => setAutoRotate((r) => !r)} className={`flex items-center gap-1.5 bg-ink/70 backdrop-blur-sm rounded-lg px-3 py-2 font-mono text-[10px] transition-colors ${autoRotate ? "text-accent" : "text-paper/40 hover:text-paper/70"}`}>
          <span className={autoRotate ? "animate-spin inline-block" : "inline-block"} style={{ animationDuration: "3s" }}>⟳</span>
          <span>{autoRotate ? "Rotating" : "Rotate"}</span>
        </button>
      </div>

      {tooltip && (
        <div className="pointer-events-none absolute z-20 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden" style={{ left: Math.min(tooltip.x + 14, (boxRef.current?.offsetWidth ?? 500) - 230), top: Math.max(8, tooltip.y - 90), minWidth: 210, background: "rgba(15,23,42,0.96)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="px-4 py-2.5 flex items-center justify-between gap-3" style={{ background: lobeColor(tooltip.r.lobe) + "22" }}>
            <p className="font-mono font-bold text-paper text-sm truncate">{tooltip.r.name}</p>
            <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: lobeColor(tooltip.r.lobe) }}>{tooltip.r.lobe}</span>
          </div>
          <div className="px-4 py-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono">
            <span className="text-paper/40">Hemisphere</span><span className="text-paper/80">{tooltip.r.hemi === "L" ? "Left" : tooltip.r.hemi === "R" ? "Right" : tooltip.r.hemi}</span>
            <span className="text-paper/40">Importance</span><span className="font-bold text-paper">{tooltip.r.score.toFixed(2)}</span>
            <span className="text-paper/40">Important</span><span>{tooltip.r.sig ? <span className="text-sig font-bold">Yes ✓</span> : <span className="text-paper/30">No</span>}</span>
          </div>
        </div>
      )}
    </div>
  );
}
