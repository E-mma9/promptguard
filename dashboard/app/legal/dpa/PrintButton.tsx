'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-indigo-600 underline hover:text-indigo-800"
    >
      Afdrukken / opslaan als PDF
    </button>
  );
}
