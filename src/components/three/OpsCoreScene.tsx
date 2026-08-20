/**
 * ITCYBER AI Operations Core — interactive 3D node network.
 * Adaptive (high/medium quality), pointer-parallax camera, pauses off-screen
 * via the `frameloop` prop, pointer-events disabled so it never blocks the UI.
 * This is demonstration UI — it visualises how agents connect systems.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, type ReactNode } from "react";

import { OPS_NODES, type NodeDef } from "./opsNodes";

export type { NodeDef };
export { OPS_NODES };

const CENTER: [number, number, number] = [0, 0, 0];

/* Soft radial texture — the lightweight "bloom" used by glow sprites. */
let sharedGlow: THREE.Texture | null = null;
function glowTexture(): THREE.Texture {
  if (sharedGlow) return sharedGlow;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.22, "rgba(255,255,255,0.6)");
  g.addColorStop(0.55, "rgba(255,255,255,0.16)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  sharedGlow = new THREE.CanvasTexture(c);
  return sharedGlow;
}

function Glow({ color, scale, opacity }: { color: string; scale: number; opacity: number }) {
  return (
    <sprite scale={scale}>
      <spriteMaterial
        map={glowTexture()}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}

/* Slow orbit of the whole node graph — depth becomes unmistakable. */
function Orbit({ children }: { children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  return <group ref={g}>{children}</group>;
}

interface Edge {
  a: [number, number, number];
  b: [number, number, number];
  phase: number;
  dir: number;
  color: string;
}

export interface OpsSceneProps {
  variant?: "core" | "ring";
  quality?: "high" | "medium";
  frameloop?: "always" | "never" | "demand";
  /** Called if the WebGL context is lost at runtime (host swaps to SVG). */
  onContextLost?: () => void;
  /** Called once the first frame has rendered (host crossfades the canvas in). */
  onReady?: () => void;
}

/* ── window pointer (canvas itself ignores pointer events) ── */
function useWindowPointer() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = document.documentElement;
      ref.current.x = (e.clientX / el.clientWidth) * 2 - 1;
      ref.current.y = -((e.clientY / el.clientHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return ref;
}

function PointerRig() {
  const pointer = useWindowPointer();
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.current.x * 0.9 - camera.position.x) * 0.045;
    camera.position.y += (0.6 + pointer.current.y * 0.55 - camera.position.y) * 0.045;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Core() {
  const wire = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.MeshStandardMaterial>(null);
  const halo = useRef<THREE.Sprite>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (wire.current) {
      wire.current.rotation.y = t * 0.22;
      wire.current.rotation.z = t * 0.1;
    }
    if (inner.current) inner.current.emissiveIntensity = 1.35 + Math.sin(t * 1.6) * 0.45;
    if (halo.current) {
      const s = 5.4 + Math.sin(t * 1.2) * 0.35;
      halo.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      {/* additive halo — reads as bloom without a post-processing pass */}
      <sprite ref={halo} scale={5.4}>
        <spriteMaterial map={glowTexture()} color="#2f6bff" transparent opacity={0.34} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <Glow color="#56D9FF" scale={2.1} opacity={0.5} />
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#3E7BFF" wireframe transparent opacity={0.36} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial ref={inner} color="#0b1e45" emissive="#3E7BFF" emissiveIntensity={1.35} roughness={0.2} metalness={0.5} />
      </mesh>
      <pointLight color="#3E7BFF" intensity={2.6} distance={16} />
    </group>
  );
}

/* A dot orbiting a ring of radius R inside the ring's local (tilted) plane. */
function RingSatellite({ radius, speed, offset, color }: { radius: number; speed: number; offset: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const a = clock.getElapsedTime() * speed + offset;
    ref.current.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.95} />
    </mesh>
  );
}

function Rings() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  return (
    <group ref={g}>
      <group rotation={[Math.PI / 2.2, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.1, 0.007, 8, 96]} />
          <meshBasicMaterial color="#2c4a86" transparent opacity={0.55} />
        </mesh>
        <RingSatellite radius={2.1} speed={0.5} offset={0} color="#56D9FF" />
        <RingSatellite radius={2.1} speed={0.5} offset={Math.PI} color="#3E7BFF" />
      </group>
      <group rotation={[Math.PI / 1.7, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[3.1, 0.006, 8, 96]} />
          <meshBasicMaterial color="#22375f" transparent opacity={0.42} />
        </mesh>
        <RingSatellite radius={3.1} speed={-0.32} offset={1.2} color="#3DDC97" />
      </group>
      <group rotation={[Math.PI / 2.6, -0.5, 0.2]}>
        <mesh>
          <torusGeometry args={[4.1, 0.005, 8, 96]} />
          <meshBasicMaterial color="#1d2f55" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function Node({ def, index }: { def: NodeDef; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  /* depth-based sizing: nodes nearer the camera read larger and brighter */
  const depth = 1 + def.pos[2] * 0.07;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.5 + index;
      mesh.current.rotation.x = t * 0.3;
    }
    if (mat.current) mat.current.emissiveIntensity = (0.6 + Math.sin(t * 2 + index * 1.3) * 0.3) * depth;
  });
  return (
    <group position={def.pos}>
      <Glow color={def.color} scale={1.35 * depth} opacity={0.4 * Math.min(depth, 1.25)} />
      <mesh ref={mesh} scale={depth}>
        <octahedronGeometry args={[0.17, 0]} />
        <meshStandardMaterial ref={mat} color={def.color} emissive={def.color} emissiveIntensity={0.6} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh scale={depth}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

/* Native lineSegments — one draw call for every connection, no drei needed. */
function EdgeLines({ edges }: { edges: Edge[] }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach((e, i) => {
      arr[i * 6] = e.a[0];
      arr[i * 6 + 1] = e.a[1];
      arr[i * 6 + 2] = e.a[2];
      arr[i * 6 + 3] = e.b[0];
      arr[i * 6 + 4] = e.b[1];
      arr[i * 6 + 5] = e.b[2];
    });
    return arr;
  }, [edges]);
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#3d5c96" transparent opacity={0.5} />
    </lineSegments>
  );
}

/* Keeps the whole graph inside the frame at any container aspect ratio.
   Without this, nodes beyond the vertical fov clip off-canvas on narrow
   containers (tablets, portrait windows, preview panes). */
function FrameFit({ radius = 5.8 }: { radius?: number }) {
  const { camera, size } = useThree();
  const target = useRef(11);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const halfFov = ((cam.fov ?? 38) * Math.PI) / 360;
    const aspect = Math.max(size.width, 1) / Math.max(size.height, 1);
    const distV = radius / Math.tan(halfFov);
    const distH = radius / (Math.tan(halfFov) * aspect);
    target.current = Math.min(17, Math.max(9.5, Math.max(distV, distH) + 1.15));
  }, [camera, size, radius]);
  useFrame(() => {
    camera.position.z += (target.current - camera.position.z) * 0.07;
  });
  return null;
}

/* Fires once the first frame has rendered so the host can crossfade in. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      requestAnimationFrame(() => onReady?.());
    }
  });
  return null;
}

function Packets({ edges }: { edges: Edge[] }) {
  const group = useRef<THREE.Group>(null);
  const va = useMemo(() => new THREE.Vector3(), []);
  const vb = useMemo(() => new THREE.Vector3(), []);
  const vp = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const e = edges[i];
      if (!e) return;
      let p = (t * 0.16 + e.phase) % 1;
      if (e.dir < 0) p = 1 - p;
      va.set(e.a[0], e.a[1], e.a[2]);
      vb.set(e.b[0], e.b[1], e.b[2]);
      vp.lerpVectors(va, vb, p);
      child.position.copy(vp);
      child.scale.setScalar(0.8 + Math.sin(p * Math.PI) * 0.7);
    });
  });
  return (
    <group ref={group}>
      {edges.map((e, i) => (
        <group key={i}>
          <Glow color={e.color} scale={0.62} opacity={0.5} />
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={e.color} transparent opacity={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const r = 5.2 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#56D9FF" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function OpsCoreScene({ variant = "core", quality = "high", frameloop = "always", onContextLost, onReady }: OpsSceneProps) {
  const nodes = useMemo(
    () => (quality === "medium" ? OPS_NODES.slice(0, 8) : OPS_NODES),
    [quality]
  );

  const edges = useMemo<Edge[]>(() => {
    if (variant === "core") {
      return nodes.map((n, i) => ({
        a: CENTER,
        b: n.pos,
        phase: i * 0.37,
        dir: i % 2 === 0 ? 1 : -1,
        color: n.color,
      }));
    }
    const ring: Edge[] = nodes.map((n, i) => {
      const next = nodes[(i + 1) % nodes.length];
      return { a: n.pos, b: next.pos, phase: i * 0.29, dir: 1, color: "#56D9FF" };
    });
    nodes.forEach((n, i) => {
      if (i % 2 === 0) ring.push({ a: CENTER, b: n.pos, phase: i * 0.41, dir: -1, color: n.color });
    });
    return ring;
  }, [variant, nodes]);

  return (
    <Canvas
      frameloop={frameloop}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0.6, 11], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none", background: "transparent" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 6]} intensity={1.05} />
      {/* cyan rim from behind-left — separates nodes from the background */}
      <directionalLight position={[-6, -3, -5]} intensity={0.5} color="#56D9FF" />
      <PointerRig />
      <FrameFit />
      <ReadySignal onReady={onReady} />
      <group>
        <Core />
        <Rings />
        {/* the node graph slowly orbits so depth reads immediately */}
        <Orbit>
          {nodes.map((n, i) => (
            <Node key={n.label} def={n} index={i} />
          ))}
          <EdgeLines edges={edges} />
          <Packets edges={edges} />
        </Orbit>
        {quality === "high" && <Particles />}
      </group>
    </Canvas>
  );
}
