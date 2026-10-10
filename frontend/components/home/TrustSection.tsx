import { Reveal } from "@/components/ui/Reveal";

const values = [
  ["Share your vehicle", "Select a make and model, or enter them manually if they are not listed."],
  ["Choose a location", "Pick a listed city and enter your area so the team can check your request."],
  ["Request a date", "Send your preferred date and contact details for the team to follow up."],
];

export function TrustSection() {
  return (
    <section className="bg-ink py-24 text-white md:py-36">
      <div className="container-x">
        <h2 className="display text-[clamp(3.5rem,11vw,10rem)]">Start with a clear<br /><span className="text-amber">request.</span></h2>
        <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-white/10 md:grid-cols-3">
          {values.map(([t, d], i) => (
            <Reveal key={t} delay={i * 100} className="bg-ink p-8 md:p-10">
              <h3 className="display text-3xl md:text-4xl">{t}</h3>
              <p className="mt-4 text-white/60">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
