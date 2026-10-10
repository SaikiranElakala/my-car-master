import { Accordion } from "@/components/ui/Accordion";
import { faqs } from "@/services/content";
import { inspectionDisclaimer } from "@/config/site";
import { InspectionPricingCards } from "@/components/sections/InspectionPricingCards";

export function TextSplit({ title, children, tone = "light" }: { title: string; children: React.ReactNode; tone?: "light" | "bone" }) {
  return (
    <section className={tone === "bone" ? "bg-bone py-20 md:py-28" : "py-20 md:py-28"}>
      <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="display text-4xl md:text-6xl">{title}</h2>
        <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-steel">{children}</div>
      </div>
    </section>
  );
}

export function UsedCarEvaluationPricing() {
  return <InspectionPricingCards title="Used Car Evaluation" description="A pre-purchase inspection to help you understand the vehicle's condition before you decide to buy." prices={[{ segment: "Hatchback & Sedan", price: 499 }, { segment: "SUV", price: 799 }, { segment: "Premium", price: 1299 }]} bookingHref="/booking?service=used-car-inspection" />;
}

export function NewCarPdiPricing() {
  return <InspectionPricingCards title="New Car PDI Inspection" description="A pre-delivery check at the dealership to review your new car before handover." prices={[{ segment: "Hatchback & Sedan", price: 799 }, { segment: "SUV", price: 1299 }, { segment: "Premium", price: 1999 }]} bookingHref="/booking?service=new-car-pdi" />;
}

export function FaqBlock({ service }: { service: string }) {
  const items = faqs.filter((f) => f.service === service || f.service === "general");
  return (
    <section className="py-20 md:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
        <h2 className="display text-4xl md:text-6xl">Frequently asked</h2>
        <Accordion items={items} />
      </div>
    </section>
  );
}

export function Disclaimer() {
  return (
    <section className="pb-20">
      <div className="container-x"><p className="max-w-3xl border-l-2 border-amber pl-4 text-sm text-steel"><strong className="text-ink">Disclaimer. </strong>{inspectionDisclaimer}</p></div>
    </section>
  );
}
