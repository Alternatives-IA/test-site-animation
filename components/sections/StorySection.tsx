import Image from "next/image";
import { Reveal } from "@/components/Reveal";

const PARAGRAPHS = [
  "Deux amis. Une obsession partagée pour les belles voitures, et pour le service qui va avec. En 2008, ils décident que la location, ce sera autre chose chez eux. Pas une formalité. Pas un comptoir. Un événement.",
  "Aujourd'hui, notre flotte est sans équivalent à Paris. Smart relookées par Brabus, Ferrari hybrides, G Mansory taillées à l'unité, Porsche 356 d'origine. Une règle, jamais bafouée : aucune voiture banale.",
  "Plus de 2 000 clients nous accompagnent. Particuliers, dirigeants, productions cinéma. À chacun son moment d'exception.",
];

export function StorySection() {
  return (
    <section
      id="histoire"
      className="relative overflow-hidden border-y border-white/[0.05] bg-[#06090f]/60 py-24 md:py-36"
    >
      <div className="container-x">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 ring-white/[0.08]">
              <Image
                src="/branding/founders.jpg"
                alt="Les fondateurs de ReflexRent dans leur showroom"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="md:col-span-7">
            <Reveal>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
                Notre histoire
              </div>
            </Reveal>
            <Reveal index={1}>
              <h2 className="mt-5 text-balance text-[clamp(32px,4.2vw,56px)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
                Depuis 2008, deux passionnés ont choisi l&apos;exception.
              </h2>
            </Reveal>
            <div className="mt-7 space-y-5 text-[clamp(15px,1.2vw,17px)] leading-relaxed text-white/65">
              {PARAGRAPHS.map((p, i) => (
                <Reveal key={i} index={i + 2} as="p">
                  {p}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
