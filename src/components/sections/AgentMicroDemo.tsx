import { useEffect, useState } from "react";
import { useReducedMotion } from "../../lib/motion";
import { cn } from "../../lib/utils";
import type { Agent } from "../../data/content";
import { IconCheck, IconSpark } from "../icons";

/** Small living demo per agent type — cards that breathe. */
export default function AgentMicroDemo({ demo, tone = "dark" }: { demo: Agent["demo"]; tone?: "dark" | "paper" }) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);

  useEffect(() => {
    if (reduce) {
      setT(4);
      return;
    }
    const id = setInterval(() => setT((v) => v + 1), 1300);
    return () => clearInterval(id);
  }, [reduce]);

  const dark = tone === "dark";
  const sub = "text-ink-400";
  const strong = dark ? "text-ink-100" : "text-ink-700";
  const chip = dark ? "bg-ink-800 hairline text-ink-100" : "bg-white hairline-light text-ink-700";
  const aiChip = "bg-brand-500/15 hairline text-brand-300";
  const step = (n: number) => t % 5 >= n;

  const Fade = ({ on, children, className }: { on: boolean; children: React.ReactNode; className?: string }) => (
    <div className={cn("transition-all duration-500", on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5", className)}>
      {children}
    </div>
  );

  if (demo === "chat")
    return (
      <div className="space-y-1.5" aria-hidden>
        <Fade on>
          <span className={cn("inline-block text-[0.72rem] px-2.5 py-1.5 clip-corner", chip)}>Is the 3BHK at Palm Grove still available?</span>
        </Fade>
        <Fade on={step(1)}>
          <span className={cn("inline-block text-[0.72rem] px-2.5 py-1.5 clip-corner ml-6", aiChip)}>Yes, towers B and C. What budget range are you looking at?</span>
        </Fade>
        <Fade on={step(2)}>
          <span className={cn("inline-block text-[0.72rem] px-2.5 py-1.5 clip-corner", chip)}>Around 1.2Cr. Ready to move in 3 months.</span>
        </Fade>
        <Fade on={step(3)}>
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] text-signal">
            <IconCheck size={11} /> qualified · score 92 · meeting requested
          </span>
        </Fade>
      </div>
    );

  if (demo === "score") {
    const score = reduce ? 92 : Math.min(92, ((t % 5) + 1) * 23 - (t % 2));
    return (
      <div aria-hidden>
        <div className="flex items-end justify-between font-mono text-[0.62rem] uppercase tracking-[0.12em] mb-1.5">
          <span className={sub}>lead score</span>
          <span className={cn("font-display font-bold text-[1.35rem] leading-none tabular-nums", dark ? "text-cyan-ic" : "text-brand-600")}>{score}</span>
        </div>
        <div className={cn("h-1.5", dark ? "bg-ink-700" : "bg-ink-900/10")}>
          <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-ic transition-all duration-700" style={{ width: `${score}%` }} />
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {["budget match", "timeline set", "intent high"].map((tag, i) => (
            <Fade key={tag} on={step(i + 1)}>
              <span className={cn("font-mono text-[0.58rem] px-1.5 py-0.5", chip)}>{tag}</span>
            </Fade>
          ))}
        </div>
      </div>
    );
  }

  if (demo === "ticket")
    return (
      <div className="space-y-1.5" aria-hidden>
        <Fade on>
          <span className={cn("inline-block text-[0.72rem] px-2.5 py-1.5 clip-corner", chip)}>My order 4821 has not arrived yet.</span>
        </Fade>
        <Fade on={step(1)}>
          <span className={cn("inline-block text-[0.72rem] px-2.5 py-1.5 clip-corner ml-6", aiChip)}>It is out for delivery, arriving today by 7 PM.</span>
        </Fade>
        <Fade on={step(2)}>
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] text-signal">
            <IconCheck size={11} /> resolved in 11s · no human needed
          </span>
        </Fade>
      </div>
    );

  if (demo === "calendar")
    return (
      <div aria-hidden>
        <div className="grid grid-cols-4 gap-1">
          {["9:00", "10:30", "11:00", "2:00", "3:30", "4:00", "5:15", "6:00"].map((s, i) => {
            const picked = i === 2;
            return (
              <Fade key={s} on={step(i % 4)}>
                <span className={cn("flex items-center justify-center h-8 font-mono text-[0.66rem] clip-corner transition-colors", picked && step(3) ? "bg-brand-500 text-white" : chip)}>
                  {picked && step(3) ? <IconCheck size={12} /> : s}
                </span>
              </Fade>
            );
          })}
        </div>
        <Fade on={step(4)}>
          <p className="mt-1.5 font-mono text-[0.6rem] text-signal flex items-center gap-1.5">
            <IconCheck size={11} /> booked · reminders set
          </p>
        </Fade>
      </div>
    );

  if (demo === "report")
    return (
      <div className="font-mono text-[0.66rem] space-y-1.5" aria-hidden>
        <Fade on>
          <p className={sub}>revenue vs target <span className="text-signal">+8.4 pct</span></p>
        </Fade>
        <Fade on={step(1)}>
          <p className={sub}>open tickets <span className={strong}>14 (down 6)</span></p>
        </Fade>
        <Fade on={step(2)}>
          <p className={sub}>refund spike on <span className="text-amber-ic">SKU-209</span></p>
        </Fade>
        <Fade on={step(3)}>
          <p className={strong}>morning brief sent to 3 managers</p>
        </Fade>
      </div>
    );

  return (
    <div className="font-mono text-[0.66rem] space-y-1.5" aria-hidden>
      <Fade on>
        <p className={sub}>agent new --logic your-business-sop</p>
      </Fade>
      <Fade on={step(1)}>
        <p className={sub}>parsing business rules: 14 steps</p>
      </Fade>
      <Fade on={step(2)}>
        <p className={sub}>wiring CRM, WhatsApp and ERP</p>
      </Fade>
      <Fade on={step(3)}>
        <p className="flex items-center gap-1.5 text-signal">
          <IconSpark size={11} /> agent ready · human boundaries set
        </p>
      </Fade>
    </div>
  );
}
