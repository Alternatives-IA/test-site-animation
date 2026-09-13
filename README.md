# ReflexRent — reproduction de la page d'accueil

Reproduction de la page d'accueil de [reflexrent.fr](https://reflexrent.fr/fr/), construite
à partir du relevé complet documenté dans `../docs/blueprint-reflexrent.md`.

**Périmètre : la page d'accueil uniquement.** Le catalogue, les 50 fiches véhicule et les
pages légales sont spécifiés dans le blueprint mais non implémentés ; leurs liens mènent à
une page « hors périmètre » (`app/not-found.tsx`).

---

## Démarrer

```bash
npm install
npm run dev
```

```bash
npm run build && npm start
```

| Commande | Effet |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (statique) |
| `npm test` | vérifie la logique du héros (`lib/hero.test.mjs`) |
| `npm run lint` | ESLint |
| `node scripts/shoot.mjs <url> <dossier>` | captures de vérification en Chromium headless |

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · lucide-react ·
TypeScript. Aucun back-end : les demandes de réservation partent en lien profond WhatsApp.

---

## L'animation du héros

C'est la pièce centrale, et c'est une **séquence d'images scrubée au scroll, dessinée dans
un `<canvas>` 2D** — la technique des pages produit Apple.

| | |
|---|---|
| Conteneur | `<section style="height:600vh">` + enfant `sticky top-0 h-screen` |
| Frames | 297, `public/hero-frames/f_001.jpg` → `f_297.jpg` |
| Desktop | 1920×1080, ~41 Ko/frame, **12 Mo au total** |
| Mobile (`max-width: 768px`) | `hero-frames-sm/`, 1280×720, ~19 Ko/frame, **5 Mo** |
| Mapping | `frame = 296 × progress` |
| Lissage | `current += (target − current) × 0.22` dans une boucle rAF |
| Textes | 3 calques qui se croisent à 0→0.16, 0.22→0.40, 0.86→1 |

La logique pure (progression, mapping, opacités, cadrage) vit dans `lib/hero.ts` et est
couverte par `lib/hero.test.mjs`. **`components/Hero3D.tsx` importe ce module** : ce qui est
testé est bien ce qui tourne.

### Les frames sont des substituts

Les frames d'origine proviennent d'une vidéo générée par Google Veo, filigranée et
propriétaire. Celles d'ici sont **générées** par `scripts/gen_hero_frames.py` : un moteur de
rendu 3D minimal (projection perspective + algorithme du peintre, en numpy/PIL) qui rejoue
le même découpage — orbite autour d'une berline sombre en studio bleu, travelling sur le
flanc, passage devant le mur logo, plaque rétro-éclairée finale.

```bash
python3 scripts/gen_hero_frames.py --preview 150   # une frame de contrôle dans /tmp
python3 scripts/gen_hero_frames.py                 # les 297 frames, 2 résolutions
python3 scripts/gen_assets.py                      # logo, véhicules, avatars, OG, favicon
```

Pour passer à une vraie vidéo : extraire 297 frames avec ffmpeg dans les deux dossiers, en
respectant la numérotation `f_%03d.jpg` à partir de 1. Rien d'autre à changer.

---

## Écarts assumés par rapport à l'original

| Point | Original | Ici | Pourquoi |
|---|---|---|---|
| Préchargement du héros | attend les **297** frames | affiche dès **30** frames, le reste charge en fond | l'original bloque sur 133 Mo et fait décrocher le rendu du navigateur ; constaté pendant l'analyse |
| Poids des frames | 4K, 133 Mo | 1920×1080, 12 Mo | 4K est inutile : le canvas rend au maximum en `viewport × dpr` |
| `prefers-reduced-motion` | non géré pour le héros | image fixe, pas de boucle rAF | accessibilité |
| Mur d'avis | framer-motion | `@keyframes marquee-y` en CSS | rendu identique, une dépendance en moins |
| Police | pile système (SF Pro sur Apple uniquement) | Inter via `next/font` | rendu homogène hors Apple ; la pile d'origine déclarait déjà Inter en 2ᵉ position |
| Avatars d'avis | `randomuser.me` (tiers) | `public/avatars/` en local | pas de dépendance à un service externe |
| i18n | next-intl, fr + en | FR uniquement, bascule FR/EN décorative | hors périmètre pour une page seule |
| Liens hors périmètre | pages réelles | `prefetch={false}` + page 404 dédiée | évite les requêtes RSC en 404 |

Tout le reste — couleurs, typographie, espacements, markup, textes, mécaniques
d'animation — suit le relevé au caractère près.

---

## Fidélité mesurée

Relevé en Chromium headless à 1440×900, comparé aux mesures prises sur le site en production :

```
hauteur du document   12920 px   (original 12914)
section héros             5400   (5400)   Δ    0
barre de réservation      5320   (5320)   Δ    0
flotte                    5528   (5528)   Δ    0
catégories                6929   (6929)   Δ    0
services                  7888   (7882)   Δ   +6
notre histoire            8640   (8634)   Δ   +6
avis clients              9517   (9511)   Δ   +6
FAQ                      10664  (10658)   Δ   +6
CTA final                11781  (11775)   Δ   +6

0 erreur console · 0 image cassée (29) · canvas effectivement peint
```

Les 6 px résiduels viennent d'une différence de métrique de police (Inter vs police système
sur la machine de mesure).

---

## Structure

```
app/
  layout.tsx        <html>, Inter, bg-orbs, Nav, main, Footer, WhatsAppFloat, JSON-LD
  page.tsx          assemble les 8 sections
  globals.css       tokens @theme, .container-x, .bg-orbs, keyframes
  not-found.tsx     page « hors périmètre »
components/
  Hero3D.tsx        le canvas scrubé (client)
  Reveal.tsx        apparition au scroll, cascade de 0.12 s
  Nav.tsx  Footer.tsx  WhatsAppFloat.tsx  BookingBar.tsx
  VehicleCard.tsx  SectionHeader.tsx
  sections/         Fleet, Categories, Services, Story, Testimonials, Faq, Cta
lib/
  hero.ts           logique pure du héros (testée)
  hero.test.mjs     vérification, sans framework
  brand.ts  vehicles.ts  whatsapp.ts  utils.ts
data/vehicles.json  les 50 véhicules, données réelles du site
scripts/
  gen_hero_frames.py  générateur de la séquence
  gen_assets.py       générateur des autres visuels
  shoot.mjs           captures de vérification headless
```

---

## Règles de modification

1. **Ne pas toucher aux constantes de `lib/hero.ts`** — 297, 0.22, 0.04/0.06, 1.5789…,
   0.78/0.12, 600vh. Elles sont calibrées ensemble.
2. Le bleu de marque est **`#2196f3`**, redéfini dans `@theme`. Jamais de bleu en dur.
3. Jamais de prix ni de numéro WhatsApp en dur : `BRAND.baseDailyRate`, `lib/whatsapp.ts`.
4. Les apparitions au scroll passent par `<Reveal index={i}>`.
5. Le héros ne doit **jamais** attendre les 297 frames avant d'afficher la page.
6. `npm run build` et `npm test` doivent passer avant tout commit.
