import type { Metadata } from "next";
import { SimpleHeader } from "@/components/sections/Simple";
import { SampleReportCard } from "@/components/sections/SampleReport";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Inspection report", alternates: { canonical: "/sample-report" } };

export default function Page() {
  return (
    <>
      <SimpleHeader title="Inspection report" lead="View the inspection report document." />
      <section className="py-16 md:py-24"><div className="container-x max-w-4xl">
        <SampleReportCard />
        <Button href="/booking" className="mt-8">Book an inspection</Button>
      </div></section>
    </>
  );
}
