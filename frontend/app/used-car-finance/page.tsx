import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { TextSplit } from "@/components/sections/ServiceBlocks";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { FinancePartnersTicker } from "@/components/sections/FinancePartnersTicker";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = {
  title: "Used Car Finance",
  description: "Send a used car finance enquiry to My Car Master.",
  alternates: { canonical: "/used-car-finance" },
};

const steps = ["Send your enquiry", "The team checks current availability", "The team confirms whether it can assist", "Discuss next steps if assistance is available"];
const financeBenefits = [
  { symbol: "%", label: "Low interest rates", color: "bg-sky-700" },
  { symbol: "✓", label: "Quick approval", color: "bg-green-600" },
  { symbol: "₹", label: "Minimum documentation", color: "bg-orange-500" },
  { symbol: "♟", label: "Customer satisfaction", color: "bg-violet-700" },
  { symbol: "↔", label: "Reliable & trustworthy", color: "bg-teal-600" },
];

export default function Page() {
  return (
    <>
      <section aria-labelledby="finance-hero-title" className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-cover bg-center text-ink md:min-h-[680px]" style={{ backgroundImage: "url('/images/cars/Golden%20Hour%20Dealership%20Skyline.png')" }}>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/40 to-white/0" />
        <div className="container-x relative z-10 -translate-y-4 py-16 md:-translate-y-8 md:py-24">
          <div className="mb-5"><BackButton href="/" className="!mb-0 text-steel hover:text-ink" /></div>
          <p className="eyebrow inline-flex rounded-full bg-white/75 px-4 py-2 text-amber-deep shadow-sm">Used car finance</p>
          <h1 id="finance-hero-title" className="display mt-6 max-w-2xl text-5xl md:text-7xl">Finance for your <span className="text-amber">used car.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">Send an enquiry about a used car. The team will follow up to confirm current availability and next steps.</p>
          <ul aria-label="Finance options" className="mt-8 flex max-w-2xl flex-wrap gap-3">
            {["Quick approval process", "Competitive interest options", "Flexible EMI plans"].map((benefit) => (
              <li key={benefit} className="rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm backdrop-blur-sm">{benefit}</li>
            ))}
          </ul>
          <Button href="#enquiry" className="mt-8">Send enquiry</Button>
        </div>
      </section>
      <TextSplit title="What happens after your enquiry">
        <ol className="space-y-3">{steps.map((s, i) => <li key={s} className="flex gap-4"><span className="font-display text-2xl font-bold text-amber">{i + 1}</span><span>{s}</span></li>)}</ol>
      </TextSplit>
      <TextSplit title="Eligibility" tone="bone">
        <p>This form is an enquiry, not a finance application. If assistance is available, the team can explain the relevant requirements before you decide whether to proceed.</p>
        <p>Any finance provider sets its own eligibility criteria, rates and terms and makes the approval decision. Sending an enquiry does not guarantee eligibility or approval.</p>
      </TextSplit>
      <section id="enquiry" className="scroll-mt-28 py-20 md:py-28">
        <div className="container-x">
          <h2 className="display text-center text-4xl md:text-6xl">Finance enquiry</h2>
          <ul aria-label="Finance enquiry benefits" className="mx-auto mt-12 grid max-w-6xl overflow-hidden rounded-2xl border border-line bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-5">
            {financeBenefits.map(({ symbol, label, color }) => (
              <li key={label} className="flex min-h-[92px] items-center gap-3 border-b border-line px-4 py-4 last:border-b-0 sm:even:border-l sm:nth-last-2:border-b-0 lg:border-b-0 lg:border-l lg:first:border-l-0">
                <span aria-hidden="true" className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${color} text-2xl font-bold text-white shadow-sm`}>{symbol}</span>
                <span className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink">{label}</span>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-12 max-w-3xl">
            <EnquiryForm kind="finance" submitLabel="Send finance enquiry" showCityArea fields={[
              { name: "vehicle", label: "Vehicle you plan to buy" },
            ]} />
          </div>
        </div>
        <FinancePartnersTicker />
      </section>
    </>
  );
}
