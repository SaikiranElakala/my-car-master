import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ServicesOverview, UsedCarFeature, PdiFeature } from "@/components/home/PrimaryServices";
import { TrustSection } from "@/components/home/TrustSection";
import { FinalCta } from "@/components/home/FinalCta";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SampleReportSection } from "@/components/sections/SampleReport";
import { Coverage } from "@/components/sections/Coverage";
import { Accordion } from "@/components/ui/Accordion";
import { VehicleSelector } from "@/components/vehicle/VehicleSelector";
import { faqs } from "@/services/content";
import { testimonials } from "@/config/client";
import { VehicleInspectionNote } from "@/components/home/VehicleInspectionNote";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Hero />
      <VehicleInspectionNote />
      <ServicesOverview />
      <UsedCarFeature />
      <PdiFeature />
      <TrustSection />
      <section id="vehicles" className="bg-bone py-20 md:py-32">
        <div className="container-x">
          <h2 className="display text-5xl md:text-7xl">Start a vehicle request</h2>
          <p className="mt-4 max-w-lg text-steel">Use the list to enter your vehicle details, or type the make and model if they are missing. The team will confirm service availability.</p>
          <div className="mt-10"><VehicleSelector /></div>
        </div>
      </section>
      <HowItWorks />
      <SampleReportSection />
      <Coverage />
      {testimonials.length > 0 && (
        <section className="py-20"><div className="container-x grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => <blockquote key={t.name} className="rounded-2xl border border-line bg-white p-6"><p>{t.text}</p><footer className="mt-3 text-sm text-steel">{t.name}</footer></blockquote>)}
        </div></section>
      )}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
          <h2 className="display text-5xl md:text-7xl">Questions, answered.</h2>
          <Accordion items={faqs} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
