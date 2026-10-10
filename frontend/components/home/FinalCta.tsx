import { Button } from "@/components/ui/Button";
import { client, phoneHref, whatsappHref } from "@/config/client";

export function FinalCta({ title = "Ready when you are." }: { title?: string }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="rounded-[36px] bg-amber p-8 text-white md:p-16">
          <h2 className="display text-[clamp(3rem,9vw,8rem)]">{title}</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/booking?service=used-car-inspection" variant="dark">Request Used Car Evaluation</Button>
            <Button href="/new-car-pdi" variant="dark">Explore New Car PDI</Button>
            {client.whatsappNumber && <Button href={whatsappHref()} variant="ghost" className="!border-ink/40">WhatsApp</Button>}
            {client.phone && <Button href={phoneHref()} variant="ghost" className="!border-ink/40">Call</Button>}
            {!client.whatsappNumber && !client.phone && <Button href="/contact#contact-form" variant="ghost" className="!border-ink/40">Contact the team</Button>}
          </div>
        </div>
      </div>
    </section>
  );
}
