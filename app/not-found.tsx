import Link from "next/link";

/**
 * Seule la page d'accueil est dans le périmètre de cette reproduction.
 * Les liens vers /catalogue, /cgv, /mentions-legales atterrissent ici.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
        Hors périmètre
      </div>
      <h1 className="mt-5 text-balance text-[clamp(32px,4.5vw,56px)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
        Cette page n&apos;a pas été reproduite.
      </h1>
      <p className="mt-5 max-w-lg text-balance text-[15px] leading-relaxed text-white/60">
        Seule la page d&apos;accueil fait partie de cette reproduction. Le catalogue, les
        50 fiches véhicule et les pages légales sont décrits dans le blueprint mais non
        implémentés.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-[0_12px_40px_-6px_rgba(33,150,243,0.6)]"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
