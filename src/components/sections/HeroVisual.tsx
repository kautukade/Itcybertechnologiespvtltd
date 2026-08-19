/**
 * Hero visual: full 3D AI Operations Core on capable devices,
 * the animated SVG operations network everywhere else.
 * 3D loads lazily — critical page text renders first, and the SVG
 * network shows as the Suspense fallback so the hero is never empty.
 */
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const small = window.matchMedia("(max-width: 820px)").matches || "ontouchstart" in window;
  if (small || mem <= 4 || cores <= 4) return "flat"; // phones get the lightweight SVG workflow
  if (mem <= 6 || cores <= 6) return "medium";
  return "high";
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
  const tier = useMemo(detectVisualTier, []);
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [eventIdx, setEventIdx] = useState(0);

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

  const use3D = tier !== "flat";

  return (
    <div ref={wrapRef} className="relative h-[380px] sm:h-[470px] lg:h-[560px] w-full">
      {!use3D ? (
        <div className="absolute inset-0">
          <OpsNetwork />
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="absolute inset-0">
              <OpsNetwork />
            </div>
          }
        >
          <div className="absolute inset-0">
            <OpsCoreScene variant="core" quality={tier === "medium" ? "medium" : "high"} frameloop={inView ? "always" : "never"} />
          </div>
        </Suspense>
      )}

      {/* overlays for the 3D variant (the SVG variant has its own) */}
      {use3D && (
        <>
          <p className="absolute top-2 right-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-400 bg-ink-950/70 hairline px-2 py-1 clip-corner pointer-events-none">
            AI operations core · demo
          </p>
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 max-w-[70%] pointer-events-none">
            {OPS_NODES.slice(0, 6).map((n) => (
              <span key={n.label} className="font-mono text-[0.6rem] px-2 py-1 bg-ink-950/70 hairline clip-corner" style={{ color: n.color }}>
                {n.label}
              </span>
            ))}
          </div>
          <div className="absolute bottom-2 right-2 bg-ink-950/80 hairline clip-corner px-3 py-2 pointer-events-none min-w-[10.5rem]">
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
