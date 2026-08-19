/**
 * Integration ecosystem visual: the 3D node field in "ring" mode on capable
 * devices, an animated SVG orbit everywhere else.
 */
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { OPS_NODES } from "../three/opsNodes";
import { detectVisualTier } from "./HeroVisual";

const OpsCoreScene = lazy(() => import("../three/OpsCoreScene"));

function FlatOrbit() {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      setAngle((a) => a + 0.0022);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = 160;
  const cy = 130;
  const r = 96;
  return (
    <svg viewBox="0 0 320 260" className="w-full h-full" role="img" aria-label="Integration ecosystem — connected technology nodes">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1c2b4e" strokeDasharray="3 5" />
      <circle cx={cx} cy={cy} r={58} fill="none" stroke="#1c2b4e" strokeDasharray="2 6" />
      <circle cx={cx} cy={cy} r={20} fill="#0b1e45" stroke="#3E7BFF" />
      <text x={cx} y={cy + 3} textAnchor="middle" fontSize="8" fill="#8FB4FF" fontFamily="IBM Plex Mono, monospace">CORE</text>
      {OPS_NODES.slice(0, 8).map((n, i) => {
        const a = angle + (i / 8) * Math.PI * 2;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <g key={n.label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#22375f" strokeWidth="1" />
            <circle cx={x} cy={y} r={5} fill="#0d1628" stroke={n.color} strokeWidth="1.4" />
          </g>
        );
      })}
    </svg>
  );
}

export default function EcosystemVisual() {
  const tier = useMemo(detectVisualTier, []);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => setInView(e[0]?.isIntersecting ?? true), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const use3D = tier !== "flat";

  return (
    <div ref={wrapRef} className="relative h-[320px] sm:h-[400px] w-full">
      {!use3D ? (
        <FlatOrbit />
      ) : (
        <Suspense fallback={<FlatOrbit />}>
          <div className="absolute inset-0">
            <OpsCoreScene variant="ring" quality={tier === "medium" ? "medium" : "high"} frameloop={inView ? "always" : "never"} />
          </div>
        </Suspense>
      )}
      <p className="absolute bottom-1 right-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-400 pointer-events-none">
        integration graph · demo
      </p>
    </div>
  );
}
