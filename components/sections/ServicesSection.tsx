import { Clock, PlaneTakeoff, Truck, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

const SERVICES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Truck,
    title: "Livraison à domicile",
    text: "Votre véhicule chez vous, à l'heure, sans condition. Paris, Lyon, Cannes, Genève, Monaco.",
  },
  {
    icon: UserRound,
    title: "Chauffeur sur demande",
    text: "Un conducteur professionnel à vos côtés, discret, ponctuel, anglophone.",
  },
  {
    icon: Clock,
    title: "Longue durée",
    text: "Tarifs dégressifs à la semaine et au mois. Idéal pour les séjours prolongés ou les tournages.",
  },
  {
    icon: PlaneTakeoff,
    title: "VIP aéroport",
    text: "Accueil personnalisé à Roissy, Le Bourget ou Orly. Sortie de jet à clé en main.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <SectionHeader
            className="mb-14 md:mb-16"
            eyebrow="Au-delà de la location"
            title="Une expérience complète"
            subtitle="Quatre services pensés pour faire de chaque trajet une exception."
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} index={i}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30">
                <div className="text-[11px] font-mono text-blue-400/80">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/25 transition-all group-hover:bg-blue-500/20">
                  <s.icon size={20} className="text-blue-400" />
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
