import { Reveal } from "@/components/ui/Reveal";

type WorkStep = readonly [string, string, string];

const defaultSteps: WorkStep[] = [
  ["01", "Select vehicle", "Choose a listed make and model or enter yours manually."],
  ["02", "Send a request", "Share your contact details, location and preferred date."],
  ["03", "Team follows up", "The team contacts you about your request."],
  ["04", "Confirm details", "Agree on availability and inspection arrangements with the team."],
];

export function HowItWorks({ dark = false, steps = defaultSteps }: { dark?: boolean; steps?: readonly WorkStep[] }) {
  return (
    <section className={dark ? "bg-ink py-20 text-white md:py-32" : "py-20 md:py-32"}>
      <div className="container-x">
        <p className="eyebrow">How it works</p>
        <h2 className="display mt-3 text-5xl md:text-7xl">A clear request.<br />Four steps.</h2>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-amber/40 md:left-0 md:top-[19px] md:h-px md:w-full" />
          {steps.map(([n, t, d], i) => (
            <li key={n} className="relative pl-14 md:pl-0 md:pt-14">
              <Reveal delay={i * 120}>
                <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-amber font-mono text-sm font-bold text-white">{n}</span>
                <h3 className="display text-2xl">{t}</h3>
                <p className={dark ? "mt-2 text-white/60" : "mt-2 text-steel"}>{d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
