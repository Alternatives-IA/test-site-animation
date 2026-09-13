import raw from "@/data/vehicles.json";

export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  model: string;
  variant: string;
  category: string;
  bodyType: string;
  seats: number;
  luggage: number;
  transmission: string;
  fuel: string;
  horsepower: number;
  zeroToHundred: number;
  topSpeed: number;
  displacement: string;
  drive: string;
  description: string;
  imageFile: string;
};

export const vehicles = raw as Vehicle[];

/** Les 8 véhicules mis en avant sur l'accueil, dans l'ordre exact du site. */
export const FEATURED_IDS = [
  "ferrari-296-gts",
  "mercedes-classe-g-amg",
  "lamborghini-urus-performante",
  "porsche-gt3-rs",
  "mercedes-maybach-s",
  "ferrari-12-cilindri-spider",
  "rolls-royce-cullinan-2025",
  "porsche-356-speedster",
];

export const featuredVehicles: Vehicle[] = FEATURED_IDS.map((id) => {
  const v = vehicles.find((x) => x.id === id);
  if (!v) throw new Error(`Véhicule introuvable dans data/vehicles.json : ${id}`);
  return v;
});

/** Nombre de modèles par catégorie, calculé depuis le dataset. */
export function countByCategory(category: string) {
  return vehicles.filter((v) => v.category === category).length;
}
