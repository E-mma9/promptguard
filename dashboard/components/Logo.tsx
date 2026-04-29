export function Logo({ size = 28, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative shrink-0 rounded-[22%]"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          boxShadow: '0 4px 10px -3px rgba(124, 58, 237, 0.4)',
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto" width={size * 0.62} height={size * 0.62} fill="none">
          <path
            d="M12 2.5L4 5v7c0 4.5 3.2 8.5 8 9.5 4.8-1 8-5 8-9.5V5l-8-2.5z"
            fill="#ffffff"
          />
          <circle cx="12" cy="11" r="1.6" fill="#7c3aed" />
          <rect x="11.1" y="11.4" width="1.8" height="3.6" rx="0.6" fill="#7c3aed" />
        </svg>
      </div>
      {withText && (
        <div className="font-semibold tracking-tight text-ink-900">
          PromptGuard
        </div>
      )}
    </div>
  );
}
