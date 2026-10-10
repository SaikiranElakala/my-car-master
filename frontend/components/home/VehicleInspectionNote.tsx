import { CarFront, ShieldCheck, UserRoundCheck } from "lucide-react";

const notes = [
  { icon: ShieldCheck, title: "Personal belongings", text: "Please remove and safeguard valuables and personal belongings before the inspection. My Car Master is not responsible for items left inside the vehicle." },
  { icon: UserRoundCheck, title: "Be present during inspection", text: "The customer must be present during the vehicle evaluation and remain available until the inspection is complete." },
  { icon: CarFront, title: "Join the test drive", text: "The customer must accompany the inspection team during the vehicle test drive." },
];

export function VehicleInspectionNote() {
  return (
    <section aria-label="Vehicle inspection notes" className="border-y border-white/10 bg-ink py-5 text-white md:py-6">
      <div className="container-x">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="eyebrow text-amber">Before your inspection</p>
          <span className="text-xs text-white/45 md:hidden">Scroll for all 3 notes <span aria-hidden="true">→</span></span>
        </div>
        <ol className="inspection-note-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
          {notes.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="flex min-h-[126px] min-w-[84vw] snap-start items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:min-w-[360px] md:min-w-0 md:flex-1 md:p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber/15 text-amber"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-amber">NOTE 0{index + 1}</p>
                <h2 className="mt-1 font-display text-lg font-bold leading-tight">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-white/65">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
