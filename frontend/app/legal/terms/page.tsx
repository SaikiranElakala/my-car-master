import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/Simple";

export const metadata: Metadata = { title: "New Car PDI Terms and Conditions", alternates: { canonical: "/legal/terms" } };

const terms = [
  ["Purpose of Inspection", "My Car Master provides an independent pre-delivery inspection of the vehicle to help identify visible defects, paint imperfections, panel gaps, scratches, dents, interior issues, and other observable concerns before delivery."],
  ["Customer Responsibility", "The customer is responsible for arranging vehicle access and obtaining permission from the dealership or vehicle owner for inspection."],
  ["Inspection Scope", "The inspection is limited to the checks included in the selected PDI package. Additional checks or services may attract extra charges."],
  ["Vehicle Condition", "The inspection is conducted based on the vehicle's accessible condition at the time of inspection. Certain defects may not be detectable during a visual or non-invasive inspection."],
  ["No Dismantling", "No vehicle parts will be dismantled, removed, or opened beyond normal operational access during the inspection."],
  ["Mechanical and Electronic Checks", "Mechanical, electrical, diagnostic, and feature checks will be performed only where accessible and included in the selected package. The inspection is not a substitute for a comprehensive workshop diagnosis."],
  ["Inspection Report", "A report containing the observations and findings will be shared with the customer. Photographs or videos may be provided wherever applicable."],
  ["No Guarantee of Defect-Free Vehicle", "An inspection reduces the risk of overlooking visible or detectable issues but cannot guarantee that the vehicle is completely defect-free or that future problems will not occur."],
  ["Dealership Responsibility", "My Car Master is an independent inspection service and is not responsible for the vehicle's manufacturing quality, dealership commitments, warranty decisions, repairs, or delivery-related disputes."],
  ["Customer Decision", "The final decision to accept, reject, or take delivery of the vehicle rests solely with the customer. Customers are advised to review the inspection findings before accepting delivery."],
  ["Payment and Cancellation", "Inspection charges must be paid as agreed at the time of booking. Cancellation, rescheduling, and refund requests will be handled according to the service terms communicated during booking."],
  ["Inspection Limitations", "Findings are based on the vehicle's condition and accessibility at the time of inspection. Hidden defects, intermittent faults, inaccessible areas, and issues that develop later may not be identified."],
  ["Accuracy of Information", "The customer should provide accurate vehicle details, dealership information, location, and scheduled inspection time to facilitate the service."],
  ["Acceptance of Terms", "Booking or proceeding with the inspection confirms that the customer has read and understood these terms and conditions."],
] as const;

export default function Page() {
  return (
    <LegalPage title="New Car Pre-Delivery Inspection (PDI) Terms & Conditions" showDraftNote={false}>
      <ol className="space-y-7">
        {terms.map(([title, description], index) => (
          <li key={title} className="grid gap-2 border-b border-line pb-6 last:border-0 last:pb-0 sm:grid-cols-[2rem_1fr] sm:gap-4">
            <span className="font-display text-xl font-bold text-amber">{index + 1}.</span>
            <div><h2 className="font-semibold text-ink">{title}</h2><p className="mt-2">{description}</p></div>
          </li>
        ))}
      </ol>
      <p className="mt-8 border-t border-line pt-6 font-semibold text-ink">My Car Master – Independent New Car PDI Service</p>
      <p className="mt-2">Our goal is to help you make a more informed decision before taking delivery of your new car.</p>
    </LegalPage>
  );
}
