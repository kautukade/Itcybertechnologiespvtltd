/** Custom inline SVG icon set — single stroke language (1.6px), technical feel. */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (p: P) => {
  const { size = 20, ...rest } = p;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
};

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const IconArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 17.5 17.5 6.5M8.5 6.5h9v9" />
  </svg>
);

export const IconNode = (p: P) => (
  <svg {...base(p)}>
    <circle cx="5" cy="12" r="2.4" />
    <circle cx="19" cy="5.5" r="2.4" />
    <circle cx="19" cy="18.5" r="2.4" />
    <path d="M7.2 11 16.8 6.3M7.2 13l9.6 4.7" />
  </svg>
);

export const IconAgent = (p: P) => (
  <svg {...base(p)}>
    <rect x="4.5" y="7" width="15" height="11" rx="2.5" />
    <path d="M12 7V3.8M9 3.8h6" />
    <circle cx="9.2" cy="12.2" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="12.2" r="1.15" fill="currentColor" stroke="none" />
    <path d="M9.5 15.2h5" />
  </svg>
);

export const IconFlow = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="6" height="5" rx="1.2" />
    <rect x="15" y="15" width="6" height="5" rx="1.2" />
    <path d="M9 6.5h4.5a2.5 2.5 0 0 1 2.5 2.5v6" />
    <path d="M13.5 12.5 16 15l2.5-2.5" />
  </svg>
);

export const IconCode = (p: P) => (
  <svg {...base(p)}>
    <path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.2 5.5l-2.4 13" />
  </svg>
);

export const IconPlug = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 3.5V8M15 3.5V8" />
    <path d="M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0Z" />
    <path d="M12 17v3.5" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 5 5.8v5.4c0 4.4 2.9 7.6 7 9.3 4.1-1.7 7-4.9 7-9.3V5.8Z" />
    <path d="m9 11.6 2.2 2.2L15.4 9.5" />
  </svg>
);

export const IconWhatsApp = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.2A9.8 9.8 0 0 0 2.2 12c0 1.7.45 3.4 1.3 4.85L2.1 21.9l5.3-1.35A9.8 9.8 0 1 0 12 2.2Zm0 1.8a8 8 0 1 1-4.05 14.9l-.3-.18-3 .77.8-2.92-.2-.3A8 8 0 0 1 12 4Zm-3.1 3.9c-.18 0-.47.07-.71.33-.24.27-.94.92-.94 2.24 0 1.32.96 2.6 1.1 2.78.13.18 1.87 2.98 4.63 4.06 2.29.9 2.76.72 3.25.67.5-.04 1.6-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.31-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07a7.4 7.4 0 0 1-2.18-1.34 8.1 8.1 0 0 1-1.51-1.88c-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.6-1.5-.85-2.03-.2-.46-.42-.47-.6-.48h-.51Z" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 7h17M3.5 12h17M3.5 17h10" />
  </svg>
);

export const IconCompass = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2 5-5 2 2-5Z" />
  </svg>
);

export const IconBlueprint = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
    <path d="M3.5 9h6V3.5M9.5 9v11.5M9.5 15h11" />
  </svg>
);

export const IconRoute = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="18.5" r="2.2" />
    <circle cx="18" cy="5.5" r="2.2" />
    <path d="M8.2 18.5h7.3a3 3 0 0 0 0-6H8.5a3 3 0 0 1 0-6h7.3" />
  </svg>
);

export const IconLayers = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3.5 8.5 4.5L12 12.5 3.5 8Z" />
    <path d="m4.5 12.5 7.5 4 7.5-4M4.5 16.5l7.5 4 7.5-4" />
  </svg>
);

export const IconGrowth = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 19.5h16" />
    <path d="m5.5 15 4-4.5 3 2.5 5.5-7" />
    <path d="M14.5 6h3.5v3.5" />
  </svg>
);

export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6.2 6.2l2.6 2.6M15.2 15.2l2.6 2.6M17.8 6.2l-2.6 2.6M8.8 15.2l-2.6 2.6" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 6 7.5-6" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M7.2 3.8 9 3.5c.5-.1 1 .2 1.2.7l1 2.6c.2.4.1.9-.2 1.3l-1.4 1.5a12.4 12.4 0 0 0 4.8 4.8l1.5-1.4c.4-.3.9-.4 1.3-.2l2.6 1c.5.2.8.7.7 1.2l-.3 1.8c-.1.6-.6 1-1.2 1A15.4 15.4 0 0 1 6.2 5c0-.6.4-1.1 1-1.2Z" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.5-6.5-10.3A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.7C18.5 15.5 12 21 12 21Z" />
    <circle cx="12" cy="10.6" r="2.3" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2.2" />
  </svg>
);

export const IconPulse = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 12h4l2.2-5.5 3.6 11L15 12h6" />
  </svg>
);

export const IconDoc = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.5h8l4 4v13H6Z" />
    <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="m8.5 5.5 6.5 6.5-6.5 6.5" />
  </svg>
);

/** Wordmark logo */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="currentColor" className="text-ink-800" />
        <rect x="1" y="1" width="62" height="62" rx="13" fill="none" stroke="#1d2c4d" />
        <path d="M18 20v24" stroke="#3E7BFF" strokeWidth="6" strokeLinecap="round" />
        <circle cx="18" cy="17" r="3.4" fill="#56D9FF" />
        <path d="M34 44V20l12 24V20" fill="none" stroke="#E8EEF9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="46" cy="46" r="3.4" fill="#3DDC97" />
      </svg>
      {!compact && (
        <span className="font-display font-bold text-[1.05rem] tracking-tight text-white leading-none">
          ITCYBER<span className="text-brand-400">.</span>
        </span>
      )}
    </span>
  );
}
