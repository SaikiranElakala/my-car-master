import { BadgeCheck, CarFront, ClipboardCheck, FileCheck2, FileText, IdCard, Receipt, ShieldCheck } from "lucide-react";

type RtoService = { title: string; detail: string };
const icons = [IdCard, CarFront, FileCheck2, ShieldCheck, ClipboardCheck, Receipt, FileText, BadgeCheck];

export function RtoServicesGrid({ services }: { services: RtoService[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map(({ title, detail }, index) => {
        const Icon = icons[index % icons.length];
        return (
          <a key={title} href="#enquiry" aria-label={`Request help with ${title}`} className="rounded-2xl border border-line bg-white p-5 text-left shadow-soft transition hover:-translate-y-1 hover:border-amber/50 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-amber">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber/10 text-amber"><Icon className="h-6 w-6" aria-hidden="true" /></span>
            <span className="mt-5 block font-display text-xl font-bold text-ink">{title}</span>
            <span className="mt-2 block text-sm leading-6 text-steel">{detail}</span>
          </a>
        );
      })}
    </div>
  );
}
