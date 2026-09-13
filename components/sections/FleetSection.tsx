import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VehicleCard } from "@/components/VehicleCard";
import { featuredVehicles } from "@/lib/vehicles";

export function FleetSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mb-12 md:mb-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
                Catalogue
              </div>
              <h2 className="text-balance text-[clamp(34px,4.5vw,62px)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
                Nos 50 modèles d&apos;exception
              </h2>
              <p className="mt-5 text-balance text-[clamp(15px,1.3vw,18px)] leading-relaxed text-white/60">
                Une sélection rigoureuse. Des derniers modèles aux légendes intemporelles.
              </p>
            </div>
            <Link
              href="/catalogue"
              prefetch={false}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-semibold text-white/85 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
            >
              Voir les 50 véhicules
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredVehicles.map((v, i) => (
            <Reveal key={v.id} index={i % 4}>
              <VehicleCard vehicle={v} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
