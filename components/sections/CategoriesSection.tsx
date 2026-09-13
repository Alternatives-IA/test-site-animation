import Link from "next/link";
import {
  Car,
  CarFront,
  Caravan,
  Crown,
  Gem,
  Mountain,
  Rocket,
  Sun,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CATEGORIES } from "@/lib/brand";
import { countByCategory } from "@/lib/vehicles";

const ICONS: Record<string, LucideIcon> = {
  Citadine: Car,
  Compacte: CarFront,
  Cabriolet: Sun,
  Limousine: Crown,
  "SUV & Tout-Terrain": Mountain,
  Sportive: Rocket,
  Supercar: Gem,
  "Van VIP": Truck,
  Vintage: Caravan,
};

export function CategoriesSection() {
  return (
    <section
      id="categories"
      className="relative border-y border-white/[0.05] bg-[#06090f]/60 py-24 md:py-32"
    >
      <div className="container-x">
        <Reveal>
          <SectionHeader
            align="center"
            className="mb-14 md:mb-16"
            eyebrow="Trouvez votre style"
            title="Naviguer par catégorie"
            subtitle="De la citadine au supercar, chaque catégorie est pensée pour un usage."
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 md:gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat] ?? Car;
            const n = countByCategory(cat);
            return (
              <Reveal key={cat} index={i}>
                <Link
                  href={`/catalogue/?cat=${encodeURIComponent(cat)}`}
                  prefetch={false}
                  className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 transition-all duration-500 hover:border-blue-500/40 hover:from-blue-500/[0.08]"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-[10px] font-mono text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <Icon
                      size={18}
                      className="text-white/35 transition-colors group-hover:text-blue-400"
                    />
                  </div>
                  <h3 className="mt-8 text-lg font-semibold tracking-tight text-white md:text-xl">
                    {cat}
                  </h3>
                  <div className="mt-1 text-sm text-white/55">
                    {n} {n > 1 ? "modèles" : "modèle"}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
