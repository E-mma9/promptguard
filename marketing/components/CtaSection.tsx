import Link from 'next/link';

/** Decorative right-arrow icon. */
export function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 7h10m0 0L8 3m4 4l-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type CtaAction = {
  label: string;
  href: string;
  /** Render as a plain anchor (mailto / external) rather than next/link. */
  external?: boolean;
  withArrow?: boolean;
};

/**
 * Shared brand-gradient closing CTA band used at the foot of the
 * home and sector pages. Keeps spacing, heading size and button
 * usage consistent across pages.
 */
export function CtaSection({
  heading,
  body,
  primary,
  secondary,
}: {
  heading: string;
  body: string;
  primary: CtaAction;
  secondary?: CtaAction;
}) {
  return (
    <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{heading}</h2>
        <p className="mt-5 text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">{body}</p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
          <CtaButton action={primary} className="btn-primary" />
          {secondary && <CtaButton action={secondary} className="btn-secondary" />}
        </div>
      </div>
    </section>
  );
}

function CtaButton({ action, className }: { action: CtaAction; className: string }) {
  const content = (
    <>
      {action.label}
      {action.withArrow && <Arrow />}
    </>
  );
  if (action.external) {
    return (
      <a href={action.href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}
