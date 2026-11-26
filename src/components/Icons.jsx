import React from 'react';

export function GiraeLogo({ height = 42, variant = 'onYellow' }) {
  const letterFill = variant === 'onYellow' ? '#FFFFFF' : '#FFD400';

  return (
    <svg
      height={height}
      viewBox="0 0 228 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GIRAE"
    >
      <g
        transform="translate(3.5, 4)"
        fill="#111111"
        stroke="#111111"
        strokeWidth="3.2"
        strokeLinejoin="round"
      >
        <text
          x="4"
          y="44"
          fontFamily="Nunito, Arial Black, sans-serif"
          fontWeight="900"
          fontSize="45"
          letterSpacing="-1"
        >
          G
        </text>
        <path d="M61 5L44 32H56L49 52L72 24H58L61 5Z" />
        <text
          x="77"
          y="44"
          fontFamily="Nunito, Arial Black, sans-serif"
          fontWeight="900"
          fontSize="45"
          letterSpacing="1"
        >
          RAE
        </text>
      </g>

      <text
        x="4"
        y="44"
        fontFamily="Nunito, Arial Black, sans-serif"
        fontWeight="900"
        fontSize="45"
        fill={letterFill}
        stroke="#111111"
        strokeWidth="3.4"
        paintOrder="stroke fill"
        strokeLinejoin="round"
        letterSpacing="-1"
      >
        G
      </text>

      <path
        d="M61 5L44 32H56L49 52L72 24H58L61 5Z"
        fill="#E3192B"
        stroke="#111111"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M57 12.5L49.5 25.5"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      <text
        x="77"
        y="44"
        fontFamily="Nunito, Arial Black, sans-serif"
        fontWeight="900"
        fontSize="45"
        fill={letterFill}
        stroke="#111111"
        strokeWidth="3.4"
        paintOrder="stroke fill"
        strokeLinejoin="round"
        letterSpacing="1"
      >
        RAE
      </text>
    </svg>
  );
}

export function HomeIcon({ size = 19 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5.5 9.5V20h4.5v-5.5h4V20h4.5V9.5" />
    </svg>
  );
}

export function SearchIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function CartIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2.5 3.5h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.46-1.15L21 7.5H6.2" />
    </svg>
  );
}

export function BookmarkIcon({ size = 18, filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function VerifiedIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.9 2.1 3.6.3 1.1 3.4 2.7 2.4-1.2 3.4.5 3.6-3.3 1.5-2.1 2.9-3.6-.3-3.6.3-2.1-2.9-3.3-1.5.5-3.6-1.2-3.4 2.7-2.4 1.1-3.4 3.6-.3L12 2z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ExternalLinkIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  );
}

export function ArrowUpRightIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function TrashIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </svg>
  );
}

export function BoltIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

export function CloseIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function CategoryIcon({ type = 'default', size = 20 }) {
  switch (type) {
    case 'games':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="4" />
          <path d="M6 12h4M8 10v4" />
          <circle cx="16.5" cy="11" r="1" fill="currentColor" />
          <circle cx="18.5" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case 'mobile':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M11 18h2" />
        </svg>
      );
    case 'pc':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
    case 'tv':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="13" rx="2" />
          <path d="M7 21h10" />
        </svg>
      );
    case 'home':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V20h14V9.5" />
        </svg>
      );
    case 'fashion':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3l4 3-2 4-2-1v11H8V9l-2 1-2-4 4-3 2 2h4l2-2z" />
        </svg>
      );
    case 'sport':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12" />
        </svg>
      );
    case 'beauty':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />
        </svg>
      );
    case 'auto':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6.5" cy="16.5" r="3" />
          <circle cx="17.5" cy="16.5" r="3" />
          <path d="M9.5 16.5h5M5 13l3-6h6l4 6" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
  }
}