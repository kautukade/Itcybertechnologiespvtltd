import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { useReducedMotion } from "../lib/motion";

export default function NotFound() {
  const reduce = useReducedMotion();
  return (
    <section className="relative bg-ink-950 text-ink-100 min-h-[70vh] flex items-center overflow-hidden noise">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="absolute inset-0" style={{ background: "radial-gradient(40rem 26rem at 50% 30%, rgba(255,122,144,.08), transparent 60%)" }} aria-hidden />
      <div className="relative wrap py-20 grid lg:grid-cols-[auto_1fr] gap-12 items-center max-w-5xl mx-auto">
        {/* broken node graphic */}
        <svg viewBox="0 0 220 180" className="w-52 h-auto mx-auto" role="img" aria-label="A workflow diagram with one broken node">
          <path d="M20 40 H80" stroke="#2a3d66" strokeWidth="1.5" />
          <path d="M20 140 H80" stroke="#2a3d66" strokeWidth="1.5" />
          <path d="M110 40 H150 M110 140 H150" stroke="#2a3d66" strokeWidth="1.5" />
          <rect x="8" y="28" width="24" height="24" fill="#0d1628" stroke="#3e5686" />
          <rect x="8" y="128" width="24" height="24" fill="#0d1628" stroke="#3e5686" />
          <rect x="150" y="78" width="44" height="24" fill="#0d1628" stroke="#3e5686" />
          <path d="M110 40 C 140 40, 140 84, 150 88 M110 140 C 140 140, 140 96, 150 94" stroke="#2a3d66" strokeWidth="1.5" fill="none" />
          {/* broken node */}
          <rect x="86" y="78" width="44" height="24" fill="#0d1628" stroke="#ff7a90" strokeDasharray="4 3" />
          <text x="108" y="94" textAnchor="middle" fill="#ff7a90" fontFamily="IBM Plex Mono, monospace" fontSize="11">ERR</text>
          {!reduce && (
            <>
              <circle cx="108" cy="90" r="4" fill="none" stroke="#ff7a90">
                <animate attributeName="r" values="4;22" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="194" cy="90" r="3" fill="#56d9ff">
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </svg>

        <div>
          <p className="eyebrow text-rose-ic">error 404 · unhandled node</p>
          <h1 className="font-display font-bold text-white tracking-tight mt-4 text-[clamp(2rem,5vw,3.6rem)] leading-[1.05]">
            This workflow reached the <span className="text-rose-ic">wrong node.</span>
          </h1>
          <p className="text-ink-200 mt-4 max-w-lg leading-relaxed">
            The page you requested doesn't exist. Let's route you somewhere that does —
            the rest of the system is exactly where you left it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/" arrow>Return Home</Button>
            <Button to="/services" variant="ghost">Explore Services</Button>
            <Button to="/contact" variant="ghost">Contact ITCYBER</Button>
          </div>
          <p className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">
            route: GET {typeof window !== "undefined" ? window.location.pathname : ""} → 404 · nothing was lost
          </p>
        </div>
      </div>
    </section>
  );
}
