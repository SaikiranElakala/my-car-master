import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { RtoServicesGrid } from "@/components/sections/RtoServicesGrid";

export const metadata: Metadata = {
  title: "RTO Services",
  description: "Request assistance with driving licences, vehicle registration, RC transfers, permits, road tax and RTO documents.",
  alternates: { canonical: "/rto-services" },
};

const rtoServices = [
  { title: "Driving Licence", detail: "New, renewal, duplicate or update" },
  { title: "Vehicle Registration", detail: "New registration or re-registration" },
  { title: "RC Transfer", detail: "Ownership transfer or name change" },
  { title: "Insurance", detail: "New policy or renewal" },
  { title: "Pollution Certificate", detail: "New certificate or renewal" },
  { title: "Road Tax", detail: "Payment and receipt assistance" },
  { title: "Document Assistance", detail: "End-to-end support for RTO documents" },
  { title: "Permits", detail: "Assistance with all types of permits" },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Additional service - RTO assistance" title="RTO services," accent="made simpler." lead="Get assistance with common vehicle and driving document requests. Tell us what you need and the team will confirm the process, availability and applicable charges." ctaLabel="Request RTO assistance" ctaHref="#enquiry" secondary={{ label: "View RTO services", href: "#rto-service-list" }} backgroundImage="/images/cars/Modern%20RTO%20Registration%20Office%20Scene.png" />
      <section id="rto-service-list" className="scroll-mt-28 bg-bone py-16 md:py-24">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow text-amber">RTO assistance</p>
            <h2 className="display mt-3 text-4xl md:text-6xl">Our RTO services</h2>
            <p className="mt-4 text-steel">Choose a service to open an enquiry. Requirements and fees vary by state and request; the team will confirm the process and required documents.</p>
          </div>
          <RtoServicesGrid services={rtoServices} />
          <p className="mt-6 max-w-3xl text-xs leading-5 text-steel">Government authorities make final decisions on applications and approvals.</p>
        </div>
      </section>
      <section id="enquiry" className="scroll-mt-28 py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div><h2 className="display text-4xl md:text-6xl">RTO service enquiry</h2><p className="mt-4 text-steel">Share your request and the team will get back to you.</p></div>
          <EnquiryForm kind="contact" submitLabel="Send RTO enquiry" fields={[
            { name: "service", label: "What do you need help with?", options: rtoServices.map(({ title, detail }) => `${title} - ${detail}`), required: true },
            { name: "vehicle", label: "Vehicle (make, model, year)" },
            { name: "location", label: "City or RTO location", required: true },
          ]} />
        </div>
      </section>
    </>
  );
}
