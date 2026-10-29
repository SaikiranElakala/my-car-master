"use client";
import { useEffect, useState, type FormEvent } from "react";
import { Check, CheckCircle2, Search, ArrowLeft, ArrowRight, CalendarDays, MapPin, CarFront, Copy, CheckCheck, Home } from "lucide-react";
import Link from "next/link";
import { getBrands, getModels } from "@/services/vehicleCatalog";
import type { Brand, VehicleModel } from "@/types";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { customerErrorMessage, readApiResponse } from "@/lib/apiResponse";
import { locationGroups, neighborhoodsByLocation } from "@/config/locations";
import { featuredVehicleTypes, vehicleTypes } from "@/config/vehicleTypes";
import { PrivacyPolicyDialog } from "@/components/legal/PrivacyPolicyDialog";
import { TermsAndConditionsDialog } from "@/components/legal/TermsAndConditionsDialog";

const steps = ["Brand", "Model", "Booking details"] as const;
type BookingConfirmation = { service: string; email: string; emailSent: boolean; preferredDate: string; city: string; area: string; vehicleType: string; vehicle: string };
const todayLocal = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const brandLogoSlugs: Record<string, string> = {
  "maruti-suzuki": "suzuki",
  hyundai: "hyundai",
  // Simple Icons has Tata's emblem under `tata` (there is no `tatamotors` slug).
  "tata-motors": "tata",
  mahindra: "mahindra",
  toyota: "toyota",
  honda: "honda",
  kia: "kia",
  bmw: "bmw",
  volkswagen: "volkswagen",
  skoda: "skoda",
  renault: "renault",
  nissan: "nissan",
  mg: "mg",
  jeep: "jeep",
  citroen: "citroen",
  "mercedes-benz": "mercedes",
  audi: "audi",
  volvo: "volvo",
  jaguar: "jaguar",
  "land-rover": "landrover",
  lexus: "lexus",
  porsche: "porsche",
  byd: "byd",
  isuzu: "isuzu",
};

const brandWordmarks: Record<string, string> = {
  "maruti-suzuki": "MARUTI SUZUKI",
  "tata-motors": "TATA",
  "mercedes-benz": "MERCEDES-BENZ",
  jaguar: "JAGUAR",
  "land-rover": "LAND ROVER",
  lexus: "LEXUS",
  isuzu: "ISUZU",
  "force-motors": "FORCE MOTORS",
};

function BrandLogo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const slug = brandLogoSlugs[brand.id];
  const initials = brand.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <span className="mt-2 flex h-12 w-full items-center justify-center" aria-hidden="true">
      {brand.id === "byd" ? (
        <span className="font-display text-3xl font-black tracking-[0.12em] text-[#d71920]">BYD</span>
      ) : slug && !failed ? (
        // Simple Icons hosts the brand marks; use a brand wordmark if an icon is unavailable.
        <img src={`https://cdn.simpleicons.org/${slug}?viewbox=auto`} alt="" loading="lazy" onError={() => setFailed(true)} className="h-11 w-20 object-contain opacity-85 transition group-hover:scale-110 group-hover:opacity-100" />
      ) : (
        <span className={cn(
          "font-display font-black tracking-wide transition group-hover:scale-105",
          brandWordmarks[brand.id] ? "text-sm text-ink/80" : "grid h-11 min-w-11 place-items-center rounded-full border border-amber/40 bg-amber/10 px-2 text-lg text-amber"
        )}>{brandWordmarks[brand.id] ?? initials}</span>
      )}
    </span>
  );
}

export function VehicleSelector({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<Brand | null>(null);
  const [model, setModel] = useState<VehicleModel | null>(null);
  const [customVehicle, setCustomVehicle] = useState(false);
  const [customBrandName, setCustomBrandName] = useState("");
  const [customModelName, setCustomModelName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [requestReference, setRequestReference] = useState("");
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [referenceCopied, setReferenceCopied] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [preferredDate, setPreferredDate] = useState(todayLocal);
  const [loading, setLoading] = useState(true);

  useEffect(() => { let on = true; getBrands(query).then((b) => { if (on) { setBrands(b); setLoading(false); } }); return () => { on = false; }; }, [query]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service");
    const requestedCity = params.get("city");
    if (requestedService === "used-car-inspection") setSelectedService("Used Car Inspection");
    if (requestedService === "new-car-pdi") setSelectedService("New Car PDI Inspection");
    const applyCity = (city: string) => {
      if (!locationGroups.some((group) => (group.cities as readonly string[]).includes(city))) return;
      setSelectedCity(city);
      setSelectedArea("");
      setCustomArea("");
    };
    if (requestedCity) applyCity(requestedCity);
    const onCitySelected = (event: Event) => {
      const city = (event as CustomEvent<unknown>).detail;
      if (typeof city === "string") applyCity(city);
    };
    window.addEventListener("booking-city-selected", onCitySelected);
    return () => window.removeEventListener("booking-city-selected", onCitySelected);
  }, []);

  const step = !brand ? 0 : !model ? 1 : 2;
  const dark = tone === "dark";
  const isPdiBooking = selectedService === "New Car PDI Inspection";

  async function pickBrand(b: Brand) {
    setBrand(b); setModel(null); setCustomVehicle(false); setFormSubmitted(false);
    setModels(await getModels(b.id));
    track("vehicle_selection", { step: "brand" });
  }
  async function pickModel(m: VehicleModel) {
    setModel(m);
    setFormSubmitted(false);
    setPreferredDate(todayLocal());
  }
  function back() {
    if (step === 2) setModel(null);
    else if (step === 1) { setBrand(null); setModels([]); setCustomVehicle(false); }
  }

  function continueWithCustomVehicle() {
    const make = customBrandName.trim();
    const name = customModelName.trim();
    if (!make || !name) return;
    setBrand({ id: "customer-entered", name: make, popular: false, isActive: true });
    setModel({ id: `customer-entered-${Date.now()}`, brandId: "customer-entered", name, popular: false, isActive: true });
    setFormSubmitted(false);
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brand || !model || submitting) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSubmitting(true);
    setFormError("");
    setFormSubmitted(false);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          city: selectedCity,
          area: selectedArea === "Other" ? customArea : selectedArea,
          vehicleType: form.get("vehicleType"),
          service: form.get("service"),
          preferredDate: form.get("preferredDate"),
          brand: brand.name,
          model: model.name,
          privacyNoticeAcknowledged: form.get("privacyNoticeAcknowledged") === "on",
        }),
      });

      const result = await readApiResponse(response, "We couldn't send your request. Please try again.");
      setRequestReference(typeof result.reference === "string" ? result.reference : "");
      setBookingConfirmation({
        service: String(form.get("service") ?? selectedService),
        email: String(form.get("email") ?? ""),
        emailSent: result.customerEmailSent === true,
        preferredDate: String(form.get("preferredDate") ?? preferredDate),
        city: selectedCity,
        area: selectedArea === "Other" ? customArea : selectedArea,
        vehicleType: String(form.get("vehicleType") ?? ""),
        vehicle: `${brand.name} ${model.name}`,
      });
      setReferenceCopied(false);
      setFormSubmitted(true);
      track("booking_completed");
      formElement.reset();
    } catch (error) {
      setFormError(customerErrorMessage(error, "We couldn't send your request. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  async function copyRequestReference() {
    if (!requestReference || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(requestReference);
      setReferenceCopied(true);
      window.setTimeout(() => setReferenceCopied(false), 2000);
    } catch {
      setReferenceCopied(false);
    }
  }

  const chip = (active: boolean) =>
    cn(
      "min-h-[56px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300",
      active
        ? "border-amber bg-amber text-white shadow-lift"
        : dark ? "border-white/15 bg-white/5 text-white hover:border-amber" : "border-line bg-white hover:border-ink"
    );

  return (
    <>
    <div className={cn("rounded-[28px] border p-5 md:p-8", dark ? "border-white/10 bg-graphite text-white" : "border-line bg-white shadow-soft")}>
      <ol className="mb-8 flex items-center gap-2" aria-label="Vehicle selection progress">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2" aria-current={i === step ? "step" : undefined}>
            <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px]", i < step ? "bg-amber text-white" : i === step ? "bg-ink text-paper" : dark ? "bg-white/10" : "bg-bone text-steel")}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={cn("hidden text-xs font-semibold uppercase tracking-wider sm:block", i === step ? "" : "opacity-50")}>{s}</span>
            {i < steps.length - 1 && <span className={cn("h-px flex-1", i < step ? "bg-amber" : dark ? "bg-white/15" : "bg-line")} />}
          </li>
        ))}
      </ol>

      {step > 0 && (
        <button type="button" onClick={back} className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      )}

      {step === 0 && (
        <div>
          <h3 className="display text-3xl md:text-4xl">Select your vehicle</h3>
          <p className="mt-5 text-sm font-semibold">Choose a vehicle type <span className="font-normal text-steel">(optional)</span></p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredVehicleTypes.map(({ type }) => (
              <button key={type} type="button" aria-pressed={selectedVehicleType === type} onClick={() => setSelectedVehicleType(type)} className={cn("min-h-24 rounded-2xl border p-4 text-left font-semibold transition hover:-translate-y-0.5 hover:shadow-soft", selectedVehicleType === type ? "border-amber bg-amber text-white ring-2 ring-amber" : dark ? "border-white/15 bg-white/5 text-white hover:border-amber" : "border-line bg-paper hover:border-amber")}>
                {type}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {vehicleTypes.filter((type) => !featuredVehicleTypes.some((featured) => featured.type === type)).map((type) => (
              <button key={type} type="button" aria-pressed={selectedVehicleType === type} onClick={() => setSelectedVehicleType(type)} className={cn("min-h-10 rounded-full border px-4 text-xs font-semibold transition", selectedVehicleType === type ? "border-amber bg-amber text-white" : "border-line bg-paper hover:border-amber")}>{type}</button>
            ))}
          </div>
          <div className="relative mt-5">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search brands" placeholder="Search all brands…"
              className={cn("min-h-[52px] w-full rounded-full border pl-11 pr-4 text-sm outline-none focus:border-amber", dark ? "border-white/15 bg-white/5" : "border-line bg-paper")}
            />
          </div>
          {loading ? <p className="mt-6 text-sm opacity-60">Loading brands…</p> : brands.length === 0 ? (
            <p className="mt-6 text-sm opacity-60">No brand matches “{query}”.</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {brands.map((b) => (
                <button key={b.id} type="button" onClick={() => pickBrand(b)} className={cn(chip(false), "group flex min-h-[144px] flex-col items-start justify-center gap-0 hover:-translate-y-0.5 hover:shadow-soft")}>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] opacity-50">Make</span>
                  <span className="mt-1 block">{b.name}</span>
                  <BrandLogo brand={b} />
                </button>
              ))}
            </div>
          )}
          <p className="mt-5 text-xs opacity-60">Can’t find your vehicle? You can enter its make and model manually.</p>
          <button type="button" onClick={() => { setCustomVehicle(true); setBrand({ id: "customer-entered", name: "Your vehicle", popular: false, isActive: true }); setModel(null); setCustomBrandName(""); setCustomModelName(""); }} className="mt-3 min-h-[44px] rounded-full border border-line px-5 text-sm font-semibold transition hover:border-amber">My vehicle isn’t listed</button>
        </div>
      )}

      {step === 1 && brand && (
        <div>
          <p className="eyebrow">{customVehicle ? "Vehicle details" : brand.name}</p>
          <h3 className="display mt-1 text-3xl md:text-4xl">{customVehicle ? "Enter your vehicle" : "Choose a model"}</h3>
          {customVehicle ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">Make <span className="text-red-500">*</span><input required autoFocus value={customBrandName} onChange={(event) => setCustomBrandName(event.target.value)} placeholder="e.g. Hyundai" className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none focus:border-amber" /></label>
              <label className="text-sm font-semibold">Model <span className="text-red-500">*</span><input required value={customModelName} onChange={(event) => setCustomModelName(event.target.value)} placeholder="e.g. Creta" className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none focus:border-amber" /></label>
              <button type="button" onClick={continueWithCustomVehicle} disabled={!customBrandName.trim() || !customModelName.trim()} className="min-h-[50px] rounded-xl bg-amber px-5 text-sm font-bold uppercase text-white disabled:opacity-50 sm:col-span-2">Continue</button>
            </div>
          ) : (
            <>
              {models.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {models.map((m) => <button key={m.id} type="button" onClick={() => pickModel(m)} className={chip(false)}>{m.name}</button>)}
                </div>
              ) : <p className="mt-6 text-sm opacity-70">No models are listed for this make yet.</p>}
              <p className="mt-5 text-xs opacity-60">This list helps fill out your request. The team will confirm service availability.</p>
              <button type="button" onClick={() => { setCustomVehicle(true); setCustomBrandName(brand.name); setCustomModelName(""); }} className="mt-3 min-h-[44px] rounded-full border border-line px-5 text-sm font-semibold transition hover:border-amber">My model isn’t listed</button>
            </>
          )}
        </div>
      )}

      {step === 2 && brand && model && (
        <div>
          {!formSubmitted && <><div className="mb-6 rounded-2xl bg-ink p-5 text-white">
            <p className="eyebrow !text-white/50">Selected vehicle</p>
            <p className="display mt-1 text-2xl md:text-3xl">{brand.name} <span className="text-amber">{model.name}</span></p>
          </div>
          <h3 className="display text-3xl md:text-4xl">Your booking details</h3>
          <p className="mt-2 text-sm text-steel">Tell us how to reach you and where you need the inspection.</p></>}
          {formSubmitted ? (
            <div role="status" aria-live="polite" className={cn("animate-success-heartbeat relative mx-auto mt-2 w-full max-w-3xl overflow-hidden rounded-3xl border p-4 shadow-soft sm:p-6", dark ? "border-white/10 bg-graphite" : "border-line bg-white")}>
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-400" />
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50"><CheckCircle2 className="h-7 w-7" aria-hidden="true" /></div>
              <div className="mt-3 text-center">
                <h3 className={cn("font-display text-3xl sm:text-4xl", dark ? "text-white" : "text-ink")}>Request <span className="text-amber">Received!</span></h3>
                <p className={cn("mx-auto mt-2 max-w-xl text-sm leading-5", dark ? "text-white/70" : "text-steel")}>{bookingConfirmation?.emailSent ? `Your ${bookingConfirmation.service} request was received, and a confirmation email was sent to ${bookingConfirmation.email}.` : `Your ${bookingConfirmation?.service ?? "service"} request was received. Our team will reach out shortly; the confirmation email is queued for delivery.`}</p>
              </div>

              {bookingConfirmation && <div className={cn("mt-4 grid gap-3 rounded-2xl border p-3 sm:grid-cols-3 sm:items-center", dark ? "border-white/10 bg-white/[0.03]" : "border-line bg-paper/60")}>
                <div className="flex min-w-0 items-center gap-3 sm:col-span-1">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-white"><CarFront className="h-6 w-6" aria-hidden="true" /></span>
                  <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-steel">Service</p><p className={cn("truncate text-sm font-bold", dark ? "text-white" : "text-ink")}>{bookingConfirmation.service}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-steel">Vehicle</p><p className={cn("truncate text-xs font-semibold", dark ? "text-white/80" : "text-ink")}>{bookingConfirmation.vehicle}{bookingConfirmation.vehicleType ? ` · ${bookingConfirmation.vehicleType}` : ""}</p></div>
                </div>
                <div className={cn("flex items-center gap-3 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0", dark ? "border-white/10" : "border-line")}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600"><CalendarDays className="h-5 w-5" aria-hidden="true" /></span>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-steel">Preferred date</p><p className={cn("text-sm font-bold", dark ? "text-white" : "text-ink")}>{new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${bookingConfirmation.preferredDate}T00:00:00`))}</p></div>
                </div>
                <div className={cn("flex items-center gap-3 border-t pt-3 sm:border-l sm:pl-4 sm:pt-0", dark ? "border-white/10" : "border-line")}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600"><MapPin className="h-5 w-5" aria-hidden="true" /></span>
                  <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-steel">Location</p><p className={cn("truncate text-sm font-bold", dark ? "text-white" : "text-ink")}>{bookingConfirmation.city}</p><p className="truncate text-xs text-steel">{bookingConfirmation.area}</p></div>
                </div>
              </div>}

              {requestReference && <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-rose-200 bg-rose-50/70 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600"><Check className="h-5 w-5" aria-hidden="true" /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Booking reference</p><p className="break-all font-mono text-sm font-bold text-rose-700">{requestReference}</p></div></div>
                <button type="button" onClick={copyRequestReference} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-500 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">{referenceCopied ? <><CheckCheck className="h-4 w-4" aria-hidden="true" /> Copied</> : <><Copy className="h-4 w-4" aria-hidden="true" /> Copy reference</>}</button>
              </div>}

              <div className="mt-4">
                <h4 className={cn("font-display text-xl", dark ? "text-white" : "text-ink")}>What happens next?</h4>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">1</span><div><p className={cn("text-sm font-bold", dark ? "text-white" : "text-ink")}>Our team reviews your request</p><p className="text-xs leading-5 text-steel">We’ll verify your details and check availability in your area.</p></div></div>
                  <div className={cn("flex gap-3 sm:border-l sm:pl-4", dark ? "border-white/10" : "border-line")}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">2</span><div><p className={cn("text-sm font-bold", dark ? "text-white" : "text-ink")}>We contact you</p><p className="text-xs leading-5 text-steel">We’ll call or message you to confirm the appointment.</p></div></div>
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center gap-2">
                <Link href="/#services" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-amber px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber">Back to Services <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                <Link href="/" className="inline-flex min-h-8 items-center gap-2 text-sm font-semibold text-amber underline underline-offset-4 hover:text-amber-deep"><Home className="h-4 w-4" aria-hidden="true" /> Go to Home</Link>
              </div>
            </div>
          ) : <>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submitBooking}>
            <label className="text-sm font-semibold">Your Name <span className="text-red-500">*</span>
              <input required name="name" autoComplete="name" placeholder="Enter your full name" className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15" />
            </label>
            <label className="text-sm font-semibold">Mobile Number <span className="text-red-500">*</span>
              <input required name="phone" type="tel" inputMode="numeric" autoComplete="tel" pattern="[0-9+()\s-]{8,15}" placeholder="Enter your mobile number" className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15" />
            </label>
            <label className="text-sm font-semibold">Email Address <span className="text-red-500">*</span>
              <input required name="email" type="email" autoComplete="email" maxLength={254} placeholder="Enter your email address" className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15" />
            </label>
            <label className="text-sm font-semibold">Select City <span className="text-red-500">*</span>
              <select required value={selectedCity} onChange={(event) => { setSelectedCity(event.target.value); setSelectedArea(""); setCustomArea(""); }} className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15">
                <option value="" disabled>Select City or Area</option>{locationGroups.map((group) => <optgroup key={group.state} label={group.state}>{group.cities.map((city) => <option key={city}>{city}</option>)}</optgroup>)}
              </select>
            </label>
            <label className="text-sm font-semibold">Select Area <span className="text-red-500">*</span>
              <select required disabled={!selectedCity} value={selectedArea} onChange={(event) => { setSelectedArea(event.target.value); setCustomArea(""); }} className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15 disabled:cursor-not-allowed disabled:opacity-60">
                <option value="" disabled>{selectedCity ? "Select Area" : "Select a city first"}</option>
                {(neighborhoodsByLocation[selectedCity] ?? []).map((area) => <option key={area}>{area}</option>)}
                <option value="Other">Other</option>
              </select>
              {selectedArea === "Other" && <input required value={customArea} onChange={(event) => setCustomArea(event.target.value)} placeholder="Enter your area or locality" className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15" />}
            </label>
            <label className="text-sm font-semibold">Vehicle Type <span className="font-normal text-steel">(optional)</span>
              <select name="vehicleType" value={selectedVehicleType} onChange={(event) => setSelectedVehicleType(event.target.value)} className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15">
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">Service Required <span className="text-red-500">*</span>
              <select required name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15">
                <option value="" disabled>Select service</option>
                <option>Used Car Inspection</option><option>New Car PDI Inspection</option>
              </select>
            </label>
            <label className="text-sm font-semibold">Preferred Date <span className="text-red-500">*</span>
              <input required name="preferredDate" type="date" value={preferredDate} min={todayLocal()} onChange={(event) => setPreferredDate(event.target.value)} className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-paper px-4 font-normal text-ink outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/15" />
            </label>
            <label className="flex items-start gap-3 text-xs leading-5 text-steel sm:col-span-2">
              <input required type="checkbox" name="privacyNoticeAcknowledged" className="mt-0.5 h-5 w-5 shrink-0 accent-amber" />
              <span>I agree to the <TermsAndConditionsDialog label={isPdiBooking ? "New Car PDI Terms and Conditions" : "Terms and Conditions"} /> and ask My Car Master to use these details to handle my request as described in the <PrivacyPolicyDialog />.</span>
            </label>
            <button type="submit" disabled={submitting || formSubmitted} className="min-h-[54px] rounded-xl bg-amber px-6 text-sm font-bold uppercase tracking-wide text-white shadow-lift transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-wait disabled:opacity-70 sm:col-span-2">{submitting ? "Sending Request..." : formSubmitted ? "Request Sent" : "Submit Request"}</button>
          </form>
          {formError && <p role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">{formError}</p>}
          </>}
        </div>
      )}
    </div>
    </>
  );
}
