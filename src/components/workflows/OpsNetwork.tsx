import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../lib/motion";
import { cn } from "../../lib/utils";

/* The ITCYBER AI Operations System — the hero's living diagram.
   Sources → AI Agent → business systems → outcomes, with data packets
   and a cycling live event log. Desktop: SVG network. Mobile: vertical run. */

const EVENTS = [
  { t: "New lead captured", d: "website form · Mumbai", tone: "#56D9FF" },
  { t: "AI analyzed enquiry", d: "intent: pricing · 3BHK", tone: "#8FB4FF" },
  { t: "Lead score: 92", d: "high priority flagged", tone: "#3DDC97" },
  { t: "CRM updated", d: "record + stage set", tone: "#8FB4FF" },
  { t: "WhatsApp follow-up sent", d: "brochure + slots", tone: "#56D9FF" },
  { t: "Sales team notified", d: "context attached", tone: "#FFB454" },
  { t: "Meeting booked", d: "Sat 11:00 · confirmed", tone: "#3DDC97" },
];

type Node = { id: string; label: string; sub: string; x: number; y: number; w: number; hot?: boolean };

const NODES: Node[] = [
  { id: "lead", label: "Website Lead", sub: "form · chat", x: 8, y: 62, w: 128 },
  { id: "wa-in", label: "WhatsApp", sub: "inbound msg", x: 8, y: 196, w: 128 },
  { id: "ads", label: "Ad Campaigns", sub: "meta · google", x: 8, y: 330, w: 128 },
  { id: "ai", label: "AI Lead Agent", sub: "qualify · route", x: 248, y: 178, w: 164, hot: true },
  { id: "qual", label: "Qualification", sub: "score 92", x: 512, y: 62, w: 128 },
  { id: "crm", label: "CRM", sub: "record + stage", x: 512, y: 196, w: 128 },
  { id: "wa-out", label: "WhatsApp", sub: "follow-up", x: 512, y: 330, w: 128 },
  { id: "sales", label: "Sales Team", sub: "notified", x: 148, y: 440, w: 122 },
  { id: "meet", label: "Appointment", sub: "auto-booked", x: 330, y: 440, w: 122 },
  { id: "dash", label: "Analytics", sub: "live dashboard", x: 512, y: 440, w: 122 },
];

const EDGES: { from: string; to: string; d: string }[] = [
  { from: "lead", to: "ai", d: "M136 82 C 210 82, 200 210, 248 210" },
  { from: "wa-in", to: "ai", d: "M136 216 C 190 216, 200 210, 248 210" },
  { from: "ads", to: "ai", d: "M136 350 C 210 350, 200 210, 248 210" },
  { from: "ai", to: "qual", d: "M412 200 C 470 200, 460 82, 512 82" },
  { from: "ai", to: "crm", d: "M412 210 C 460 210, 460 216, 512 216" },
  { from: "ai", to: "wa-out", d: "M412 220 C 470 220, 460 350, 512 350" },
  { from: "crm", to: "sales", d: "M512 236 C 420 300, 250 380, 209 440" },
  { from: "wa-out", to: "meet", d: "M512 360 C 470 400, 430 420, 391 440" },
  { from: "qual", to: "dash", d: "M600 92 C 640 260, 620 380, 590 440" },
];

function EventFeed({ compact = false }: { compact?: boolean }) {
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % EVENTS.length), 2300);
    return () => clearInterval(id);
  }, [reduce]);

  const visible = [0, 1, 2].map((o) => EVENTS[(idx + o) % EVENTS.length]);
  return (
    <div className={cn("font-mono text-[0.7rem] leading-relaxed", compact && "text-[0.68rem]")} aria-label="Live automation events (demo)">
      {visible.map((e, i) => (
        <p key={`${e.t}-${i}`} className={cn("flex items-center gap-2 transition-all duration-500", i === 0 ? "text-ink-100" : i === 1 ? "text-ink-300" : "text-ink-500")}>
          <span className="w-1.5 h-1.5 shrink-0 rounded-full anim-pulse-dot" style={{ background: e.tone, animationDelay: `${i * 0.3}s` }} aria-hidden />
          <span className="truncate">{e.t}</span>
          <span className="text-ink-500 hidden sm:inline truncate">· {e.d}</span>
        </p>
      ))}
    </div>
  );
}

function GraphNode({ n, reduce }: { n: Node; reduce: boolean | null }) {
  const h = n.hot ? 66 : 44;
  const y = n.y + (n.hot ? -11 : 0);
  return (
    <g>
      {n.hot && !reduce && <rect x={n.x - 6} y={y - 6} width={n.w + 12} height={h + 12} fill="none" stroke="rgba(86,217,255,.25)" strokeWidth="1"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite" /></rect>}
      <rect x={n.x} y={y} width={n.w} height={h} fill={n.hot ? "#0d1628" : "#0a1120"} stroke={n.hot ? "rgba(92,145,255,.7)" : "rgba(147,166,201,.22)"} strokeWidth="1" />
      <path d={`M${n.x} ${y + 8} v-8 h8`} stroke={n.hot ? "#56D9FF" : "#3E7BFF"} strokeWidth="1.5" fill="none" />
      <path d={`M${n.x + n.w} ${y + h - 8} v8 h-8`} stroke={n.hot ? "#56D9FF" : "#3E7BFF"} strokeWidth="1.5" fill="none" />
      <text x={n.x + 12} y={n.hot ? y + 28 : y + 19} fill={n.hot ? "#ffffff" : "#E9EFF9"} fontFamily="Space Grotesk, sans-serif" fontWeight="600" fontSize={n.hot ? 14 : 11.5}>
        {n.label}
      </text>
      <text x={n.x + 12} y={n.hot ? y + 47 : y + 33} fill={n.hot ? "#56D9FF" : "#647BA8"} fontFamily="IBM Plex Mono, monospace" fontSize={n.hot ? 9.5 : 8.5}>
        {n.sub}
      </text>
      {!reduce && <circle cx={n.x + n.w - 12} cy={y + 12} r="3" fill={n.hot ? "#3DDC97" : "#56D9FF"} className="anim-pulse-dot" style={{ transformOrigin: `${n.x + n.w - 12}px ${y + 12}px`, animationDelay: `${(n.x % 5) * 0.4}s` }} />}
    </g>
  );
}

export default function OpsNetwork() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [par, setPar] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    const el = wrapRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPar({
        x: ((e.clientX - r.left) / r.width - 0.5) * 14,
        y: ((e.clientY - r.top) / r.height - 0.5) * 10,
      });
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduce]);

  /* ---------- mobile vertical run ---------- */
  const mobileSteps = [
    { label: "Website Lead", sub: "enquiry captured instantly", tone: "#56D9FF" },
    { label: "AI Lead Agent", sub: "qualifies + scores the lead", tone: "#8FB4FF" },
    { label: "CRM", sub: "record created & assigned", tone: "#8FB4FF" },
    { label: "WhatsApp", sub: "personalised follow-up sent", tone: "#56D9FF" },
    { label: "Appointment", sub: "meeting booked in calendar", tone: "#3DDC97" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % mobileSteps.length), 1500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <div ref={wrapRef} className="relative">
      {/* -------- desktop network -------- */}
      <div className="hidden md:block relative">
        <div className="absolute -inset-10 rounded-full bg-brand-500/[.08] blur-[80px]" aria-hidden />
        <svg
          viewBox="0 0 648 500"
          className="relative w-full h-auto"
          role="img"
          aria-label="Diagram of the ITCYBER AI operations system: leads flow into an AI agent, which updates the CRM, sends WhatsApp follow-ups, books appointments and reports to analytics"
          style={{ transform: reduce ? undefined : `translate(${par.x * 0.3}px, ${par.y * 0.3}px)`, transition: "transform .4s cubic-bezier(.16,1,.3,1)" }}
        >
          <g style={{ transform: reduce ? undefined : `translate(${par.x}px, ${par.y}px)`, transition: "transform .4s cubic-bezier(.16,1,.3,1)" }}>
            {EDGES.map((e, i) => (
              <g key={e.from + e.to}>
                <path d={e.d} fill="none" stroke="rgba(147,166,201,.16)" strokeWidth="1.5" />
                <path d={e.d} fill="none" stroke="rgba(92,145,255,.55)" strokeWidth="1.5" strokeDasharray="3 11" className={reduce ? undefined : "anim-flow"} style={{ animationDelay: `${i * 0.15}s` }} />
                {!reduce && (
                  <circle r="3.2" fill="#56D9FF" opacity="0.9">
                    <animateMotion dur={`${2.6 + (i % 4) * 0.5}s`} repeatCount="indefinite" path={e.d} begin={`${i * 0.45}s`} />
                  </circle>
                )}
              </g>
            ))}
            {NODES.map((n) => (
              <GraphNode key={n.id} n={n} reduce={reduce} />
            ))}
          </g>
        </svg>

        {/* live run card */}
        <div className="absolute -bottom-5 -left-4 lg:-left-10 bg-ink-850/95 backdrop-blur-xl hairline clip-corner px-4 py-3 w-[17rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)]">
          <p className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 mb-2">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-signal rounded-full anim-pulse-dot" aria-hidden /> live run</span>
            <span>demo data</span>
          </p>
          <EventFeed />
        </div>

        <div className="absolute -top-3 -right-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 hairline bg-ink-900/90 px-2.5 py-1.5 clip-corner">
          agents online · <span className="text-signal">7</span>
        </div>
      </div>

      {/* -------- mobile vertical workflow -------- */}
      <div className="md:hidden relative bg-ink-850/60 hairline clip-corner p-5">
        <p className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 mb-4">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-signal rounded-full anim-pulse-dot" aria-hidden /> live run</span>
          <span>demo data</span>
        </p>
        <ol className="relative">
          <span className="absolute left-[5px] top-2 bottom-2 w-px bg-ink-600" aria-hidden />
          <span className="absolute left-[5px] top-2 w-px bg-gradient-to-b from-cyan-ic to-brand-500 transition-all duration-700" style={{ height: `${(active / (mobileSteps.length - 1)) * 100}%` }} aria-hidden />
          {mobileSteps.map((s, i) => {
            const on = i <= active;
            const current = i === active;
            return (
              <li key={s.label} className="relative flex items-start gap-4 pb-5 last:pb-0">
                <span
                  className={cn("relative z-10 mt-1 w-[11px] h-[11px] shrink-0 border transition-all duration-500", on ? "border-cyan-ic bg-cyan-ic/30" : "border-ink-500 bg-ink-900")}
                  style={current && !reduce ? { boxShadow: "0 0 12px rgba(86,217,255,.8)" } : undefined}
                  aria-hidden
                />
                <span className={cn("transition-all duration-500", on ? "opacity-100 translate-x-0" : "opacity-40 translate-x-1")}>
                  <span className="font-display font-semibold text-[0.98rem] text-white flex items-center gap-2">
                    {s.label}
                    {current && <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-cyan-ic hairline px-1.5 py-0.5">running</span>}
                  </span>
                  <span className="block text-[0.82rem] text-ink-300 font-mono">{s.sub}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-5 pt-4 border-t border-white/[.08]">
          <EventFeed compact />
        </div>
      </div>
    </div>
  );
}
