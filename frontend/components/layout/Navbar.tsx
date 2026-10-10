"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, MessageCircle, ChevronDown, ArrowUpRight, CarFront, ClipboardCheck, LifeBuoy, ShieldCheck, Banknote, MapPin, Search, ChevronRight } from "lucide-react";
import { nav } from "@/config/site";
import { locationGroups } from "@/config/locations";
import { client, whatsappHref } from "@/config/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

const serviceLinks = [
  { label: "Used Car Inspection", description: "Condition checks before you buy", href: "/used-car-evaluation", icon: CarFront },
  { label: "New Car PDI Inspection", description: "Check your car before delivery", href: "/new-car-pdi", icon: ClipboardCheck },
  { label: "Roadside Assistance", description: "Help when you need it on the road", href: "/roadside-assistance", icon: LifeBuoy },
  { label: "Car Insurance", description: "Cover, renewals and claims support", href: "/car-insurance", icon: ShieldCheck },
  { label: "Used Car Finance", description: "Explore finance for your next car", href: "/used-car-finance", icon: Banknote },
];

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [citiesModalOpen, setCitiesModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const visibleCityGroups = locationGroups
    .map((group) => ({ ...group, cities: group.cities.filter((city) => city.toLowerCase().includes(citySearch.trim().toLowerCase())) }))
    .filter((group) => group.cities.length > 0);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || citiesModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, citiesModalOpen]);

  useEffect(() => {
    if (!citiesModalOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCitiesModalOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [citiesModalOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-6">
      <nav
        aria-label="Main"
        className={cn(
          "flex w-full max-w-[1280px] items-center justify-between rounded-full border backdrop-blur-xl transition-all duration-500",
          scrolled ? "h-14 border-line bg-paper/85 px-4 shadow-soft md:px-5" : "h-[68px] border-white/15 bg-ink/35 px-5 text-white md:px-6"
        )}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label="My Car Master home">
          <Image
            src={scrolled ? "/images/brand/my-car-master-logo.webp" : "/images/brand/my-car-master-logo-night.webp"}
            alt="My Car Master — Inspect, Evaluate, Drive with Confidence"
            width={160}
            height={54}
            priority
            className="h-10 w-[138px] object-contain transition-opacity duration-300 md:h-12 md:w-[160px]"
          />
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {nav.map((n) => (
            n.label === "Services" ? (
              <li key={n.href} className="group relative">
                <Link href={n.href} aria-haspopup="true" className={cn("flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium transition-colors", scrolled ? "hover:bg-ink/5" : "hover:bg-white/10")}>
                  {n.label}<ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 w-[min(500px,92vw)] -translate-x-1/2 translate-y-3 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="max-h-[70vh] overflow-y-auto rounded-[28px] border border-white/80 bg-[#f8f6f1]/95 p-3 text-ink shadow-[0_28px_90px_rgba(0,0,0,0.32)] ring-1 ring-white/40 backdrop-blur-2xl">
                    <div className="relative mb-3 flex items-center justify-between overflow-hidden rounded-2xl border border-white/15 bg-ink/75 px-5 py-4 text-white backdrop-blur-xl">
                      <div aria-hidden="true" className="absolute -right-8 -top-16 h-36 w-36 rounded-full bg-amber/25 blur-2xl" />
                      <div className="relative flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber text-white"><CarFront className="h-6 w-6" /></span>
                        <span>
                          <span className="block font-display text-xl font-bold uppercase tracking-wide">Explore our services</span>
                          <span className="mt-0.5 block text-xs text-white/65">Explore services and send a request to the team</span>
                        </span>
                      </div>
                      <Link href="/#services" className="relative ml-3 inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold transition hover:border-amber hover:bg-amber hover:text-white">All services <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                    </div>
                    <div className="grid grid-cols-1 gap-2 p-1">
                      {serviceLinks.map(({ label, description, href, icon: Icon }) => (
                        <Link key={label} href={href} className="group/item flex gap-3 rounded-2xl border border-white/80 bg-white/85 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-amber/30 hover:bg-white hover:shadow-[0_8px_24px_rgba(22,23,26,0.10)] focus-visible:border-amber/30 focus-visible:bg-white">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white bg-white text-amber shadow-sm transition group-hover/item:bg-amber group-hover/item:text-white"><Icon className="h-5 w-5" /></span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-1 text-sm font-semibold">{label}<ArrowUpRight className="h-3.5 w-3.5 text-steel opacity-0 transition group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:opacity-100" /></span>
                            <span className="mt-1 block text-xs leading-5 text-steel">{description}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ) : n.label === "Cities" ? (
              <li key={n.href}>
                <button type="button" onClick={() => setCitiesModalOpen(true)} className={cn("rounded-full px-3 py-2 text-[13px] font-medium transition-colors", scrolled ? "hover:bg-ink/5" : "hover:bg-white/10")}>
                  Cities
                </button>
              </li>
            ) : (
              <li key={n.href}>
                <Link href={n.href} className={cn("rounded-full px-3 py-2 text-[13px] font-medium transition-colors", scrolled ? "hover:bg-ink/5" : "hover:bg-white/10")}>
                  {n.label}
                </Link>
              </li>
            )
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={client.whatsappNumber ? whatsappHref() : "/contact#contact-form"}
            onClick={client.whatsappNumber ? () => track("whatsapp_click") : undefined}
            className={cn("hidden min-h-[44px] items-center gap-2 rounded-full px-4 text-[13px] font-medium md:inline-flex", scrolled ? "hover:bg-ink/5" : "hover:bg-white/10")}
          >
            <MessageCircle className="h-4 w-4" /> {client.whatsappNumber ? "WhatsApp" : "Contact"}
          </a>
          <div className="hidden flex-col items-center gap-0.5 md:flex">
            <Button href="/inspection-type" onClick={() => track("book_now_click")} className="!min-h-[42px] !px-5">Request Inspection</Button>
            <a href="mailto:hello@mycarmaster.in" className={cn("whitespace-nowrap text-[9px] leading-3 underline underline-offset-2", scrolled ? "text-ink/70 hover:text-amber" : "text-white/75 hover:text-white")}>
              For your services, email hello@mycarmaster.in
            </a>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 top-0 z-[-1] bg-ink px-6 pt-28 text-white xl:hidden">
          <ul className="space-y-1">
            {nav.map((n) => n.label === "Cities" ? (
              <li key={n.href}>
                <button type="button" onClick={() => { setOpen(false); setCitiesModalOpen(true); }} className="display flex w-full items-center justify-between py-3 text-left text-4xl">
                  Cities<MapPin className="h-7 w-7 text-amber" />
                </button>
              </li>
            ) : (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="display block py-3 text-4xl">{n.label}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <div className="grid justify-items-center gap-1">
              <Button href="/inspection-type" onClick={() => setOpen(false)}>Request Inspection</Button>
              <a href="mailto:hello@mycarmaster.in" className="text-xs text-white/75 underline underline-offset-2">For your services, email hello@mycarmaster.in</a>
            </div>
            <Button href={client.whatsappNumber ? whatsappHref() : "/contact#contact-form"} variant="light" onClick={client.whatsappNumber ? () => track("whatsapp_click") : undefined}>{client.whatsappNumber ? "WhatsApp" : "Contact"}</Button>
          </div>
        </div>
      )}

      {citiesModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 p-3 backdrop-blur-md sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setCitiesModalOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="city-dialog-title" className="flex max-h-[calc(100vh-24px)] w-full max-w-6xl flex-col overflow-hidden rounded-[26px] border-t-4 border-amber bg-white p-4 shadow-2xl sm:max-h-[calc(100vh-48px)] sm:rounded-[32px] sm:p-7">
            <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 shrink-0 fill-amber text-amber" />
                <div>
                  <h2 id="city-dialog-title" className="font-display text-2xl font-bold sm:text-3xl">Select Your City</h2>
                  <p className="text-sm text-steel">Find and select your city to get started</p>
                </div>
              </div>
              <button type="button" onClick={() => setCitiesModalOpen(false)} aria-label="Close city selector" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-steel transition hover:bg-bone hover:text-ink"><X className="h-6 w-6" /></button>
            </div>

            <label className="mb-4 flex h-14 shrink-0 items-center gap-3 rounded-2xl border border-line bg-white px-4 transition focus-within:border-amber focus-within:shadow-[0_0_0_3px_rgba(225,29,72,0.14)]">
              <Search className="h-5 w-5 shrink-0 text-amber" />
              <input autoFocus value={citySearch} onChange={(event) => setCitySearch(event.target.value)} placeholder="Search city..." aria-label="Search cities" className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-sm text-ink outline-none ring-0 placeholder:text-steel/70 focus:border-0 focus:outline-none focus:ring-0" />
            </label>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
              {visibleCityGroups.length ? visibleCityGroups.map((group) => (
                <section key={group.state}>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-amber">{group.state}</h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {group.cities.map((city) => (
                      <button key={city} type="button" aria-pressed={selectedCity === city} onClick={() => { setSelectedCity(city); setCitiesModalOpen(false); window.dispatchEvent(new CustomEvent("booking-city-selected", { detail: city })); router.push(`/booking?city=${encodeURIComponent(city)}`); }} className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition hover:-translate-y-0.5 hover:border-amber/60 hover:bg-amber/5 hover:shadow-sm ${selectedCity === city ? "border-amber bg-amber/5" : "border-line bg-white"}`}>
                        <MapPin className="h-4 w-4 shrink-0 fill-amber text-amber" /><span className="min-w-0 flex-1">{city}</span><ChevronRight className="h-4 w-4 shrink-0 text-steel/60" />
                      </button>
                    ))}
                  </div>
                </section>
              )) : <p className="rounded-xl bg-bone p-5 text-center text-sm text-steel">No cities match “{citySearch}”. Contact us and we’ll help check your area.</p>}
            </div>

            <div className="mt-4 flex shrink-0 flex-col items-start justify-between gap-3 rounded-2xl border border-amber/15 bg-[#fff1f2] p-4 sm:flex-row sm:items-center sm:px-5">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 shrink-0 fill-amber text-amber" />
                <div><p className="text-sm font-bold text-amber">Can&apos;t find your city?</p><p className="mt-1 text-xs text-steel sm:text-sm">Don&apos;t worry, we might still serve your area.</p></div>
              </div>
              <Link href="/contact" onClick={() => setCitiesModalOpen(false)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber px-4 text-sm font-semibold text-amber transition hover:bg-amber hover:text-white"><MessageCircle className="h-4 w-4" />Contact Us</Link>
            </div>
          </section>
        </div>
      )}
    </header>
  );
}
