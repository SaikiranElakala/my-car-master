/**
 * CLIENT INFORMATION PLACEHOLDERS
 * Nothing here is invented. `null` means "not supplied by client yet".
 * Replace with verified values (later served from the backend Settings table).
 */
export const client = {
  brand: "My Car Master",
  domain: "mycarmaster.in",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mycarmaster.in",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
  secondaryPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE_SECONDARY || null,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  address: null as string | null, // COMPANY_ADDRESS
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
  businessHours: null as string | null, // BUSINESS_HOURS
  roadside24x7: false, // do NOT claim 24/7 until confirmed
  social: { instagram: null, facebook: null, youtube: null, linkedin: null } as Record<string, string | null>,
};

/** Testimonials — hidden until real ones are provided. */
export const testimonials: { name: string; text: string }[] = [];

export function whatsappHref(message = "Hello My Car Master") {
  if (!client.whatsappNumber) return "/contact#contact-form";
  return `https://wa.me/${client.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export function whatsappDisplayNumber() {
  const digits = client.whatsappNumber?.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("91") && digits.length === 12) return `+91 ${digits.slice(2)}`;
  return client.whatsappNumber;
}
export function formatContactPhone(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return `+91 ${digits.slice(2)}`;
  return phone;
}
export function phoneHref(phone = client.phone) {
  return phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "/contact#contact-form";
}
