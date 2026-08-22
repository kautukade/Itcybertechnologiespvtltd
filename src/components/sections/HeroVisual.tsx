/**
 * Hero visual: the cinematic 3D AI Operations Core on capable devices,
 * crossfaded in over the animated SVG operations network.
 *
 * Tier policy (deliberate):
 *  - FLAT   → prefers-reduced-motion, no WebGL, or very small phones (<520px)
 *  - MEDIUM → tablets / sub-1024px viewports, low-memory / low-core laptops
 *  - HIGH   → desktops >= 1024px with WebGL
 * Touch capability alone ("ontouchstart") NEVER disables 3D — touch-enabled
 * Windows laptops are desktops. Weak hardware downgrades to MEDIUM, not FLAT.
 *
 * Rendering model — the hero can never be blank and never shifts layout:
 *  1. The animated SVG network renders immediately as the base layer.
 *  2. The lazy-loaded 3D chunk mounts on top with opacity 0.
 *  3. After the first real WebGL frame, the canvas crossfades to opacity 1.
 *  4. On error-boundary trip or context loss the canvas unmounts and the
 *     SVG base layer simply remains.
 */
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import OpsNetwork from "../workflows/OpsNetwork";
import { OPS_NODES } from "../three/opsNodes";
import { useReducedMotion } from "../../lib/motion";
import { cn } from "../../lib/utils";

const OpsCoreScene = lazy(() => import("../three/OpsCoreScene"));

export type VisualTier = "high" | "medium" | "flat";

export function detectVisualTier(): VisualTier {
  if (typeof window === "undefined") return "flat";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "flat";
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return "flat";
  } catch {
    return "flat";
  }
  const width = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
  if (width < 520) return "flat";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (width < 1024) return "medium";
  if (mem <= 6 || cores <= 6) return "medium";
  return "high";
}

/** Catches WebGL/render failures in the R3F tree → SVG base layer stays visible. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state: { failed: boolean } = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const EVENTS = [
  "LEAD RECEIVED",
  "AI ANALYZING",
  "QUALIFIED · SCORE 92",
  "CRM UPDATED",
  "FOLLOW-UP SENT",
  "MEETING BOOKED",
];

export default function HeroVisual() {
  const [tier, setTier] = useState<VisualTier>(() => detectVisualTier());
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [eventIdx, setEventIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  /* Re-evaluate capability after preview-pane resizes/orientation changes.
     This fixes the common case where a page initially mounts in a narrow
     builder pane as FLAT and is then expanded to desktop size. */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = detectVisualTier();
        setTier((prev) => {
          if (prev !== next) {
            setReady(false);
            setFailed(false);
          }
          return next;
        });
      });
    };

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update);
    motion.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setEventIdx((i) => (i + 1) % EVENTS.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  const attempt3D = tier !== "flat" && !failed;
  const show3D = attempt3D && ready;

  return (
    <div ref={wrapRef} className="relative h-[340px] sm:h-[430px] md:h-[480px] lg:h-[540px] xl:h-[600px] w-full">
      {import.meta.env.DEV && (
        <p
          aria-hidden
          className="absolute top-2 left-2 z-30 font-mono text-[0.58rem] uppercase tracking-[0.16em] px-2 py-1 clip-corner pointer-events-none bg-black/60 text-cyan-100/90 border border-white/10"
        >
          3D MODE: {tier.toUpperCase()}
          {failed ? " · SVG FALLBACK" : ready ? " · WEBGL LIVE" : attempt3D ? " · LOADING" : ""}
        </p>
      )}

      <div className={cn("absolute inset-0 z-0 transition-opacity duration-1000", show3D && "opacity-0")}>
        <OpsNetwork />
      </div>

      {attempt3D && (
        <SceneBoundary key={tier}>
          <Suspense fallback={null}>
            <div
              className={cn(
                "absolute inset-0 z-[1] transition-opacity duration-1000 ease-out",
                ready ? "opacity-100" : "opacity-0"
              )}
            >
              <OpsCoreScene
                variant="core"
                quality={tier === "medium" ? "medium" : "high"}
                frameloop={inView ? "always" : "never"}
                onReady={() => setReady(true)}
                onContextLost={() => setFailed(true)}
              />
            </div>
          </Suspense>
        </SceneBoundary>
      )}

      {show3D && (
        <>
          <p className="absolute top-2 right-2 z-10 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-400 bg-ink-950/70 hairline px-2 py-1 clip-corner pointer-events-none">
            AI operations core · demo
          </p>
          <div className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-1.5 max-w-[70%] pointer-events-none">
            {OPS_NODES.slice(0, 6).map((n) => (
              <span key={n.label} className="font-mono text-[0.6rem] px-2 py-1 bg-ink-950/70 hairline clip-corner" style={{ color: n.color }}>
                {n.label}
              </span>
            ))}
          </div>
          <div className="absolute bottom-2 right-2 z-10 bg-ink-950/80 hairline clip-corner px-3 py-2 pointer-events-none min-w-[10.5rem]">
            <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ink-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-signal anim-pulse-dot" aria-hidden /> live run · demo
            </p>
            <p key={eventIdx} className={cn("font-mono text-[0.72rem] text-signal mt-1", !reduce && "anim-blink")}>
              {EVENTS[eventIdx]}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
