export function RadarMark({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      <path d="M16 16 L23.5 9" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ProductIcon({ type }) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white" fill="none" aria-hidden="true">
        <rect x="20" y="8" width="24" height="48" rx="6" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="32" cy="48" r="1.6" fill="currentColor" />
      </svg>
    );
  }

  if (type === "tv") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white" fill="none" aria-hidden="true">
        <rect x="8" y="14" width="48" height="30" rx="4" stroke="currentColor" strokeWidth="2.4" />
        <path d="M24 52h16M32 44v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 text-white" fill="none" aria-hidden="true">
      <rect x="10" y="22" width="36" height="20" rx="8" stroke="currentColor" strokeWidth="2.4" />
      <path d="M46 28h6a4 4 0 0 1 0 8h-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="22" cy="32" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="34" cy="32" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function HeartIcon({ filled, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
