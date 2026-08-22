import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site, nav } from "../../data/site";
import { useSiteSettings } from "../../lib/cms";
import { useAnnouncement } from "../../lib/cms";
import { serviceCategories, industries, functionSolutions } from "../../data/content";
import { cn } from "../../lib/utils";
import { Logo, IconMenu, IconClose, IconChevron, IconArrow, IconAgent, IconFlow, IconCode, IconGlobe, IconDevice, IconSpark, IconArrowUpRight } from "../icons";
import { Button } from "../ui";

/* Canonical five-category icon map (ids: ai | software | web | apps | automation). */
const serviceIcons: Record<string, React.ReactNode> = {
  ai: <IconAgent size={20} />,
  software: <IconCode size={20} />,
  web: <IconGlobe size={20} />,
  apps: <IconDevice size={20} />,
  automation: <IconFlow size={20} />,
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>("services");
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [announceHidden, setAnnounceHidden] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const settings = useSiteSettings();
  const navOverride = (settings._navigation ?? {}) as { announcement?: Partial<{ show: boolean }> };
  const announcement = useAnnouncement();
  const ann = {
    show: (navOverride.announcement?.show ?? site.announcement.show) && !announcement.dismissed,
    text: announcement.text,
    cta: announcement.cta,
    to: announcement.to,
  };
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMega(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* keyboard: trap focus inside the mobile sheet, Escape closes, focus returns to trigger */
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileDialogRef.current) mobileDialogRef.current.inert = !mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : menuButtonRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab" || !mobileDialogRef.current) return;
      const focusable = Array.from(
        mobileDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      queueMicrotask(() => previouslyFocused?.focus());
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!openMega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMega(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMega]);

  const enter = (key: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenMega(key);
  };
  const leave = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMega(null), 140);
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative font-display font-medium text-[0.92rem] tracking-tight px-3 h-9 inline-flex items-center transition-colors duration-300",
      isActive ? "text-white" : "text-ink-200 hover:text-white"
    );

  return (
    <>
      {ann.show && !announceHidden && (
        <div className="relative z-50 bg-ink-800 border-b border-white/[.07]">
          <div className="wrap h-9 flex items-center justify-center gap-3 text-[0.78rem]">
            <span className="hidden sm:inline-flex w-1.5 h-1.5 bg-signal rounded-full anim-pulse-dot" aria-hidden />
            <p className="text-ink-200 truncate">{ann.text}</p>
            <Link to={ann.to} className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-cyan-ic hover:text-white transition-colors inline-flex items-center gap-1.5">
              {ann.cta} <IconArrow size={12} />
            </Link>
            <button onClick={() => { announcement.dismiss(); setAnnounceHidden(true); }} aria-label="Dismiss announcement" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-white transition-colors p-1">
              <IconClose size={13} />
            </button>
          </div>
        </div>
      )}

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500",
          scrolled ? "bg-ink-950/85 backdrop-blur-xl border-b border-white/[.08] shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)]" : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="wrap h-[4.4rem] flex items-center justify-between gap-4">
          <Link to="/" aria-label="ITCYBER home" className="shrink-0 text-white hover:opacity-90 transition-opacity">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5">
            {nav.primary.map((item) =>
              "mega" in item && item.mega ? (
                <div key={item.label} className="relative" onMouseEnter={() => enter(item.mega!)} onMouseLeave={leave}>
                  <button
                    className={cn(linkCls({ isActive: false }), "cursor-pointer", openMega === item.mega && "text-white")}
                    aria-expanded={openMega === item.mega}
                    onFocus={() => enter(item.mega!)}
                  >
                    {item.label}
                    <IconChevron size={12} className={cn("ml-1 transition-transform duration-300", openMega === item.mega && "rotate-90")} />
                  </button>
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-300",
                      openMega === item.mega ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                    )}
                  >
                    <MegaPanel kind={item.mega!} />
                  </div>
                </div>
              ) : (
                <NavLink key={item.label} to={item.to} className={linkCls}>
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span className={cn("absolute left-3 right-3 -bottom-px h-px bg-cyan-ic transition-transform duration-300 origin-left", isActive ? "scale-x-100" : "scale-x-0")} aria-hidden />
                    </>
                  )}
                </NavLink>
              )
            )}
            <div className="relative" onMouseEnter={() => enter("resources")} onMouseLeave={leave}>
              <button className={cn(linkCls({ isActive: false }), "cursor-pointer", openMega === "resources" && "text-white")} aria-expanded={openMega === "resources"} onFocus={() => enter("resources")}>
                Resources
                <IconChevron size={12} className={cn("ml-1 transition-transform duration-300", openMega === "resources" && "rotate-90")} />
              </button>
              <div
                className={cn(
                  "absolute right-0 top-full pt-3 transition-all duration-300",
                  openMega === "resources" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                )}
              >
                <div className="w-[24rem] bg-ink-850/95 backdrop-blur-xl hairline clip-corner p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
                  {nav.resources.map((r) => (
                    <Link key={r.label} to={r.to} className="group flex items-start gap-3 p-3 hover:bg-white/[.05] transition-colors">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-cyan-ic shrink-0" aria-hidden />
                      <span>
                        <span className="block font-display font-semibold text-[0.95rem] text-white group-hover:text-cyan-ic transition-colors">{r.label}</span>
                        <span className="block text-[0.82rem] text-ink-300 mt-0.5">{r.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button to="/contact" size="sm" arrow>
              {site.cta.consultation}
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            className="lg:hidden w-11 h-11 inline-flex items-center justify-center text-white hairline clip-corner hover:bg-white/[.06] transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <IconMenu size={20} />
          </button>
        </div>
      </header>

      <div
        ref={mobileDialogRef}
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-50 lg:hidden flex flex-col bg-ink-950 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
        <div className="relative wrap h-[4.4rem] flex items-center justify-between">
          <Link to="/" className="text-white" onClick={() => setMobileOpen(false)}>
            <Logo />
          </Link>
          <button ref={closeRef} className="w-11 h-11 inline-flex items-center justify-center text-white hairline clip-corner" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu">
            <IconClose size={18} />
          </button>
        </div>

        <nav aria-label="Mobile" className={cn("relative flex-1 overflow-y-auto px-[clamp(1.125rem,4vw,2.5rem)] pb-6 transition-transform duration-500", mobileOpen ? "translate-y-0" : "translate-y-6")}>
          {[
            { key: "services", label: "Services", links: serviceCategories.map((s) => ({ label: s.title, to: s.page, blurb: s.tagline })) },
            { key: "solutions", label: "Solutions", links: [{ label: "All Industries", to: "/solutions", blurb: "8 industry playbooks" }, ...industries.slice(0, 6).map((i) => ({ label: i.name, to: `/solutions/${i.slug}`, blurb: i.short.split(".")[0] + "." }))] },
            { key: "company", label: "Company", links: [
              { label: "About", to: "/about", blurb: "How we think about AI" },
              { label: "Work", to: "/work", blurb: "Engagement blueprints" },
              { label: "Careers", to: "/careers", blurb: "Live open roles" },
              { label: "Contact", to: "/contact", blurb: "Start a project" },
            ]},
          ].map((group) => {
            const on = mobileGroup === group.key;
            return (
              <div key={group.key} className="border-b border-white/[.08]">
                <button
                  className="w-full h-14 flex items-center justify-between text-left"
                  onClick={() => setMobileGroup(on ? null : group.key)}
                  aria-expanded={on}
                >
                  <span className="font-display font-bold text-[1.35rem] text-white tracking-tight">{group.label}</span>
                  <IconChevron size={16} className={cn("text-cyan-ic transition-transform duration-300", on && "rotate-90")} />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)]", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <ul className="pb-4 space-y-1">
                      {group.links.map((l) => (
                        <li key={l.label}>
                          <Link to={l.to} className="flex items-baseline justify-between gap-3 py-2 group" onClick={() => setMobileOpen(false)}>
                            <span className="font-display font-semibold text-ink-100 group-hover:text-cyan-ic transition-colors">{l.label}</span>
                            <span className="text-[0.72rem] font-mono text-ink-400 truncate">{l.blurb}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-6 grid grid-cols-2 gap-2.5">
            {nav.primary.filter((n) => !("mega" in n && n.mega)).map((n) => (
              <Link key={n.label} to={n.to} onClick={() => setMobileOpen(false)} className="h-11 inline-flex items-center justify-center hairline text-ink-100 font-display font-semibold text-[0.92rem] clip-corner hover:bg-white/[.05]">
                {n.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="relative p-[clamp(1.125rem,4vw,2.5rem)] pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] border-t border-white/[.08] bg-ink-900/80 backdrop-blur-xl">
          <Button to="/contact" className="w-full" size="lg" arrow onClick={() => setMobileOpen(false)}>
            {site.cta.consultation}
          </Button>
          <Link to="/contact?mode=assessment" onClick={() => setMobileOpen(false)} className="mt-2.5 block text-center font-mono text-[0.68rem] uppercase tracking-[0.14em] text-cyan-ic hover:text-white transition-colors">
            or run the 2-min automation assessment →
          </Link>
          <p className="mt-3 text-center font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-400">
            {settings.contact.email ? `${settings.contact.email} · ` : ""}{settings.contact.hours}
          </p>
        </div>
      </div>
    </>
  );
}

function MegaPanel({ kind }: { kind: string }) {
  if (kind === "services") {
    return (
      <div className="w-[52rem] bg-ink-850/95 backdrop-blur-xl hairline clip-corner shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] p-2 grid grid-cols-6">
        {serviceCategories.map((s) => (
          <Link key={s.id} to={s.page} className="group col-span-2 p-4 hover:bg-white/[.05] transition-colors flex flex-col">
            <span className="text-cyan-ic mb-3 transition-transform duration-300 group-hover:-translate-y-0.5">{serviceIcons[s.id]}</span>
            <span className="font-mono text-[0.62rem] text-ink-400 tracking-[0.2em]">{s.index}</span>
            <span className="font-display font-bold text-white text-[1.02rem] mt-1 leading-tight group-hover:text-cyan-ic transition-colors">{s.title}</span>
            <span className="text-[0.8rem] text-ink-300 mt-1.5 leading-snug">{s.tagline}</span>
            <span className="mt-3 inline-flex items-center gap-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-brand-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              {s.pageLabel} <IconArrow size={11} />
            </span>
          </Link>
        ))}
        <Link
          to="/contact?mode=assessment"
          className="group col-span-2 m-1 hairline bg-brand-500/[.08] clip-corner p-4 flex flex-col justify-between hover:bg-brand-500/[.14] transition-colors"
        >
          <span className="text-brand-300 mb-3"><IconSpark size={20} /></span>
          <span>
            <span className="font-display font-bold text-white text-[1.02rem] leading-tight block">Not sure where to start?</span>
            <span className="text-[0.8rem] text-ink-300 mt-1.5 leading-snug block">Run the 2-minute assessment — website, app, software, AI or automation.</span>
          </span>
          <span className="mt-3 inline-flex items-center gap-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-cyan-ic">
            {site.cta.assessment} <IconArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    );
  }

  if (kind === "solutions") {
    return (
      <div className="w-[46rem] bg-ink-850/95 backdrop-blur-xl hairline clip-corner shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] p-2 grid grid-cols-5">
        <div className="col-span-2 p-4 border-r border-white/[.07]">
          <p className="font-mono text-[0.62rem] text-ink-400 tracking-[0.2em] uppercase">By business function</p>
          <ul className="mt-3 space-y-0.5">
            {functionSolutions.map((f) => (
              <li key={f.id}>
                <Link to="/#solutions" className="flex items-center gap-2.5 py-1.5 group">
                  <span className="w-1 h-1 bg-brand-400 group-hover:bg-cyan-ic transition-colors" aria-hidden />
                  <span className="font-display font-semibold text-[0.92rem] text-ink-100 group-hover:text-white transition-colors">{f.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3 p-4">
          <p className="font-mono text-[0.62rem] text-ink-400 tracking-[0.2em] uppercase">By industry</p>
          <ul className="mt-3 grid grid-cols-2 gap-0.5">
            {industries.map((i) => (
              <li key={i.slug}>
                <Link to={`/solutions/${i.slug}`} className="flex items-center gap-2.5 py-1.5 group">
                  <span className="w-1 h-1 bg-brand-400 group-hover:bg-cyan-ic transition-colors" aria-hidden />
                  <span className="font-display font-semibold text-[0.92rem] text-ink-100 group-hover:text-white transition-colors">{i.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/solutions" className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-cyan-ic hover:text-white transition-colors">
            All industry playbooks <IconArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  const links = [
    { label: "About", to: "/about", blurb: "Practical AI for real businesses" },
    { label: "Work", to: "/work", blurb: "How engagements are architected" },
    { label: "Careers", to: "/careers", blurb: "Build systems that run companies" },
    { label: "Contact", to: "/contact", blurb: "Tell us what you want to build" },
  ];
  return (
    <div className="w-[26rem] bg-ink-850/95 backdrop-blur-xl hairline clip-corner shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] p-3">
      {links.map((l) => (
        <Link key={l.label} to={l.to} className="group flex items-start gap-3 p-3 hover:bg-white/[.05] transition-colors">
          <span className="mt-1.5 w-1.5 h-1.5 bg-cyan-ic shrink-0" aria-hidden />
          <span>
            <span className="block font-display font-semibold text-[0.98rem] text-white group-hover:text-cyan-ic transition-colors">{l.label}</span>
            <span className="block text-[0.82rem] text-ink-300 mt-0.5">{l.blurb}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
