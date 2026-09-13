import { BRAND } from "./brand";

/** Lien WhatsApp simple, pour le bouton flottant et le CTA final. */
export function buildSimpleWhatsAppUrl(text?: string) {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${BRAND.whatsapp.e164}${q}`;
}

export type BookingRequest = {
  vehicleName?: string;
  from?: string;
  to?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  freeText?: string;
};

/** Lien WhatsApp avec message pré-rempli, pour les formulaires de réservation. */
export function buildWhatsAppUrl(r: BookingRequest) {
  const lines: string[] = ["Bonjour ReflexRent,"];

  if (r.vehicleName) lines.push(`Je souhaite réserver : ${r.vehicleName}`);
  if (r.from && r.to) lines.push(`📅 Du ${r.from} au ${r.to}`);

  const name = [r.firstName, r.lastName].filter(Boolean).join(" ");
  if (name) lines.push(`👤 ${name}`);
  if (r.email) lines.push(`📧 ${r.email}`);
  if (r.phone) lines.push(`📞 ${r.phone}`);

  if (r.freeText) {
    lines.push("");
    lines.push(r.freeText);
  }

  lines.push("");
  lines.push("Merci de me confirmer la disponibilité.");

  return `https://wa.me/${BRAND.whatsapp.e164}?text=${encodeURIComponent(lines.join("\n"))}`;
}
