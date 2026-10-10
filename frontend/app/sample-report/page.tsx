import type { Metadata } from "next";
import { SimpleHeader } from "@/components/sections/Simple";
import { SampleReportCard } from "@/components/sections/SampleReport";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Sample inspection report", alternates: { canonical: "/sample-report" } };

export default function Page() {
  return (
    <>
      <SimpleHeader title="Sample report" lead="Fictional data, shown only to illustrate the layout. This is not a real customer report." />
      <section className="py-16 md:py-24"><div className="container-x max-w-4xl">
        <SampleReportCard />
        <Button href="/booking" className="mt-8">Book an inspection</Button>
      </div></section>
    </>
  );
}
