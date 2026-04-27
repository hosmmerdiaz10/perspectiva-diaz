interface Props { className?: string }

export const LogoMark = ({ className = "h-9 w-9" }: Props) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
    <rect x="2" y="2" width="36" height="36" />
    <rect x="8" y="8" width="24" height="24" />
    <rect x="14" y="14" width="12" height="12" />
    <line x1="20" y1="14" x2="20" y2="26" />
    <line x1="14" y1="20" x2="26" y2="20" />
  </svg>
);

export const Wordmark = ({ className = "" }: Props) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <LogoMark />
    <span className="font-serif text-base tracking-[0.25em] uppercase">
      Perspectiva Díaz
    </span>
  </div>
);
