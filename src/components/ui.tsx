import { forwardRef, useId, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Reveal, Scramble } from "../lib/motion";
import { IconArrow, IconChevron } from "./icons";

/* ---------------------------------- utils ---------------------------------- */

/* --------------------------------- Button ---------------------------------- */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "light" | "dark" | "whatsapp";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  to?: string;
  href?: string;
  arrow?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "primary", size = "md", loading, to, href, arrow, className, children, disabled, ...rest },
  ref
) {
  const sizes = {
    sm: "text-[0.82rem] px-4 h-9",
    md: "text-[0.92rem] px-6 h-11",
    lg: "text-[1rem] px-7 h-[3.25rem]",
  }[size];

  const variants = {
    primary:
      "bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-600 shadow-[0_0_0_1px_rgba(92,145,255,.4),0_8px_30px_-8px_rgba(62,123,255,.55)] hover:shadow-[0_0_0_1px_rgba(143,180,255,.6),0_12px_40px_-8px_rgba(62,123,255,.8)] hover:-translate-y-px",
    ghost:
      "bg-transparent text-ink-50 hairline hover:bg-white/[.06] hover:text-white active:translate-y-px",
    light:
      "bg-ink-900 text-white hover:bg-ink-700 active:translate-y-px shadow-sm",
    dark: "bg-white text-ink-900 hover:bg-ink-50 active:translate-y-px",
    whatsapp:
      "bg-[#1FAF63] text-white hover:bg-[#25c96f] active:translate-y-px shadow-[0_8px_30px_-10px_rgba(31,175,99,.7)]",
  }[variant];

  const cls = cn(
    "group/btn relative inline-flex items-center justify-center gap-2 font-display font-semibold tracking-tight transition-all duration-300 clip-corner disabled:opacity-50 disabled:pointer-events-none select-none",
    sizes,
    variants,
    className
  );

  const inner = (
    <>
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />
      )}
      {children}
      {arrow && !loading && (
        <IconArrow size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
      )}
    </>
  );

  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href) return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>{inner}</a>;
  return (
    <button ref={ref} className={cls} disabled={disabled || loading} {...rest}>
      {inner}
    </button>
  );
});

/* --------------------------------- Section ---------------------------------- */

export function Section({
  id,
  tone = "dark",
  className,
  children,
}: {
  id?: string;
  tone?: "dark" | "deeper" | "paper";
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    dark: "bg-ink-900 text-ink-100",
    deeper: "bg-ink-950 text-ink-100",
    paper: "bg-paper text-ink-800",
  }[tone];
  return (
    <section id={id} className={cn("relative py-[clamp(4rem,9vw,7.5rem)] overflow-hidden", tones, className)}>
      {children}
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  tone?: "dark" | "paper";
  align?: "left" | "center";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center", dark ? "text-cyan-ic" : "text-brand-600")}>
          <span className={cn("h-px w-8", dark ? "bg-cyan-ic/60" : "bg-brand-600/60")} aria-hidden />
          <Scramble text={eyebrow} />
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={cn("font-display font-bold tracking-tight text-balance mt-4 text-[clamp(1.7rem,4vw,2.9rem)] leading-[1.08]", dark ? "text-white" : "text-ink-900")}>
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <p className={cn("mt-4 text-[clamp(1rem,1.4vw,1.13rem)] leading-relaxed", dark ? "text-ink-200" : "text-ink-500")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------------------------- Badge ----------------------------------- */

export function Badge({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "paper" | "signal" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] px-2.5 py-1",
        tone === "dark" && "text-cyan-ic bg-cyan-ic/[.08] hairline",
        tone === "paper" && "text-brand-600 bg-brand-500/[.08] hairline-light",
        tone === "signal" && "text-signal bg-signal/[.08] hairline"
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------ corner-tile icon ---------------------------- */

export function IconTile({ children, tone = "dark", className }: { children: ReactNode; tone?: "dark" | "paper"; className?: string }) {
  const c = tone === "dark" ? "text-cyan-ic border-white/15" : "text-brand-600 border-ink-900/20";
  return (
    <span className={cn("relative inline-flex items-center justify-center w-11 h-11 border transition-colors duration-300", c, className)}>
      <span className="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-current" aria-hidden />
      <span className="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-current" aria-hidden />
      {children}
    </span>
  );
}

/* ---------------------------------- Tabs ------------------------------------ */

export function Tabs({ tabs, active, onChange, tone = "dark" }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; tone?: "dark" | "paper" }) {
  return (
    <div role="tablist" aria-label="Solution areas" className="flex gap-1.5 flex-wrap">
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className={cn(
              "font-display text-[0.9rem] font-semibold px-4 h-10 transition-all duration-300 clip-corner",
              on
                ? "bg-brand-500 text-white shadow-[0_6px_24px_-6px_rgba(62,123,255,.6)]"
                : tone === "dark"
                  ? "text-ink-200 hairline hover:text-white hover:bg-white/[.05]"
                  : "text-ink-500 hairline-light hover:text-ink-900 hover:bg-ink-900/[.04]"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------- Accordion --------------------------------- */

export function Accordion({ items, tone = "dark" }: { items: { q: string; a: string }[]; tone?: "dark" | "paper" }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-current/10">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={i}>
            <button
              className={cn("w-full flex items-center justify-between gap-4 py-5 text-left group", tone === "dark" ? "text-white" : "text-ink-900")}
              onClick={() => setOpen(on ? null : i)}
              aria-expanded={on}
            >
              <span className="font-display font-semibold text-[1.02rem]">{it.q}</span>
              <IconChevron size={16} className={cn("shrink-0 transition-transform duration-300", on && "rotate-90", tone === "dark" ? "text-cyan-ic" : "text-brand-600")} />
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)]", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className={cn("pb-5 leading-relaxed max-w-2xl", tone === "dark" ? "text-ink-200" : "text-ink-500")}>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- Form fields ------------------------------- */

const fieldCls = (tone: "dark" | "paper", error?: string) =>
  cn(
    "w-full h-12 px-4 text-[0.95rem] transition-all duration-300 clip-corner outline-none",
    tone === "dark"
      ? "bg-ink-800/80 text-white placeholder:text-ink-400 hairline focus:bg-ink-800 focus:shadow-[inset_0_0_0_1px_rgba(92,145,255,.7),0_0_24px_-6px_rgba(62,123,255,.35)]"
      : "bg-white text-ink-900 placeholder:text-ink-300 hairline-light focus:shadow-[inset_0_0_0_1px_rgba(46,99,232,.6),0_4px_16px_-8px_rgba(20,32,58,.2)]",
    error && "shadow-[inset_0_0_0_1px_rgba(255,122,144,.7)]"
  );

export function Field({
  label,
  name,
  tone = "dark",
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  tone?: "dark" | "paper";
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className={cn("font-mono text-[0.68rem] uppercase tracking-[0.16em]", tone === "dark" ? "text-ink-300" : "text-ink-500")}>
        {label}
      </label>
      {children}
      {hint && !error && <p className={cn("text-xs", tone === "dark" ? "text-ink-400" : "text-ink-400")}>{hint}</p>}
      {error && (
        <p className="text-xs text-rose-ic flex items-center gap-1.5" role="alert">
          <span className="inline-block w-1 h-1 bg-rose-ic rounded-full" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ tone = "dark", error, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { tone?: "dark" | "paper"; error?: boolean }) {
  return <input className={cn(fieldCls(tone, error ? "e" : undefined), className)} {...rest} />;
}

export function TextArea({ tone = "dark", error, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { tone?: "dark" | "paper"; error?: boolean }) {
  return <textarea className={cn(fieldCls(tone, error ? "e" : undefined), "h-auto min-h-[7.5rem] py-3 resize-y", className)} {...rest} />;
}

export function Select({ tone = "dark", error, className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { tone?: "dark" | "paper"; error?: boolean }) {
  const id = useId();
  return (
    <span className="relative block">
      <select id={id} className={cn(fieldCls(tone, error ? "e" : undefined), "appearance-none pr-10 cursor-pointer", className)} {...rest}>
        {children}
      </select>
      <IconChevron size={14} className={cn("absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none", tone === "dark" ? "text-ink-300" : "text-ink-400")} />
    </span>
  );
}

/* ------------------------------- CTA band (end) ------------------------------ */

export function CtaBand({
  title,
  text,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: {
  title: string;
  text: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}) {
  return (
    <div className="relative clip-corner bg-ink-800 hairline overflow-hidden">
      <div className="absolute inset-0 grid-bg anim-pan opacity-60" aria-hidden />
      <div className="absolute -top-24 right-[-10%] w-[26rem] h-[26rem] rounded-full bg-brand-500/[.14] blur-[90px]" aria-hidden />
      <div className="relative px-[clamp(1.5rem,4vw,3.5rem)] py-[clamp(2.5rem,5vw,4rem)] flex flex-col lg:flex-row lg:items-center gap-8">
        <div className="max-w-xl flex-1">
          <p className="eyebrow text-cyan-ic">{"// next step"}</p>
          <h2 className="font-display font-bold text-white text-[clamp(1.6rem,3.4vw,2.5rem)] tracking-tight mt-3 leading-tight">{title}</h2>
          <p className="text-ink-200 mt-3 leading-relaxed">{text}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button to={primaryTo} size="lg" arrow>{primaryLabel}</Button>
          {secondaryLabel && secondaryTo && (
            <Button to={secondaryTo} variant="ghost" size="lg">{secondaryLabel}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
