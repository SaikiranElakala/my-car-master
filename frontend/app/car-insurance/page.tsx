import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { TextSplit } from "@/components/sections/ServiceBlocks";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { InsuranceLogosTicker } from "@/components/sections/InsuranceLogosTicker";

export const metadata: Metadata = {
  title: "Car Insurance",
  description: "Car insurance enquiries for new cars, used cars, renewals and claim assistance.",
  alternates: { canonical: "/car-insurance" },
};

const insuranceBenefits = [
  { title: "Legal Compliance", text: "Under the Motor Vehicles Act, having at least a third-party liability policy is legally mandatory to drive on public roads. Driving without it can lead to penalties under applicable law." },
  { title: "Third-Party Liability Protection", text: "If your vehicle injures someone, causes a fatality, or damages another person's property, third-party insurance may cover compensation and legal costs, subject to the policy and applicable law." },
  { title: "Own Damage Coverage", text: "A comprehensive policy may pay for repairs or replacement of your own vehicle if it is damaged in an accident, fire, vandalism, or a natural disaster such as a flood or earthquake, subject to policy terms and exclusions." },
  { title: "Theft Protection", text: "If your vehicle is stolen, a comprehensive or other applicable policy may reimburse you up to the Insured Declared Value (IDV), subject to the policy terms and claim assessment." },
  { title: "Personal Accident Cover", text: "Personal accident cover can provide financial support for covered injuries or accidental death of the owner-driver. Passenger cover may be available depending on the policy or add-on selected." },
  { title: "Family Financial Security", text: "Where a policy provides a death benefit, the payout may help protect the policyholder's dependents from immediate financial distress after a fatal accident." },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Car insurance" title="Insurance," accent="questions?" lead="Send an enquiry about a policy, renewal or claim. The team will follow up to confirm current availability and next steps." ctaLabel="Send enquiry" ctaHref="#enquiry" backgroundImage="/images/cars/Modern SUV Insurance Protection Scene.png" showBackButton liftContent />
      <TextSplit title="Choose an enquiry topic">
        <ul className="list-disc space-y-2 pl-5"><li>New car insurance</li><li>Used car insurance</li><li>Renewal</li><li>Claim assistance</li></ul>
        <p>This form sends your enquiry to My Car Master. The team will confirm whether assistance is currently available. Insurers determine policy terms, premiums and claim decisions.</p>
      </TextSplit>
      <section className="bg-ink py-16 text-white md:py-24">
        <div className="container-x">
          <p className="eyebrow text-amber">Know your protection</p>
          <h2 className="display mt-3 max-w-3xl text-4xl md:text-6xl">Why car insurance matters</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insuranceBenefits.map((benefit, index) => (
              <article key={benefit.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <span className="font-display text-2xl font-bold text-amber">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{benefit.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-xs leading-5 text-white/50">Coverage, exclusions, limits, deductibles, eligibility, and claim decisions depend on the specific insurer and policy selected. This information is general; please review the policy wording and confirm details with the insurer.</p>
        </div>
      </section>
      <section id="enquiry" className="scroll-mt-28 bg-bone py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="display text-4xl md:text-6xl">Insurance enquiry</h2>
          <EnquiryForm kind="insurance" submitLabel="Send insurance enquiry" fields={[
            { name: "type", label: "What do you need?", options: ["New car", "Used car", "Renewal", "Claim assistance"], required: true },
            { name: "vehicle", label: "Vehicle (make, model)" },
          ]} />
        </div>
        <div className="mt-14 md:mt-20"><InsuranceLogosTicker /></div>
      </section>
    </>
  );
}
