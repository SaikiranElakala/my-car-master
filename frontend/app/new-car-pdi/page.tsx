import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { NewCarPdiPricing, TextSplit } from "@/components/sections/ServiceBlocks";

const pdiBenefits = [
  ["✅", "Manufacturing defects", "Checks the body, paint, lights, electrical systems, air conditioning, engine and other components where accessible and included in the selected package."],
  ["🔍", "Transport damage", "Looks for scratches, dents, repainting, panel damage and glass damage that may have happened during transportation."],
  ["📅", "Manufacturing date", "Checks the manufacturing date so you can understand how long the vehicle may have been in stock."],
  ["🧾", "VIN and vehicle details", "Compares the chassis or VIN, engine number, variant and colour with the available vehicle documents."],
  ["🛞", "Tyres and battery", "Reviews tyre condition and manufacturing dates, battery condition and basic mechanical components where accessible."],
  ["🎛️", "Features and electronics", "Tests accessible features such as infotainment, cameras, sensors, windows, locks, lights, horn, wipers and USB ports."],
  ["📦", "Accessories", "Checks for promised accessories, spare wheel, tools, mats, manuals and other listed items."],
  ["📊", "Inspection report", "Documents observations and vehicle condition in a report, with photographs where applicable."],
  ["💰", "Issues before delivery", "Helps you raise identified concerns with the dealer before taking delivery, which may help avoid unexpected repair costs later."],
  ["🤝", "Informed decision", "Gives you documented findings to discuss corrections, damaged items or whether to proceed with delivery."],
  ["🛡️", "Delivery condition record", "Creates a record of the vehicle's observed condition at the time of inspection."],
  ["⭐", "Peace of mind", "Helps you understand what you are accepting before signing the final delivery documents."],
];

export const metadata: Metadata = {
  title: "New Car PDI Inspection",
  description: "Learn about the New Car Pre-Delivery Inspection and view prices by vehicle segment.",
  alternates: { canonical: "/new-car-pdi" },
};

export default function Page() {
  return (
    <>
      <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-ink bg-cover bg-center pb-12 pt-28 text-white md:min-h-[680px] md:pb-16 md:pt-32" style={{ backgroundImage: "url('/images/cars/Sunset%20Car%20Inspection%20at%20the%20Dealership.png')" }}>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-ink/5" />
        <div className="container-x relative z-10">
          <p className="eyebrow text-amber">New Car PDI Inspection</p>
          <h1 className="display mt-4 max-w-4xl text-5xl md:text-7xl">Check your new car before delivery.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">A Pre-Delivery Inspection is a check of a new car at the dealership before handover. Share your vehicle and location so the team can confirm availability and inspection arrangements.</p>
          <Button href="#pricing" className="mt-8">View prices and book</Button>
        </div>
      </section>
      <TextSplit title="About New Car PDI">
        <p>PDI means Pre-Delivery Inspection. It gives you an opportunity to review your new car’s condition, features and visible details at the dealership before you accept delivery.</p>
        <p>The inspection scope and arrangements are confirmed with the team before booking. A PDI can help you raise visible concerns with the dealership before handover.</p>
      </TextSplit>
      <section className="bg-bone py-16 md:py-24">
        <div className="container-x">
          <p className="eyebrow text-amber-deep">Before you take delivery</p>
          <h2 className="display mt-3 max-w-4xl text-4xl md:text-6xl">What does a PDI inspection cover?</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-steel">A pre-delivery inspection reviews key vehicle condition, details and features before handover. Checks depend on access to the vehicle and the package selected; it is not a guarantee that every hidden or intermittent issue will be found.</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pdiBenefits.map(([icon, title, description]) => (
              <li key={title} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <span aria-hidden="true" className="text-2xl">{icon}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <NewCarPdiPricing />
    </>
  );
}
