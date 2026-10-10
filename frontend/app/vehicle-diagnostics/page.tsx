import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { TextSplit } from "@/components/sections/ServiceBlocks";
import { EnquiryForm } from "@/components/sections/EnquiryForm";

export const metadata: Metadata = {
  title: "Car Diagnostic Check",
  description: "Request a diagnostic scan for dashboard warnings or vehicle system concerns.",
  alternates: { canonical: "/vehicle-diagnostics" },
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Additional service · vehicle diagnostics" title="Understand the warning," accent="find the next step." lead="Request a diagnostic scan for dashboard warning lights or vehicle system concerns. Share your vehicle details and the symptoms you have noticed." ctaLabel="Request a diagnostic check" ctaHref="#enquiry" backgroundImage="/images/cars/Cinematic%20Automotive%20Diagnostics%20Bay.png" backgroundTone="dark" />
      <TextSplit title="What to expect">
        <p>A diagnostic tool can read supported vehicle system codes and help identify areas that need attention. The team will confirm vehicle compatibility, availability and any fee before arranging the service.</p>
        <p>A scan is an aid to diagnosis, not a repair or a guarantee that every fault will be found. A qualified technician may need to inspect the vehicle further.</p>
      </TextSplit>
      <section id="enquiry" className="scroll-mt-28 bg-bone py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div><h2 className="display text-4xl md:text-6xl">Diagnostic enquiry</h2><p className="mt-4 text-steel">Tell us which warning or issue you are seeing.</p></div>
          <EnquiryForm kind="contact" submitLabel="Send diagnostic enquiry" fields={[
            { name: "vehicle", label: "Vehicle (make, model, year)", required: true },
            { name: "warning", label: "Warning light or issue" },
            { name: "location", label: "City or area", required: true },
          ]} />
        </div>
      </section>
    </>
  );
}
