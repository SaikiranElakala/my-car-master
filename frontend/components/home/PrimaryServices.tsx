import { ArrowUpRight, Banknote, CarFront, ClipboardCheck, Landmark, LifeBuoy, ShieldCheck, Sparkles, Stethoscope, ScrollText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, getService } from "@/services/pricing";
import { pdiChecklist } from "@/services/content";

const services = [
  { href: "/used-car-evaluation", image: "/images/services/used-car-inspection.webp", icon: CarFront, title: "Used car inspection", text: "Request an inspection of a pre-owned car before you decide whether to buy.", color: "text-rose-300", hover: "group-hover:bg-rose-700" },
  { href: "/new-car-pdi", image: "/images/services/new-car-pdi-inspection.webp", icon: ClipboardCheck, title: "New car PDI Inspection", text: "Check your new car at the dealership before taking delivery.", color: "text-rose-300", hover: "group-hover:bg-rose-700" },
  { href: "/roadside-assistance", image: "/images/services/roadside-assistance.webp", icon: LifeBuoy, title: "Roadside assistance", text: "Send a request about a breakdown, flat tyre, battery, fuel or towing. The team will confirm current availability.", color: "text-rose-300", hover: "group-hover:bg-rose-700" },
  { href: "/car-insurance", image: "/images/services/car-insurance.webp", icon: ShieldCheck, title: "Car insurance", text: "Enquire about new or used car insurance, renewals or claims. The team will confirm current availability.", color: "text-rose-300", hover: "group-hover:bg-rose-700" },
  { href: "/used-car-finance", image: "/images/services/used-car-finance.webp", icon: Banknote, title: "Used car finance", text: "Send a finance enquiry for a pre-owned car. The team will confirm current availability.", color: "text-rose-300", hover: "group-hover:bg-rose-700" },
  { href: "/contact", image: "/images/services/new-car-accessories.webp", icon: Sparkles, title: "New car accessories", text: "Enquire about useful accessories and add-ons for your new car.", color: "text-rose-300", hover: "group-hover:bg-rose-700" },
];

const additionalServices = [
  { href: "/vehicle-diagnostics", image: "/images/services/used-car-inspection.webp", icon: Stethoscope, title: "Car diagnostic check", text: "Check warning lights and vehicle system concerns with a diagnostic tool.", color: "text-rose-300", hover: "group-hover:bg-rose-700" },
  { href: "/rto-services", image: "/images/services/new-car-pdi-inspection.webp", icon: ScrollText, title: "RTO services", text: "Get help with driving licences, registration, RC transfers, permits, road tax and documents.", color: "text-rose-300", hover: "group-hover:bg-rose-700" },
];

export function ServicesOverview() {
  return (
    <section id="services" className="relative isolate scroll-mt-24 overflow-hidden bg-bone py-16 md:py-24">
      <div className="container-x relative z-10">
        <div className="max-w-2xl">
          <p className="eyebrow text-amber">My Car Master</p>
          <h2 className="display mt-3 text-5xl text-ink md:text-7xl">Our Services</h2>
          <p className="mt-4 text-lg text-steel">Choose the support you need for your car, from inspection to assistance on the road.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ href, image, icon: Icon, title, text, color, hover }) => (
            <Link key={title} href={href} className="group relative isolate flex min-h-[270px] flex-col justify-end overflow-hidden rounded-2xl border border-ink/10 bg-graphite p-6 text-white shadow-soft transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-rose-700/50 hover:shadow-2xl focus-visible:outline-amber">
              <Image src={image} alt="" aria-hidden="true" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
              <div className="relative z-10 mb-auto flex items-start justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-xl border border-white/30 bg-black/30 backdrop-blur-sm transition ${color} ${hover} group-hover:text-white`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <ArrowUpRight className={`h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1 ${color}`} aria-hidden="true" />
              </div>
              <h3 className="relative z-10 mt-8 font-display text-2xl font-bold">{title}</h3>
              <p className="relative z-10 mt-2 text-sm leading-6 text-white/85">{text}</p>
            </Link>
          ))}
        </div>
        <div className="mt-14 border-t border-line pt-10">
          <p className="eyebrow text-amber">More ways we can help</p>
          <h3 className="display mt-2 text-3xl text-ink md:text-4xl">Additional Services</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {additionalServices.map(({ href, image, icon: Icon, title, text, color, hover }) => (
              <Link key={title} href={href} className="group relative isolate flex min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl border border-ink/10 bg-graphite p-6 text-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-rose-700/50 hover:shadow-2xl focus-visible:outline-amber">
                <Image src={image} alt="" aria-hidden="true" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
                <div className="relative z-10 mb-auto flex items-start justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-xl border border-white/30 bg-black/30 backdrop-blur-sm transition ${color} ${hover} group-hover:text-white`}><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <ArrowUpRight className={`h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1 ${color}`} aria-hidden="true" />
                </div>
                <h4 className="relative z-10 mt-8 font-display text-2xl font-bold">{title}</h4>
                <p className="relative z-10 mt-2 max-w-xl text-sm leading-6 text-white/85">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Sample-only category scores for the visual. Not real data. */
const sample = [["Exterior", 9.1], ["Engine", 8.5], ["Interior", 8.8], ["Tyres", 8.3]] as const;

export function UsedCarFeature() {
  const s = getService("used-car-evaluation");
  return (
    <section className="py-20 md:py-32">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="group relative min-h-[580px] overflow-hidden rounded-[32px] bg-ink p-6 text-white shadow-2xl md:p-8">
              <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber/20 blur-3xl" />
              <Image src="/images/services/used-car-inspection.webp" alt="Inspector checking a car in a workshop" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-black/10" />
              <div className="relative mt-[280px] rounded-2xl border border-white/20 bg-black/60 p-5 backdrop-blur-md md:mt-[300px] md:p-6">
              <div className="flex items-end justify-between gap-4">
                <p className="font-display text-sm font-semibold text-white/60">Sample score — illustration only</p>
                <p className="display text-7xl text-amber md:text-8xl">8.7<span className="text-2xl text-white/50"> /10</span></p>
              </div>
              <ul className="relative mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/70">
                {sample.map(([k, v]) => <li key={k} className="flex justify-between border-b border-white/10 pb-2"><span>{k}</span><span>{v.toFixed(1)}</span></li>)}
              </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Badge tone="accent">Used car evaluation</Badge>
            <h2 className="display mt-4 text-5xl md:text-7xl">Know the car before you pay for it.</h2>
            <p className="mt-5 max-w-md text-steel">Request an inspection of the vehicle you are considering. The team will follow up to confirm availability, scope and how findings are shared.</p>
            <p className="mt-8 font-display text-5xl font-bold">{formatPrice(s.startingPricePaise)} <span className="text-base font-medium text-steel">{s.startingPricePaise === null ? "contact for pricing" : "starting price"}</span></p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/booking?service=used-car-inspection">Request Used Car Evaluation</Button>
              <Button href="/used-car-evaluation" variant="ghost">See potential checklist</Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function PdiFeature() {
  const s = getService("new-car-pdi");
  const preview = pdiChecklist.flatMap((g) => g.items).slice(0, 8);
  return (
    <section className="bg-bone py-20 md:py-32">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <Badge tone="accent">New car PDI</Badge>
          <h2 className="display mt-4 text-5xl md:text-7xl">Inspect before you take delivery.</h2>
          <p className="mt-5 max-w-md text-steel">A Pre-Delivery Inspection looks at the new car at the dealership, before you sign off and drive it home.</p>
          <p className="mt-8 font-display text-5xl font-bold">{formatPrice(s.startingPricePaise)} <span className="text-base font-medium text-steel">{s.startingPricePaise === null ? "contact for pricing" : "starting price"}</span></p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/new-car-pdi">Explore New Car PDI</Button>
            <Button href="/new-car-pdi" variant="ghost">View potential checklist</Button>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-[32px] border border-line bg-white p-6 shadow-soft md:p-10">
            <p className="font-semibold">Checklist preview</p>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {preview.map((i) => (
                <li key={i} className="flex items-center gap-3 border-b border-line py-3">
                  <span aria-hidden className="h-4 w-4 rounded border-2 border-amber" />{i}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-steel">Potential categories. Final scope will be confirmed by My Car Master.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const supporting = [
  { href: "/roadside-assistance", icon: LifeBuoy, title: "Roadside Assistance", text: "Breakdown, battery, flat tyre, fuel, towing and lockout requests." },
  { href: "/used-car-finance", icon: Landmark, title: "Used Car Finance", text: "Tell us what you need and the team will confirm whether it can assist." },
  { href: "/car-insurance", icon: ShieldCheck, title: "Car Insurance", text: "New, used, renewal and claim-assistance enquiries." },
];

export function SupportingServices() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <h2 className="display text-4xl md:text-6xl">Also with My Car Master</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {supporting.map(({ href, icon: Icon, title, text }) => (
            <Link key={href} href={href} className="group grid min-h-[96px] items-center gap-3 py-6 md:grid-cols-[auto_1fr_1.2fr_auto] md:gap-8">
              <Icon className="h-7 w-7 text-amber" aria-hidden />
              <span className="display text-3xl md:text-4xl">{title}</span>
              <span className="text-steel">{text}</span>
              <ArrowUpRight className="hidden h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:block" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
