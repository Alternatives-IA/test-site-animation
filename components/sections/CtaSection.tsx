import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-32 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 30%, rgba(33,150,243,0.22) 0%, transparent 70%)",
        }}
      />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-[clamp(40px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.035em] text-white">
            Prêt à conduire autrement ?
          </h2>
          <p className="mt-7 text-sm tracking-wider text-white/55">
            Réponse sous 1 heure · 7 jours sur 7 · 9h–20h.
          </p>
          <a
            href={buildSimpleWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-blue-500 px-9 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_20px_60px_-12px_rgba(33,150,243,0.65)]"
          >
            Réserver maintenant
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
