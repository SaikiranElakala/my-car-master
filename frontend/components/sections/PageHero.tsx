import { CarVisual } from "@/components/ui/CarVisual";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

export function PageHero({
  eyebrow, title, accent, lead, price, ctaLabel, ctaHref, secondary, urgent, backgroundImage, backgroundTone = "light", showBackButton = false, backHref = "/", liftContent = false, compact = false,
}: {
  eyebrow: string; title: string; accent?: string; lead: string; price?: string;
  ctaLabel: string; ctaHref: string; secondary?: { label: string; href: string }; urgent?: boolean; backgroundImage?: string; backgroundTone?: "light" | "dark"; showBackButton?: boolean; backHref?: string; liftContent?: boolean; compact?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden ${compact ? "pb-12 pt-28 md:pb-16 md:pt-32" : "pb-16 pt-36 md:pb-24 md:pt-44"} ${backgroundImage ? `flex ${compact ? "min-h-[620px] md:min-h-[680px]" : "min-h-[calc(100svh-6rem)]"} items-center bg-cover bg-center ${backgroundTone === "dark" ? "text-white" : "text-ink"}` : "bg-ink text-white"}`}
      style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined}
    >
      {!backgroundImage && <div aria-hidden className={`absolute -right-40 top-10 h-[520px] w-[520px] rounded-full blur-3xl ${urgent ? "bg-amber/25" : "bg-amber/10"}`} />}
      {backgroundImage && <div aria-hidden="true" className={`absolute inset-0 ${backgroundTone === "dark" ? "bg-gradient-to-r from-black/25 via-black/5 to-black/0" : "bg-gradient-to-r from-white/65 via-white/25 to-white/0"}`} />}
      <div className={`container-x relative ${liftContent ? "-translate-y-4 md:-translate-y-8" : ""}`}>
        {showBackButton && <div className="mb-5"><BackButton href={backHref} className={`!mb-0 ${backgroundImage && backgroundTone !== "dark" ? "text-steel hover:text-ink" : "text-white/70 hover:text-white"}`} /></div>}
        <Badge tone={backgroundImage ? (backgroundTone === "dark" ? "dark" : "neutral") : "dark"}>{eyebrow}</Badge>
        <h1 className={`display mt-5 max-w-4xl ${backgroundTone === "dark" ? "text-[clamp(3rem,6vw,6.25rem)]" : "text-[clamp(3rem,9vw,7.5rem)]"}`}>
          {title} {accent && <span className="text-amber">{accent}</span>}
        </h1>
        <p className={`mt-6 max-w-xl text-lg ${backgroundImage ? (backgroundTone === "dark" ? "text-white/80" : "text-ink/75") : "text-white/70"}`}>{lead}</p>
        {price && <p className="mt-6 font-mono text-sm uppercase tracking-widest text-amber">Starting from {price}</p>}
        <div className={`${backgroundTone === "dark" ? "mt-6" : "mt-8"} flex flex-col gap-3 sm:flex-row`}>
          <Button href={ctaHref}>{ctaLabel}</Button>
          {secondary && <Button href={secondary.href} variant={backgroundImage && backgroundTone !== "dark" ? "ghost" : "light"}>{secondary.label}</Button>}
        </div>
        {!backgroundImage && <CarVisual className="mt-12 w-full max-w-4xl opacity-90" />}
      </div>
    </section>
  );
}
