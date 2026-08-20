/**
 * ITCYBER AI Operations Core — interactive 3D node network.
 * Adaptive (high/medium quality), pointer-parallax camera, pauses off-screen
 * via the `frameloop` prop, pointer-events disabled so it never blocks the UI.
 * This is demonstration UI — it visualises how agents connect systems.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

import { OPS_NODES, type NodeDef } from "./opsNodes";

export type { NodeDef };
export { OPS_NODES };

const CENTER: [number, number, number] = [0, 0, 0];

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
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (wire.current) {
      wire.current.rotation.y = t * 0.22;
      wire.current.rotation.z = t * 0.1;
    }
    if (inner.current) inner.current.emissiveIntensity = 1.2 + Math.sin(t * 1.6) * 0.4;
  });
  return (
    <group>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#3E7BFF" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial ref={inner} color="#0b1e45" emissive="#3E7BFF" emissiveIntensity={1.2} roughness={0.2} metalness={0.5} />
      </mesh>
      <pointLight color="#3E7BFF" intensity={2.2} distance={14} />
    </group>
  );
}

function Rings() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  return (
    <group ref={g}>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[2.1, 0.006, 8, 96]} />
        <meshBasicMaterial color="#2c4a86" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, 0.4, 0]}>
        <torusGeometry args={[3.1, 0.005, 8, 96]} />
        <meshBasicMaterial color="#22375f" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Node({ def, index }: { def: NodeDef; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.5 + index;
      mesh.current.rotation.x = t * 0.3;
    }
    if (mat.current) mat.current.emissiveIntensity = 0.55 + Math.sin(t * 2 + index * 1.3) * 0.3;
  });
  return (
    <group position={def.pos}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[0.17, 0]} />
        <meshStandardMaterial ref={mat} color={def.color} emissive={def.color} emissiveIntensity={0.6} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

function EdgeLines({ edges }: { edges: Edge[] }) {
  return (
    <>
      {edges.map((e, i) => (
        <Line key={i} points={[e.a, e.b]} color="#33507f" lineWidth={1} transparent opacity={0.42} />
      ))}
    </>
  );
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
        <mesh key={i}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={e.color} transparent opacity={0.95} />
        </mesh>
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

export default function OpsCoreScene({ variant = "core", quality = "high", frameloop = "always" }: OpsSceneProps) {
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
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 6]} intensity={1.05} />
      <PointerRig />
      <group>
        <Core />
        <Rings />
        {nodes.map((n, i) => (
          <Node key={n.label} def={n} index={i} />
        ))}
        <EdgeLines edges={edges} />
        <Packets edges={edges} />
        {quality === "high" && <Particles />}
      </group>
    </Canvas>
  );
}
