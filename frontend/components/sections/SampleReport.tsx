import { Button } from "@/components/ui/Button";
import { CarVisual } from "@/components/ui/CarVisual";

/** SAMPLE UI ONLY — fictional example data, clearly labelled. Not a real customer report. */
const scores = [
  { k: "Exterior", v: 9.1 }, { k: "Engine", v: 8.5 }, { k: "Interior", v: 8.8 }, { k: "Tyres", v: 8.3 },
];

export function SampleReportCard() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line bg-white shadow-lift">
      <div className="pointer-events-none absolute right-[-60px] top-6 rotate-12 border-y-2 border-amber px-24 py-1 font-mono text-xs font-bold uppercase tracking-[0.4em] text-amber/80">
        Sample report
      </div>
      <div className="flex items-center justify-between border-b border-line bg-ink px-6 py-4 text-white">
        <div>
          <p className="display text-xl">My Car <span className="text-amber">Master</span></p>
          <p className="eyebrow !text-white/50">Vehicle inspection report</p>
        </div>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[["Vehicle", "Example Vehicle"], ["Year", "2023"], ["Fuel", "Petrol"], ["Transmission", "Automatic"]].map(([k, v]) => (
              <div key={k}><dt className="eyebrow">{k}</dt><dd className="font-semibold">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-6 space-y-3">
            {scores.map((s) => (
              <div key={s.k}>
                <div className="flex justify-between text-sm"><span>{s.k}</span><span className="font-mono">{s.v.toFixed(1)}</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-bone"><div className="h-full rounded-full bg-amber" style={{ width: `${s.v * 10}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid place-items-center rounded-2xl bg-ink p-6 text-center text-white md:w-52">
          <p className="eyebrow !text-white/50">Overall condition</p>
          <p className="display text-7xl text-amber">8.7</p>
          <p className="font-mono text-xs text-white/60">/ 10</p>
        </div>
      </div>
      <div className="grid gap-4 border-t border-line p-6 md:grid-cols-3">
        <div className="rounded-xl bg-paper p-4"><p className="eyebrow">Findings</p><p className="mt-2 text-sm text-steel">Sample finding text appears here, graded Good / Attention / Critical.</p></div>
        <div className="rounded-xl bg-paper p-4"><p className="eyebrow">Photos</p><CarVisual className="mt-2 h-14 w-full" tone="light" /></div>
        <div className="rounded-xl bg-paper p-4"><p className="eyebrow">Recommendations</p><p className="mt-2 text-sm text-steel">Inspector recommendations are listed here.</p></div>
      </div>
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
          <p className="mt-6 max-w-md text-steel">This preview uses fictional sample data to show a possible layout. My Car Master must confirm the actual report format and what an inspection includes.</p>
          <Button href="/sample-report" className="mt-8">View sample report</Button>
        </div>
        <SampleReportCard />
      </div>
    </section>
  );
}
