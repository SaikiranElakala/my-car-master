import type { Metadata } from "next";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { client, formatContactPhone, phoneHref, whatsappDisplayNumber, whatsappHref } from "@/config/client";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } };

export default function Page() {
  const rows = [
    { id: "call", label: "Phone", value: formatContactPhone(client.phone), href: client.phone ? phoneHref(client.phone) : undefined },
    { id: "alternate-phone", label: "Alternate phone", value: formatContactPhone(client.secondaryPhone), href: client.secondaryPhone ? phoneHref(client.secondaryPhone) : undefined },
    { id: "whatsapp", label: "WhatsApp", value: whatsappDisplayNumber(), href: client.whatsappNumber ? whatsappHref() : undefined },
    { id: "email", label: "Email", value: client.email, href: client.email ? `mailto:${client.email}` : undefined },
    { id: "address", label: "Address", value: client.address, href: undefined },
    { id: "hours", label: "Business hours", value: client.businessHours, href: undefined },
  ] as const;
  const availableRows = rows.filter(({ value }) => Boolean(value));
  return (
    <>
      <section aria-labelledby="contact-title" className="relative isolate flex min-h-[55svh] items-center overflow-hidden bg-cover bg-center py-32 text-ink md:py-40" style={{ backgroundImage: "url('/images/cars/Modern%20Automotive%20Showroom%20Reception.png')" }}>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/0" />
        <div className="container-x relative z-10">
          <BackButton href="/" className="mb-6 text-steel hover:text-ink" />
          <h1 id="contact-title" className="display text-[clamp(3rem,9vw,7rem)]">Contact</h1>
          <p className="mt-5 max-w-xl text-lg text-ink/75">Send a message and the My Car Master team will follow up.</p>
        </div>
      </section>
      <section className="py-16 md:py-24"><div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          {availableRows.length ? (
            <dl className="space-y-5">
              {availableRows.map(({ id, label, value, href }) => (
                <div key={id} id={id} className="scroll-mt-28 border-b border-line pb-4"><dt className="text-sm text-steel">{label}</dt><dd className="text-lg font-medium">{href ? <a href={href} className="hover:text-amber">{value}</a> : value}</dd></div>
              ))}
            </dl>
          ) : (
            <p className="max-w-md text-steel">Use the form to send your question or request. The team will follow up using the mobile number you provide.</p>
          )}
        </div>
        <div id="contact-form" className="scroll-mt-28"><EnquiryForm kind="contact" submitLabel="Send message" /></div>
      </div></section>
    </>
  );
}
