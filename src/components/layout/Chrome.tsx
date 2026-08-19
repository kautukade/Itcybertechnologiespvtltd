import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { site, waLink } from "../../data/site";
import { IconWhatsApp } from "../icons";
import { cn } from "../../lib/utils";
import { useReducedMotion } from "../../lib/motion";

/** Scroll restoration between routes (instant, no jarring smooth scroll). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

/** Thin scroll progress line under the header. */
export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none" aria-hidden>
      <div className="h-full bg-gradient-to-r from-brand-500 via-cyan-ic to-brand-500 origin-left transition-transform duration-150 ease-out" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

/** Floating WhatsApp button — appears after scrolling, never covers content on mobile.
 *  Hidden entirely when the company WhatsApp number isn't configured. */
export function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = waLink("Hi ITCYBER — I'd like to discuss AI automation for my business.");
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label={site.cta.whatsapp}
      className={cn(
        "fixed z-40 right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] sm:right-6 sm:bottom-6 flex items-center gap-0 group transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
        show ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      )}
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap font-display font-semibold text-[0.85rem] text-white group-hover:max-w-[13rem] group-hover:px-4 group-hover:mr-[-2px] transition-all duration-500 h-12 inline-flex items-center clip-corner bg-ink-800 hairline">
        {site.cta.whatsapp}
      </span>
      <span className="relative w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center bg-[#1FAF63] text-white clip-corner shadow-[0_10px_30px_-8px_rgba(31,175,99,.7)] group-hover:bg-[#25c96f] transition-colors">
        <IconWhatsApp size={24} />
        <span className="absolute inset-0 clip-corner border border-signal/60 anim-ring" aria-hidden />
      </span>
    </a>
  );
}

/** Subtle cursor-follow light — fine pointers only, disabled for reduced motion. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="fixed inset-0 z-[45] pointer-events-none overflow-hidden">
      <div
        ref={ref}
        className="w-[520px] h-[520px] rounded-full opacity-[0.05] transition-transform duration-300 ease-out"
        style={{ background: "radial-gradient(circle, #56d9ff 0%, transparent 60%)" }}
      />
    </div>
  );
}
