import { Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type Testimonial = { text: string; image: string; name: string; role: string };

const TESTIMONIALS: Testimonial[] = [
  {
    text: "Une Ferrari 296 GTS livrée à mon hôtel en 2 heures. Service impeccable, voiture parfaitement préparée. ReflexRent a transformé mon anniversaire en moment inoubliable.",
    image: "/avatars/antoine.jpg",
    name: "Antoine M.",
    role: "Entrepreneur, Paris",
  },
  {
    text: "J'ai loué la Maybach pour un mariage à Cannes. Chauffeur professionnel, voiture irréprochable. Le détail de l'accueil fait toute la différence.",
    image: "/avatars/elodie.jpg",
    name: "Élodie R.",
    role: "Wedding Planner",
  },
  {
    text: "Production cinéma pour 3 semaines : 6 véhicules réservés simultanément, planning sans accroc, équipe disponible 7j/7. La référence du secteur.",
    image: "/avatars/karim.jpg",
    name: "Karim B.",
    role: "Directeur de production",
  },
  {
    text: "Le seul loueur parisien capable de fournir une G Mansory un samedi matin. Discrétion, ponctualité, voiture sublimée par l'équipe. Reflex est mon choix par défaut.",
    image: "/avatars/aymeric.jpg",
    name: "Aymeric V.",
    role: "Investisseur, Monaco",
  },
  {
    text: "Première location de Lambo et j'avais des doutes. L'équipe a pris le temps d'expliquer chaque mode, chaque commande. Service éducatif, voiture explosive.",
    image: "/avatars/sarah.jpg",
    name: "Sarah L.",
    role: "Cliente fidèle depuis 2019",
  },
  {
    text: "Smart Brabus pour sortir dans Paris, week-end parfait. Le luxe ne se mesure pas qu'à la cylindrée. Bravo pour cette flotte unique.",
    image: "/avatars/hugo.jpg",
    name: "Hugo D.",
    role: "Architecte",
  },
  {
    text: "Range Rover SV pour un séjour en Suisse, 1500 km sans la moindre alerte. Conciergerie disponible même en pleines vacances. Que demander de plus.",
    image: "/avatars/camille.jpg",
    name: "Camille T.",
    role: "Cliente entreprise",
  },
  {
    text: "Ferrari Roma Cab à minuit, livraison directement devant le club. Service night shift sans surcoût. Ils comprennent leurs clients.",
    image: "/avatars/yanis.jpg",
    name: "Yanis K.",
    role: "Producteur musique",
  },
  {
    text: "Réservé une 911 GT3 RS pour un track day. Voiture parfaitement préparée, pleins faits, conseils sur la conduite circuit. Au-delà du loueur classique.",
    image: "/avatars/maxime.jpg",
    name: "Maxime J.",
    role: "Passionné automobile",
  },
];

/**
 * Colonne défilante. Le contenu est dupliqué ×2 et translaté de -50% :
 * la boucle revient exactement au point de départ, la couture est invisible.
 */
function Column({
  testimonials,
  duration,
  className,
}: {
  testimonials: Testimonial[];
  duration: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        data-marquee
        className="flex flex-col gap-6 pb-6"
        style={{ animation: `marquee-y ${duration}s linear infinite` }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex flex-col gap-6">
            {testimonials.map(({ text, image, name, role }) => (
              <div
                key={dup + name}
                className="p-8 rounded-3xl border border-white/10 shadow-2xl shadow-blue-500/5 bg-white/[0.03] backdrop-blur-sm max-w-xs w-full"
              >
                <div className="text-sm text-white/85 leading-relaxed">{text}</div>
                <div className="flex items-center gap-3 mt-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full border border-white/10"
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold tracking-tight leading-5 text-white">
                      {name}
                    </div>
                    <div className="text-xs leading-5 text-white/55 tracking-tight">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
            Avis clients
          </div>
          <h2 className="mt-5 text-balance text-[clamp(32px,4.2vw,56px)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
            Ce qu&apos;ils disent
          </h2>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80">
            <span className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} className="fill-blue-400 text-blue-400" />
              ))}
            </span>
            <span className="font-mono">
              Note moyenne 4,9 / 5 sur 2 000+ avis clients.
            </span>
          </div>
        </Reveal>

        <div
          className={cn(
            "mt-14 flex max-h-[680px] justify-center gap-5 overflow-hidden md:gap-6",
            "[mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
          )}
        >
          <Column testimonials={TESTIMONIALS.slice(0, 3)} duration={20} />
          <Column
            testimonials={TESTIMONIALS.slice(3, 6)}
            duration={24}
            className="hidden md:block"
          />
          <Column
            testimonials={TESTIMONIALS.slice(6, 9)}
            duration={22}
            className="hidden lg:block"
          />
        </div>
      </div>
    </section>
  );
}
