import { BackButton } from "@/components/ui/BackButton";

export function SimpleHeader({ title, lead, backHref, backgroundImage, backgroundOverlayClassName, backgroundPosition, backgroundSize, backgroundHeightClassName, titleClassName }: { title: string; lead?: string; backHref?: string; backgroundImage?: string; backgroundOverlayClassName?: string; backgroundPosition?: string; backgroundSize?: string; backgroundHeightClassName?: string; titleClassName?: string }) {
  return (
    <section
      className={`relative overflow-hidden bg-ink pb-14 pt-36 text-white md:pb-20 md:pt-44 ${backgroundImage ? backgroundHeightClassName ?? "flex min-h-[620px] items-center bg-cover bg-center md:min-h-[700px]" : ""}`}
      style={backgroundImage ? { backgroundImage: `url("${backgroundImage}")`, backgroundPosition, backgroundSize, backgroundRepeat: "no-repeat" } : undefined}
    >
      {backgroundImage && <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-r ${backgroundOverlayClassName ?? "from-ink/30 via-ink/10 to-transparent"}`} />}
      <div className="container-x relative z-10">
        {backHref && <BackButton href={backHref} className="text-white/70 hover:text-white" />}
        <h1 className={titleClassName ?? "display text-[clamp(3rem,9vw,7rem)]"}>{title}</h1>
        {lead && <p className="mt-5 max-w-xl text-lg text-white/70">{lead}</p>}
      </div>
    </section>
  );
}
export function LegalPage({ title, children, showDraftNote = true, backgroundImage, backgroundPosition, backgroundHeightClassName }: { title: string; children: React.ReactNode; showDraftNote?: boolean; backgroundImage?: string; backgroundPosition?: string; backgroundHeightClassName?: string }) {
  return (
    <>
      <SimpleHeader title={title} backgroundImage={backgroundImage} backgroundPosition={backgroundPosition} backgroundHeightClassName={backgroundHeightClassName} backgroundOverlayClassName="from-ink/75 via-ink/50 to-ink/15" />
      <section className="bg-paper px-5 py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-8 md:p-12">
          {showDraftNote && <p role="note" className="mb-8 rounded-xl border border-amber/40 bg-amber-soft p-4 text-sm leading-6">Draft for review. Confirm the business details and have the final wording reviewed and approved before launch.</p>}
          <div className="mx-auto max-w-3xl space-y-5 text-base leading-7 text-steel">{children}</div>
        </div>
      </section>
    </>
  );
}
