import type { SVGProps } from "react";

/** 1.5px line icons, ink only (brand guide: UI element kit). */
type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const IconSearch = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
export const IconArrow = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconArrowUpRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconMenu = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </svg>
);
export const IconCross = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 7l10 10M17 7 7 17" />
  </svg>
);
export const IconDownload = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
  </svg>
);
export const IconClock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4.5l3 1.8" />
  </svg>
);
export const IconCalendar = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="4" y="5.5" width="16" height="14" rx="3" />
    <path d="M8 3.5v4M16 3.5v4M4 10h16" />
  </svg>
);
export const IconLink = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
);
export const IconFile = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
    <path d="M14 3.5V8h4.5" />
  </svg>
);
export const IconLock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
);
export const IconMail = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="m4.5 7 7.5 6 7.5-6" />
  </svg>
);
export const IconInstagram = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="17" cy="7" r="0.6" fill="currentColor" />
  </svg>
);
export const IconLinkedIn = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8.5 10.5v5M8.5 8v.01M12 15.5v-5M12 12.8c0-1.4 1-2.3 2.2-2.3s2 .8 2 2.3v2.7" />
  </svg>
);
export const IconWhatsApp = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4.5 19.5 5.6 16A7.5 7.5 0 1 1 8.4 18.6z" />
    <path d="M9.5 9.5c0 2.5 2.5 5 5 5l1-1.2-1.6-.9-.8.7c-.9-.4-1.8-1.3-2.2-2.2l.7-.8-.9-1.6z" />
  </svg>
);
export const IconX = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 5l14 14M19 5 5 19" strokeWidth={1.3} />
  </svg>
);
export const IconPlay = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M8 6v12l10-6z" />
  </svg>
);
export const IconSparkle = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
  </svg>
);

/** Black macOS arrow cursor with white outline (UI element kit). */
export const CursorArrow = (p: SVGProps<SVGSVGElement>) => (
  <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden {...p}>
    <path
      d="M3 2.5 3 23.2 8.4 18.4 12 26.6 15.6 25 12.1 17.1 19.6 17.1Z"
      fill="#141414"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);
