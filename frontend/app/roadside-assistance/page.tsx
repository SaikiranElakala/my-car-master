import type { Metadata } from "next";
import { Phone, MessageCircle, Battery, CircleDot, Fuel, Truck, KeyRound, Wrench, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { PageHero } from "@/components/sections/PageHero";
import { phoneHref, whatsappHref, client } from "@/config/client";
import { track } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Roadside Assistance",
  description: "Request roadside help for breakdowns, battery, flat tyre, fuel, towing and lockouts.",
  alternates: { canonical: "/roadside-assistance" },
};

const cats = [
  [Wrench, "Breakdown"], [Battery, "Battery"], [CircleDot, "Flat tyre"], [Fuel, "Fuel"], [Truck, "Towing"], [KeyRound, "Lockout"], [HelpCircle, "Other"],
] as const;

export default function Page() {
  return (
    <>
      <PageHero urgent eyebrow="Roadside assistance" title="Need help" accent="on the road?" lead="Send a request and tell us where you are and what happened. The team can follow up to confirm availability and next steps."
        ctaLabel="Request assistance" ctaHref="#request" secondary={client.phone ? { label: "Call now", href: phoneHref() } : undefined} backgroundImage="/images/cars/Roadside Assistance at Golden Hour.png" showBackButton liftContent />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="grid gap-3 sm:grid-cols-3">
            {client.phone && <a href={phoneHref()} className="flex min-h-[72px] items-center justify-center gap-3 rounded-2xl bg-ink text-lg font-semibold text-white"><Phone aria-hidden /> Call now</a>}
            {client.whatsappNumber && <a href={whatsappHref("I need roadside assistance")} className="flex min-h-[72px] items-center justify-center gap-3 rounded-2xl bg-ink text-lg font-semibold text-white"><MessageCircle aria-hidden /> WhatsApp</a>}
            <Button href="#request" className="!min-h-[72px] !text-lg">Request assistance</Button>
          </div>
          <h2 className="display mt-16 text-4xl md:text-6xl">What can we help with?</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {cats.map(([Icon, label]) => (
              <li key={label} className="flex min-h-[88px] items-center gap-3 rounded-2xl border border-line bg-white p-4 font-semibold"><Icon className="h-6 w-6 text-amber" aria-hidden />{label}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-steel">Service hours and availability are being confirmed. We do not claim round-the-clock service until it is verified.</p>
        </div>
      </section>
      <section id="request" className="scroll-mt-28 bg-bone py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="display text-4xl md:text-6xl">Request assistance</h2>
          <EnquiryForm kind="roadside" submitLabel="Request assistance" fields={[
            { name: "type", label: "What happened?", options: cats.map(([, l]) => l), required: true },
            { name: "location", label: "Your location", required: true },
            { name: "vehicle", label: "Vehicle (make, model)" },
          ]} />
        </div>
      </section>
    </>
  );
}
