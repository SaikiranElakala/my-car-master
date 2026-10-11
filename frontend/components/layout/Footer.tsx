import Link from "next/link";
import { footerLinks } from "@/config/site";
import { client, formatContactPhone, phoneHref } from "@/config/client";
import { TermsAndConditionsDialog } from "@/components/legal/TermsAndConditionsDialog";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x py-16 md:py-24">
        <p className="display text-[clamp(3rem,11vw,9rem)] text-white/95">
          My Car <span className="text-amber">Master</span>
        </p>
        <div className="mt-14 grid gap-12 md:grid-cols-4">
          <div>
            <p className="eyebrow !text-white/50">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {client.phone && <li><a href={phoneHref(client.phone)} className="transition-colors hover:text-amber">{formatContactPhone(client.phone)}</a></li>}
              {client.secondaryPhone && <li><a href={phoneHref(client.secondaryPhone)} className="transition-colors hover:text-amber">{formatContactPhone(client.secondaryPhone)}</a></li>}
              {client.additionalPhone && <li><a href={phoneHref(client.additionalPhone)} className="transition-colors hover:text-amber">{formatContactPhone(client.additionalPhone)}</a></li>}
              {client.email && <li><a href={`mailto:${client.email}`} className="transition-colors hover:text-amber">{client.email}</a></li>}
              {client.address && <li>{client.address}</li>}
              {client.businessHours && <li>{client.businessHours}</li>}
              {!client.phone && !client.secondaryPhone && !client.email && <li><Link href="/contact#contact-form" className="text-white/80 transition-colors hover:text-amber">Send us a message</Link></li>}
            </ul>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="eyebrow !text-white/50">{title}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {links.map((l) => (
                  <li key={l.href}>{l.href === "/legal/terms" ? <TermsAndConditionsDialog label={l.label} className="text-white/80 transition-colors hover:text-amber" /> : <Link href={l.href} className="text-white/80 transition-colors hover:text-amber">{l.label}</Link>}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} My Car Master · {client.domain}</p>
          <p>Inspections are limited to the agreed scope and are not a warranty against all defects.</p>
        </div>
      </div>
    </footer>
  );
}
