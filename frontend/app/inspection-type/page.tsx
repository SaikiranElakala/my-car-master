import type { Metadata } from "next";
import { CarFront, ClipboardCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Choose an Inspection",
  description: "Choose a used car inspection or a new car Pre-Delivery Inspection.",
  alternates: { canonical: "/inspection-type" },
};

const inspectionTypes = [
  {
    href: "/used-car-evaluation",
    image: "/images/services/used-car-inspection.webp",
    icon: CarFront,
    title: "Used Car Inspection",
    description: "Request an inspection of a pre-owned car before you decide whether to buy.",
    label: "View used car inspection details",
  },
  {
    href: "/new-car-pdi",
    image: "/images/services/new-car-pdi-inspection.webp",
    icon: ClipboardCheck,
    title: "New Car PDI Inspection",
    description: "Request a check of your new car at the dealership before handover.",
    label: "View PDI inspection details",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-bone pb-20 pt-32 md:pt-40">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber">My Car Master</p>
          <h1 className="display mt-3 text-5xl md:text-7xl">Choose your inspection</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-steel">Select an inspection to see its details and segment-wise prices before booking.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          {inspectionTypes.map(({ href, image, icon: Icon, title, description, label }) => (
            <Link key={href} href={href} className="group relative isolate flex min-h-[390px] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-graphite p-7 text-white shadow-soft transition duration-300 hover:-translate-y-2 hover:border-rose-700/50 hover:shadow-2xl focus-visible:outline-amber md:min-h-[440px] md:p-9">
              {image && <>
                <Image src={image} alt="" aria-hidden="true" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
              </>}
              <span className="relative z-10 mb-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/5 text-amber backdrop-blur-sm transition-colors group-hover:bg-rose-700/20"><Icon className="h-7 w-7" /></span>
              <span className="relative z-10 flex items-start justify-between gap-4">
                <span>
                  <span className="display text-3xl md:text-4xl">{title}</span>
                  <span className="mt-3 block max-w-md leading-7 text-white/85">{description}</span>
                </span>
                <ArrowUpRight className="h-6 w-6 shrink-0 text-white/75 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-amber" />
              </span>
              <span className="relative z-10 mt-6 text-sm font-semibold text-amber">{label} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
