export const BRAND = {
  name: "ReflexRent",
  legalName: "Reflex Rent Boulogne",
  legalForm: "SARL au capital de 100 000 €",
  siret: "788 498 350 00024",
  rcs: "RCS Paris 788 498 350",
  ape: "7711A",
  foundedYear: 2008,
  address: {
    street: "2 Avenue de la Porte de Saint-Cloud",
    city: "75016 Paris",
    country: "France",
    full: "2 Avenue de la Porte de Saint-Cloud, 75016 Paris, France",
  },
  whatsapp: { e164: "33612292906", display: "+33 6 12 29 29 06" },
  hours: { days: "Lundi – Dimanche", range: "9h – 20h" },
  baseDailyRate: 99,
} as const;

/** Ordre des pastilles de filtre du catalogue. */
export const CATEGORIES = [
  "Citadine",
  "Compacte",
  "Cabriolet",
  "Limousine",
  "SUV & Tout-Terrain",
  "Sportive",
  "Supercar",
  "Van VIP",
  "Vintage",
] as const;

/** Ordre du tri « Recommandé ». Volontairement différent de CATEGORIES. */
export const RECOMMENDED_ORDER = [
  "Supercar",
  "Sportive",
  "SUV & Tout-Terrain",
  "Limousine",
  "Cabriolet",
  "Compacte",
  "Van VIP",
  "Vintage",
  "Citadine",
] as const;
