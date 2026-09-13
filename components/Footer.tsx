import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

const NAV_LINKS = [
  { href: "/catalogue", label: "Nos véhicules" },
  { href: "/#services", label: "Services" },
  { href: "/#histoire", label: "Notre histoire" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "Conditions Générales de Vente" },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative border-t border-white/[0.06] bg-[#06080d]/80 backdrop-blur-sm"
    >
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/branding/logo-480.png"
              alt="ReflexRent"
              width={240}
              height={128}
              loading="lazy"
              unoptimized
              className="h-16 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm text-white/55">
              Location de Véhicules d&apos;Exception · Paris depuis {BRAND.foundedYear}
            </p>
            <p className="mt-3 text-xs text-white/40">L&apos;art de rouler autrement.</p>
          </div>

          <div className="md:col-span-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
              Navigation
            </div>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} prefetch={false} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
              Contact
            </div>
            <div className="mt-5 space-y-4 text-sm text-white/65">
              <div>
                <Label>Adresse</Label>
                <address className="mt-1 not-italic">
                  {BRAND.address.street}
                  <br />
                  {BRAND.address.city}
                  <br />
                  {BRAND.address.country}
                </address>
              </div>
              <div>
                <Label>Horaires</Label>
                <div className="mt-1">
                  {BRAND.hours.days}
                  <br />
                  {BRAND.hours.range}
                </div>
              </div>
              <div>
                <Label>WhatsApp</Label>
                <a
                  href={`https://wa.me/${BRAND.whatsapp.e164}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-white/85 transition-colors hover:text-white"
                >
                  {BRAND.whatsapp.display}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-[11px] text-white/40">
          <div>© {new Date().getFullYear()} ReflexRent. Tous droits réservés.</div>
          <div className="font-mono">
            {BRAND.legalName} · {BRAND.legalForm} · {BRAND.rcs} · SIRET {BRAND.siret}
          </div>
        </div>
      </div>
    </footer>
  );
}
