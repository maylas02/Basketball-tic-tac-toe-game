type MarkProps = { className?: string };

export function BallMark({ className }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="#f4772e"
        stroke="#2b1608"
        strokeWidth="4"
      />
      <g fill="none" stroke="#2b1608" strokeWidth="3.5" strokeLinecap="round">
        <path d="M50 8 V92" />
        <path d="M8 50 H92" />
        <path d="M18 20 C38 36 38 64 18 80" />
        <path d="M82 20 C62 36 62 64 82 80" />
      </g>
    </svg>
  );
}

export function HoopMark({ className }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="50" cy="28" rx="32" ry="10" strokeWidth="6" />
        <g strokeWidth="3.5">
          <path d="M20 32 L38 82" />
          <path d="M38 37 L46 82" />
          <path d="M50 38 L50 82" />
          <path d="M62 37 L54 82" />
          <path d="M80 32 L62 82" />
          <path d="M27 52 H73" />
          <path d="M32 66 H68" />
          <path d="M37 78 H63" />
        </g>
      </g>
    </svg>
  );
}
