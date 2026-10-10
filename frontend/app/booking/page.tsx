import type { Metadata } from "next";
import { SimpleHeader } from "@/components/sections/Simple";
import { VehicleSelector } from "@/components/vehicle/VehicleSelector";

export const metadata: Metadata = { title: "Request an inspection", robots: { index: false }, alternates: { canonical: "/booking" } };

export default function Page() {
  return (
    <>
      <SimpleHeader
        title="Request an inspection"
        lead="Choose your car, share your details and preferred date. The team will follow up to confirm availability."
        backHref="/"
        backgroundImage="/images/cars/Modern%20Auto%20Inspection%20Workshop.png"
        backgroundPosition="right center"
        backgroundSize="auto 100%"
        backgroundHeightClassName="flex min-h-[540px] items-center bg-no-repeat pb-14 pt-32 md:min-h-[680px] md:pb-20 md:pt-36"
        titleClassName="display max-w-4xl text-[clamp(2.8rem,6vw,5rem)]"
      />
      <section className="py-16 md:py-24"><div className="container-x">
        <VehicleSelector />
      </div></section>
    </>
  );
}
