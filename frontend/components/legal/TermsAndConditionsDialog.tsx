"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const pdiTerms = [
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

export function TermsAndConditionsDialog({
  label = "Terms and Conditions",
  className = "inline font-semibold text-amber underline",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>{label}</button>
      {open && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="terms-dialog-title" className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-t-4 border-amber bg-white text-ink shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-line p-5 md:p-7">
              <div><p className="eyebrow text-amber">My Car Master</p><h2 id="terms-dialog-title" className="display mt-2 text-2xl md:text-4xl">New Car Pre-Delivery Inspection (PDI) Terms &amp; Conditions</h2></div>
              <button type="button" autoFocus onClick={() => setOpen(false)} aria-label="Close Terms and Conditions" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-steel transition hover:bg-bone hover:text-ink"><X className="h-6 w-6" /></button>
            </header>
            <div className="overflow-y-auto p-5 md:p-7">
              <ol className="space-y-6">
                {pdiTerms.map(([heading, description], index) => (
                  <li key={heading} className="grid gap-2 border-b border-line pb-5 last:border-0 last:pb-0 md:grid-cols-[2.5rem_1fr] md:gap-4">
                    <span className="font-display text-2xl font-bold text-amber">{index + 1}.</span>
                    <div><h3 className="font-semibold">{heading}</h3><p className="mt-1 text-sm leading-6 text-steel">{description}</p></div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 border-t border-line pt-6 text-sm font-semibold">My Car Master – Independent New Car PDI Service</p>
              <p className="mt-2 text-sm leading-6 text-steel">Our goal is to help you make a more informed decision before taking delivery of your new car.</p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
