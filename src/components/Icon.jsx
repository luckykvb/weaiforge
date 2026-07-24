// Custom line-icon set — consistent 24px grid, 1.5px stroke, round joins.
// Drawn for this brief rather than pulled from an icon pack.

const paths = {
  // Solutions
  workflow: (
    <>
      <rect x="3" y="4" width="6" height="5" rx="1.2" />
      <rect x="15" y="4" width="6" height="5" rx="1.2" />
      <rect x="9" y="15" width="6" height="5" rx="1.2" />
      <path d="M6 9v2a2 2 0 0 0 2 2h1M18 9v2a2 2 0 0 1-2 2h-1M12 13v2" />
    </>
  ),
  agent: (
    <>
      <rect x="5" y="7" width="14" height="11" rx="2.5" />
      <path d="M12 3v4M9 12h.01M15 12h.01M9.5 15.5c.7.6 1.6.9 2.5.9s1.8-.3 2.5-.9" />
      <path d="M5 11H3M21 11h-2" />
    </>
  ),
  creative: (
    <>
      <path d="M4 20c0-3 2-4 4-4 1.5 0 2.5 1 2.5 2.4 0 1.6-1.5 1.6-1.5 1.6" />
      <path d="M8.5 15.5 18 6a2.1 2.1 0 0 1 3 3l-9.5 9.5" />
      <path d="M14 7l3 3" />
      <circle cx="6" cy="18" r="0.4" fill="currentColor" stroke="none" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  model: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="5" cy="6" r="1.6" />
      <circle cx="19" cy="6" r="1.6" />
      <circle cx="5" cy="18" r="1.6" />
      <circle cx="19" cy="18" r="1.6" />
      <path d="M6.3 7 10 10.5M17.7 7 14 10.5M6.3 17 10 13.5M17.7 17 14 13.5" />
    </>
  ),
  // Problem
  loop: (
    <>
      <path d="M4 9a8 8 0 0 1 13-2.5L20 9" />
      <path d="M20 4v5h-5" />
      <path d="M20 15a8 8 0 0 1-13 2.5L4 15" />
      <path d="M4 20v-5h5" />
    </>
  ),
  scatter: (
    <>
      <circle cx="6" cy="6" r="1.4" />
      <circle cx="18" cy="7" r="1.4" />
      <circle cx="7" cy="17" r="1.4" />
      <circle cx="17" cy="17" r="1.4" />
      <circle cx="12" cy="11" r="1.4" />
      <path d="M7.3 7.1 10.7 10M16.7 8 13.2 10.4M8 15.8 11 12.3M16 15.8 13 12.3" strokeDasharray="1 2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 1.5" />
    </>
  ),
  // Why us
  founder: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M12 11.2v2.3" />
    </>
  ),
  bespoke: (
    <>
      <path d="M12 3l2.4 5 5.4.5-4.1 3.6 1.3 5.4L12 20l-4.9 2 1.3-5.4L4.3 13l5.4-.5z" />
    </>
  ),
  studio: (
    <>
      <rect x="3" y="5" width="18" height="13" rx="2" />
      <path d="M3 9h18M7 5V3M17 5V3" />
      <path d="M8.5 13.5 11 15l-2.5 1.5M14 16h2" />
    </>
  ),
  ship: (
    <>
      <path d="M12 3l3 3-3 3-3-3z" />
      <path d="M12 9v9" />
      <path d="M6 13l-2 3 8 3 8-3-2-3" />
    </>
  ),
}

export default function Icon({ name, size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name] ?? null}
    </svg>
  )
}
