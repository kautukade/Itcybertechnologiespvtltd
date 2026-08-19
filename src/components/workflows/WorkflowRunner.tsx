import { useEffect, useRef, useState } from "react";
import { scenarios } from "../../data/content";
import { useReducedMotion } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { IconCheck, IconSpark } from "../icons";

const toneColor: Record<string, string> = {
  info: "#56D9FF",
  ai: "#8FB4FF",
  action: "#FFB454",
  done: "#3DDC97",
};

/** Interactive "Watch an AI Workflow Run" demo. */
export default function WorkflowRunner() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(true);
  const reduce = useReducedMotion();
  const timer = useRef<number | null>(null);

  const scenario = scenarios.find((s) => s.id === scenarioId)!;
  const total = scenario.steps.length;

  useEffect(() => {
    setStep(0);
    setRunning(true);
  }, [scenarioId]);

  useEffect(() => {
    if (!running || reduce) {
      if (reduce) setStep(total);
      return;
    }
    if (step >= total) {
      const t = window.setTimeout(() => {
        setStep(0); // loop the run
      }, 3200);
      return () => window.clearTimeout(t);
    }
    timer.current = window.setTimeout(() => setStep((s) => s + 1), 1150);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [step, running, total, reduce]);

  const pick = (id: string) => setScenarioId(id);

  return (
    <div>
      {/* scenario selector */}
      <div role="tablist" aria-label="Workflow scenarios" className="flex gap-1.5 flex-wrap mb-6">
        {scenarios.map((s) => {
          const on = s.id === scenarioId;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={on}
              onClick={() => pick(s.id)}
              className={cn(
                "font-display text-[0.88rem] font-semibold px-4 h-10 clip-corner transition-all duration-300",
                on ? "bg-brand-500 text-white shadow-[0_6px_24px_-6px_rgba(62,123,255,.6)]" : "hairline text-ink-200 hover:text-white hover:bg-white/[.05]"
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-4">
        {/* console */}
        <div className="relative bg-ink-950/80 hairline clip-corner overflow-hidden flex flex-col min-h-[26rem]">
          <div className="flex items-center justify-between px-4 h-11 border-b border-white/[.07] bg-ink-900/70">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-300 flex items-center gap-2">
              <span className="flex gap-1.5" aria-hidden>
                <span className="w-2 h-2 rounded-full bg-rose-ic/70" /><span className="w-2 h-2 rounded-full bg-amber-ic/70" /><span className="w-2 h-2 rounded-full bg-signal/70" />
              </span>
              itcyber://workflow-runner
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRunning((r) => !r)}
                className="font-mono text-[0.62rem] uppercase tracking-[0.14em] px-2.5 h-7 hairline text-ink-200 hover:text-white hover:bg-white/[.06] transition-colors"
              >
                {running ? "Pause" : "Resume"}
              </button>
              <button
                onClick={() => {
                  setStep(0);
                  setRunning(true);
                }}
                className="font-mono text-[0.62rem] uppercase tracking-[0.14em] px-2.5 h-7 hairline text-cyan-ic hover:bg-white/[.06] transition-colors"
              >
                Replay
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 font-mono text-[0.74rem] leading-[1.9] overflow-hidden" aria-live="polite">
            <p className="text-ink-400">
              <span className="text-signal">▸ trigger</span> — {scenario.trigger}
            </p>
            {scenario.steps.map((s, i) => {
              const done = i < step;
              const current = i === step && running;
              const visible = i <= step;
              if (!visible) return null;
              return (
                <p key={i} className={cn("transition-opacity duration-500", done ? "text-ink-300" : "text-white")}>
                  <span style={{ color: toneColor[s.tone] }}>{done ? "✓" : "▸"}</span> {s.node.toLowerCase()} :: {s.action.toLowerCase()}
                  {current && <span className="anim-blink text-cyan-ic">▊</span>}
                  {done && <span className="text-ink-500"> — {s.detail}</span>}
                </p>
              );
            })}
            {step >= total && (
              <p className="text-signal mt-1">
                ✓ run complete · {total} steps · 0 manual touches <span className="text-ink-500">(demo)</span>
              </p>
            )}
          </div>

          {/* progress */}
          <div className="px-4 pb-3">
            <div className="h-[3px] bg-ink-700 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-ic transition-all duration-700 ease-out" style={{ width: `${Math.min(100, (step / total) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* pipeline visual */}
        <div className="relative bg-ink-850/70 hairline clip-corner p-5 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
          <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 mb-4">pipeline</p>
          <ol className="relative space-y-1.5">
            {scenario.steps.map((s, i) => {
              const done = i < step;
              const current = i === step && running;
              return (
                <li
                  key={i}
                  className={cn(
                    "relative flex items-center gap-3 p-3 clip-corner transition-all duration-500 border",
                    current ? "border-cyan-ic/60 bg-cyan-ic/[.06]" : done ? "border-white/[.07] bg-white/[.03]" : "border-transparent opacity-40"
                  )}
                >
                  <span
                    className={cn("w-7 h-7 shrink-0 inline-flex items-center justify-center border font-mono text-[0.62rem] transition-all duration-500", done ? "border-signal/60 text-signal bg-signal/[.08]" : current ? "border-cyan-ic text-cyan-ic" : "border-ink-500 text-ink-400")}
                    aria-hidden
                  >
                    {done ? <IconCheck size={13} /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block font-display font-semibold text-[0.92rem] leading-tight", current ? "text-white" : done ? "text-ink-100" : "text-ink-300")}>
                      {s.action}
                    </span>
                    <span className="block text-[0.76rem] font-mono text-ink-400 truncate">{s.detail}</span>
                  </span>
                  {s.tone === "ai" && (
                    <span className="ml-auto shrink-0 inline-flex items-center gap-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-brand-300 border border-brand-400/40 px-1.5 py-0.5">
                      <IconSpark size={10} /> ai
                    </span>
                  )}
                  {current && !reduce && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-ic" style={{ boxShadow: "0 0 12px rgba(86,217,255,.9)" }} aria-hidden />}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
