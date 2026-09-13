"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const FAQ = [
  {
    q: "Quelles sont les conditions pour louer ?",
    a: "Permis B valide, pièce d'identité, justificatif de domicile. Empreinte de caution selon le véhicule. Aucune limite d'âge supérieure ; pour les supercars, expérience de conduite vivement recommandée.",
  },
  {
    q: "Quelle assurance est incluse ?",
    a: "Assurance tous risques avec assistance 24/7 incluse dans le tarif. Possibilité de réduire la franchise via nos options de couverture renforcée.",
  },
  {
    q: "Livrez-vous en dehors de Paris ?",
    a: "Oui. Livraison France entière sur devis. Sans surcoût pour Paris intra-muros et Boulogne. Forfait préférentiel sur la Côte d'Azur et les Alpes en saison.",
  },
  {
    q: "Y a-t-il un kilométrage limité ?",
    a: "Selon le véhicule. La majorité de la flotte est sans limite kilométrique sur Paris et la France. Quelques supercars conservent une limite, précisée sur leur fiche.",
  },
  {
    q: "Peut-on réserver avec chauffeur ?",
    a: "Oui, sur tous les véhicules. Tarif chauffeur en supplément, sur devis. Personnel discret, ponctuel, anglophone.",
  },
  {
    q: "Comment réserver ?",
    a: "Choisissez votre véhicule, vos dates, puis envoyez votre demande via WhatsApp. Nous confirmons en moins d'une heure pendant nos horaires d'ouverture.",
  },
  {
    q: "Quelle caution faut-il prévoir ?",
    a: "De 1 500 € pour une citadine jusqu'à 25 000 € pour une supercar. Empreinte CB ou virement. Restituée sous 48h après retour du véhicule.",
  },
  {
    q: "Puis-je quitter le territoire français ?",
    a: "Oui, sortie Schengen autorisée sur demande préalable. Certaines destinations soumises à validation. Documents fournis sur demande.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-y border-white/[0.05] bg-[#06090f]/60 py-24 md:py-32">
      <div className="container-x max-w-4xl">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
              Questions fréquentes
            </div>
            <h2 className="text-balance text-[clamp(34px,4.5vw,62px)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
              Tout ce qu&apos;il faut savoir
            </h2>
          </div>
        </Reveal>

        <div className="space-y-2.5">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} index={i}>
                <div
                  className={cn(
                    "rounded-2xl border bg-white/[0.02] backdrop-blur-sm transition-colors",
                    isOpen ? "border-blue-500/30" : "border-white/[0.07]"
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-medium text-white md:text-lg">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        "shrink-0 text-white/45 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 text-[15px] leading-relaxed text-white/65">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
