import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function SampleReportCard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-lift">
      <Image
        src="/sample-report-preview.png"
        alt="First page of the My Car Master vehicle inspection report"
        width={893}
        height={1263}
        priority
        className="h-auto w-full"
      />
    </div>
  );
}

export function SampleReportSection() {
  return (
    <section className="bg-bone py-20 md:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">Report preview</p>
          <h2 className="display mt-3 text-5xl md:text-7xl">An example<br />report layout.</h2>
          <p className="mt-6 max-w-md text-steel">View the inspection report document.</p>
          <Button href="/sample-report.pdf" className="mt-8">Open report PDF</Button>
        </div>
        <SampleReportCard />
      </div>
    </section>
  );
}
