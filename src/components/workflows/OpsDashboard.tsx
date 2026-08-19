import { useEffect, useState } from "react";
import { Counter, useReducedMotion } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { IconPulse } from "../icons";

const FEED = [
  { a: "Sales Agent", t: "qualified lead #L-2941 → stage moved", time: "12s", tone: "bg-signal" },
  { a: "WhatsApp", t: "follow-up delivered to +91 ••• 4821", time: "34s", tone: "bg-cyan-ic" },
  { a: "Support Agent", t: "ticket #482 resolved in 11s", time: "1m", tone: "bg-brand-400" },
  { a: "CRM Sync", t: "14 records enriched & deduped", time: "2m", tone: "bg-brand-400" },
  { a: "Ops Assistant", t: "morning brief sent to 3 managers", time: "4m", tone: "bg-amber-ic" },
  { a: "Appointment", t: "site visit booked · Sat 11:00", time: "6m", tone: "bg-signal" },
  { a: "Billing", t: "invoice #INV-108 sent · ₹48,000", time: "9m", tone: "bg-cyan-ic" },
];

const AGENTS = [
  { name: "Sales Agent", load: 78, status: "active" },
  { name: "Support Agent", load: 46, status: "active" },
  { name: "Qualification Agent", load: 62, status: "active" },
  { name: "Ops Assistant", load: 21, status: "idle" },
];

const BARS = [42, 68, 51, 74, 63, 88, 79, 95, 71, 84, 92, 100];

/** AI Operations Dashboard — a realistic product UI mock. Values are UI demo values. */
export default function OpsDashboard() {
  const [feedIdx, setFeedIdx] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setFeedIdx((i) => (i + 1) % FEED.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative bg-ink-950 hairline clip-corner overflow-hidden shadow-[0_40px_100px_-30px_rgba(0,0,0,.9)]">
      {/* window bar */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-white/[.07] bg-ink-900/80">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-rose-ic/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-ic/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-signal/70" />
        </span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400">ops.itcyber.in — live demo</span>
        <span className="font-mono text-[0.62rem] text-signal flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-signal anim-pulse-dot" aria-hidden /> online
        </span>
      </div>

      <div className="grid sm:grid-cols-[11rem_1fr]">
        {/* sidebar */}
        <div className="hidden sm:block border-r border-white/[.07] p-3 space-y-1 bg-ink-900/50">
          {["Overview", "Agents", "Workflows", "Leads", "Inbox", "Reports"].map((s, i) => (
            <p key={s} className={cn("px-3 h-8 flex items-center text-[0.8rem] font-display font-semibold", i === 0 ? "bg-brand-500/15 text-white border-l-2 border-brand-400" : "text-ink-400")}>
              {s}
            </p>
          ))}
          <div className="pt-4 mt-4 border-t border-white/[.07] space-y-3">
            {AGENTS.map((a) => (
              <div key={a.name}>
                <p className="flex justify-between font-mono text-[0.6rem] text-ink-400 mb-1">
                  <span>{a.name}</span>
                  <span className={a.status === "active" ? "text-signal" : "text-ink-500"}>{a.status}</span>
                </p>
                <div className="h-[3px] bg-ink-700">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-ic transition-all duration-1000" style={{ width: `${reduce ? a.load : a.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { label: "Agents active", val: 7, suffix: "" },
              { label: "Leads qualified · 24h", val: 128, suffix: "" },
              { label: "Workflow runs · 24h", val: 1439, suffix: "" },
              { label: "Avg. response", val: 38, suffix: "s" },
            ].map((s) => (
              <div key={s.label} className="bg-ink-850 hairline p-3.5 clip-corner">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-400">{s.label}</p>
                <p className="font-display font-bold text-[clamp(1.25rem,2vw,1.7rem)] text-white mt-1 tabular-nums">
                  <Counter to={s.val} suffix={s.suffix} />
                </p>
              </div>
            ))}
          </div>

          <div className="mt-2.5 grid lg:grid-cols-[1.25fr_1fr] gap-2.5">
            {/* chart */}
            <div className="bg-ink-850 hairline p-4 clip-corner">
              <p className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-400">
                <span>automated actions · 12 weeks</span>
                <IconPulse size={13} className="text-cyan-ic" />
              </p>
              <div className="mt-4 flex items-end gap-1.5 h-28" role="img" aria-label="Bar chart of automated actions trending upward over twelve weeks">
                {BARS.map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full group cursor-pointer">
                    <div
                      className={cn("w-full transition-all duration-500 group-hover:opacity-100", i === BARS.length - 1 ? "bg-gradient-to-t from-brand-500 to-cyan-ic" : "bg-ink-600 group-hover:bg-brand-500/60")}
                      style={{ height: `${b}%`, opacity: i === BARS.length - 1 ? 1 : 0.75 }}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 font-mono text-[0.6rem] text-ink-500">runs ↗ +steady growth · UI demo values</p>
            </div>

            {/* live feed */}
            <div className="bg-ink-850 hairline p-4 clip-corner overflow-hidden">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-signal anim-pulse-dot" aria-hidden /> live activity
              </p>
              <ul className="mt-3 space-y-2.5" aria-live="polite">
                {[0, 1, 2, 3].map((o) => {
                  const f = FEED[(feedIdx + o) % FEED.length];
                  return (
                    <li key={`${f.t}-${o}`} className={cn("flex items-start gap-2.5 transition-all duration-500", o === 0 ? "opacity-100" : o === 1 ? "opacity-70" : "opacity-40")}>
                      <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", f.tone)} aria-hidden />
                      <p className="min-w-0 text-[0.74rem] leading-snug">
                        <span className="text-ink-100 font-semibold">{f.a}</span>{" "}
                        <span className="text-ink-300">{f.t}</span>{" "}
                        <span className="font-mono text-[0.6rem] text-ink-500">· {f.time}</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
