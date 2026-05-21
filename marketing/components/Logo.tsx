type LogoProps = {
  size?: number;
  light?: boolean;
  withText?: boolean;
};

export function Logo({ size = 28, light = false, withText = true }: LogoProps) {
  const stroke = light ? '#ffffff' : '#0f172a';
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#pg-grad)" />
        <path
          d="M10 16 L14 20 L22 12"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <defs>
          <linearGradient id="pg-grad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0" stopColor="#6366f1" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
        </defs>
      </svg>
      {withText && (
        <span
          className="font-semibold tracking-tight text-[17px]"
          style={{ color: stroke }}
        >
          PromptGuard
        </span>
      )}
    </span>
  );
}
