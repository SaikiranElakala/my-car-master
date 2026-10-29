import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { TextSplit, UsedCarEvaluationPricing, FaqBlock, Disclaimer } from "@/components/sections/ServiceBlocks";
import { ChecklistGrid } from "@/components/sections/ChecklistGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SampleReportSection } from "@/components/sections/SampleReport";
import { FinalCta } from "@/components/home/FinalCta";
import { usedCarChecklist } from "@/services/content";

export const metadata: Metadata = {
  title: "Used Car Evaluation",
  description: "Request a My Car Master used car evaluation and share your vehicle, location and preferred date.",
  alternates: { canonical: "/used-car-evaluation" },
};

const serviceHighlights = [
  ["🔎", "Experienced evaluators", "Get your vehicle checked by experienced evaluators."],
  ["📋", "Quality certificate", "Receive a quality certificate with the vehicle evaluation findings."],
  ["🧾", "Service history check", "Review available service history as part of the evaluation."],
  ["💰", "Vehicle price quotation", "Get a vehicle price quotation to help compare the car’s condition with its asking price."],
];

export default function Page() {
  return (
    <>
      <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-ink bg-cover bg-center py-16 text-white md:min-h-[680px] md:py-24" style={{ backgroundImage: "url('/images/services/used-car-inspection.webp')" }}>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
        <div className="container-x relative z-10">
          <div className="mb-5"><BackButton href="/" className="!mb-0 text-white/80 hover:text-white" /></div>
          <p className="eyebrow text-amber text-sm md:text-base">Used car inspection</p>
          <h1 className="display mt-4 max-w-4xl text-5xl md:text-7xl">Know the car before you buy.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">Get a structured evaluation of a pre-owned vehicle, its condition and available history before you decide whether to buy.</p>
          <Button href="#pricing" className="mt-8">View prices for used car inspection</Button>
        </div>
      </section>
      <UsedCarEvaluationPricing />
      <section className="relative isolate overflow-hidden bg-ink bg-cover bg-center py-16 md:py-20" style={{ backgroundImage: "url('/images/services/used-car-inspection.webp')" }}>
        <div aria-hidden="true" className="absolute inset-0 bg-ink/65" />
        <div className="container-x relative z-10">
          <p className="eyebrow text-amber text-sm md:text-base">Used car inspection</p>
          <h2 className="display mt-3 max-w-4xl text-4xl text-white md:text-6xl">Evaluation highlights</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceHighlights.map(([icon, title, description]) => (
              <li key={title} className="rounded-2xl border border-white/60 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
                <span aria-hidden="true" className="text-2xl">{icon}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <TextSplit title="What is a used car evaluation?">
        <p>It is a structured review of a pre-owned vehicle before you decide whether to buy it. Send a request with the vehicle details and the team can confirm availability, inspection scope and how findings are provided.</p>
      </TextSplit>
      <TextSplit title="Why inspection matters" tone="bone">
        <p>A used car’s condition is not always visible from a short viewing or a test drive. A structured inspection can give you more information to weigh against the asking price.</p>
        <p>Every inspection is limited to its agreed scope, so it supports your decision but does not replace it.</p>
      </TextSplit>
      <HowItWorks />
      <section className="bg-bone py-20 md:py-28"><div className="container-x">
        <h2 className="display mb-4 text-4xl md:text-6xl">Potential checklist categories</h2>
        <p className="mb-10 max-w-2xl text-steel">This illustrative list is not a confirmed inspection scope. The team will confirm what is included when it follows up.</p>
        <ChecklistGrid groups={usedCarChecklist} />
      </div></section>
      <SampleReportSection />
      <FaqBlock service="used-car-evaluation" />
      <Disclaimer />
      <FinalCta />
    </>
  );
}
