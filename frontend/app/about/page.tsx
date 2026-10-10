import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CarFront, ClipboardCheck, LifeBuoy, Banknote, ShieldCheck } from "lucide-react";
import { SimpleHeader } from "@/components/sections/Simple";
import { TrustSection } from "@/components/home/TrustSection";
import { FinalCta } from "@/components/home/FinalCta";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };

const services = [
  { title: "Used car inspection", detail: "Request an inspection before deciding on a pre-owned car.", href: "/used-car-evaluation", icon: CarFront },
  { title: "New car PDI", detail: "Request a pre-delivery inspection before taking your new car home.", href: "/new-car-pdi", icon: ClipboardCheck },
  { title: "Roadside assistance", detail: "Send a request for help with common roadside issues.", href: "/roadside-assistance", icon: LifeBuoy },
  { title: "Used car finance", detail: "Enquire about finance options for a pre-owned vehicle.", href: "/used-car-finance", icon: Banknote },
  { title: "Car insurance", detail: "Send an enquiry about insurance, renewal or claims support.", href: "/car-insurance", icon: ShieldCheck },
];

export default function Page() {
  return (
    <>
      <SimpleHeader title="About My Car Master" lead="Vehicle inspections and automotive support, made easier to request." backgroundImage="/images/cars/Cinematic%20Garage%20Inspection%20with%20Mechanic%20and%20SUV.png" backgroundPosition="center 25%" backgroundHeightClassName="flex min-h-[380px] items-center bg-cover bg-center md:min-h-[480px]" />

      <section className="bg-paper py-16 md:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              <article className="relative min-h-[420px] overflow-hidden rounded-3xl bg-ink text-white shadow-soft sm:min-h-[480px]">
                <Image src="/images/cars/founder.jpg.png" alt="Kakarla Chiranjeevi, founder of My Car Master" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw" className="object-cover object-[38%_center]" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
                  <p className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">Founder</p>
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber shadow-[0_0_18px_rgba(225,29,72,0.8)]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h2 className="display text-3xl leading-[0.98] sm:text-4xl">
                    <span className="block">Kakarla</span>
                    <span className="mt-1 block text-amber">Chiranjeevi</span>
                  </h2>
                  <div className="mt-4 h-px w-16 bg-amber" />
                  <p className="mt-3 text-sm font-medium text-white/85">Founder, My Car Master</p>
                </div>
              </article>

              <article className="relative min-h-[420px] overflow-hidden rounded-3xl bg-ink text-white shadow-soft sm:min-h-[480px]">
                <Image src="/images/cars/cofounder.jpg" alt="M Santosh Kumar, Co-Founder and Managing Partner of My Car Master" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw" className="object-cover object-[center_35%]" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
                  <p className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">Leadership</p>
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber shadow-[0_0_18px_rgba(225,29,72,0.8)]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h2 className="display text-3xl leading-[0.98] sm:text-4xl">
                    <span className="block">M Santosh</span>
                    <span className="mt-1 block text-amber">Kumar</span>
                  </h2>
                  <div className="mt-4 h-px w-16 bg-amber" />
                  <p className="mt-3 text-sm font-medium text-white/85">Co-Founder &amp; Managing Partner</p>
                </div>
              </article>
            </div>

            <div className="mt-8 flex flex-col justify-center rounded-3xl border border-line bg-white p-7 shadow-soft sm:p-9">
              <p className="eyebrow text-amber">Our story</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">One place for practical car support.</h2>
              <p className="mt-5 text-base leading-7 text-steel">Founded by Kakarla Chiranjeevi, with M Santosh Kumar as Co-Founder and Managing Partner, My Car Master brings vehicle inspections and related automotive service enquiries together in one place.</p>
              <p className="mt-3 text-base leading-7 text-steel">Customers can share their vehicle, location and preferred date through the website. The team follows up to review the request and confirm service availability and next steps.</p>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-5xl">
            <div className="max-w-2xl">
              <p className="eyebrow text-amber">What we do</p>
              <h2 className="display mt-3 text-4xl sm:text-5xl">Services built around your car journey.</h2>
              <p className="mt-4 text-base leading-7 text-steel">Choose a service to learn more or send a request. The My Car Master team will follow up about your enquiry.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ title, detail, href, icon: Icon }) => (
                <Link key={title} href={href} className="group rounded-2xl border border-line bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-amber/50 hover:shadow-lift">
                  <span className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-soft text-amber"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <ArrowUpRight className="h-5 w-5 text-steel transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-amber" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{detail}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-16 flex max-w-5xl flex-col gap-6 rounded-3xl border border-line bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="eyebrow text-amber">Stay connected</p>
              <h2 className="display mt-2 text-3xl">Follow My Car Master</h2>
            </div>
            <SocialLinks tone="dark" />
          </div>
        </div>
      </section>

      <TrustSection />
      <FinalCta />
    </>
  );
}
