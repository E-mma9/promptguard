/**
 * Shared <main> landmark wrapper. Every marketing page wraps its
 * page content in this so there is exactly one main landmark per page,
 * and the skip-link target (#hoofdinhoud) always resolves.
 */
export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main id="hoofdinhoud" tabIndex={-1} className="focus:outline-none">
      {children}
    </main>
  );
}
