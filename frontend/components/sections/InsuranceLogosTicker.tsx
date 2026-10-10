"use client";

const insurers = [
  { name: "HDFC ERGO", domain: "hdfcergo.com", fallback: "HE", color: "#e51b3e" },
  { name: "ICICI Lombard", domain: "icicilombard.com", fallback: "IL", color: "#d11939" },
  { name: "Bajaj General", domain: "bajajgeneralinsurance.com", fallback: "BAJAJ", color: "#075ca8" },
  { name: "Tata AIG", domain: "tataaig.com", fallback: "TATA AIG", color: "#08759b" },
  { name: "New India Assurance", domain: "newindia.co.in", fallback: "NIA", color: "#244e9a" },
  { name: "National Insurance", domain: "nationalinsurance.nic.co.in", logoSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/National_Insurance_Company.svg?width=128", fallback: "NATIONAL\nINSURANCE", color: "#08784c" },
  { name: "Oriental Insurance", domain: "orientalinsurance.org.in", fallback: "OIC", color: "#672b83" },
  { name: "United India Insurance", domain: "uiic.in", logoSrc: "https://uiic.in/ohs_images/images/uiic-logo.gif", fallback: "UNITED\nINDIA", color: "#d29a00" },
  { name: "SBI General", domain: "sbigeneral.in", logoSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/SBI-logo.svg?width=128", fallback: "SBI\nGENERAL", color: "#2676b9" },
  { name: "Reliance General", domain: "reliancegeneral.co.in", fallback: "RG", color: "#075c9f" },
  { name: "IFFCO Tokio", domain: "iffcotokio.co.in", fallback: "IT", color: "#258b48" },
  { name: "Royal Sundaram", domain: "royalsundaram.in", fallback: "RS", color: "#173e7a" },
  { name: "Chola MS", domain: "cholainsurance.com", fallback: "CHOLA", color: "#0d6848" },
  { name: "Shriram General", domain: "shriramgi.com", fallback: "SHRIRAM", color: "#e42b35" },
  { name: "Liberty General", domain: "libertyinsurance.in", fallback: "LIBERTY", color: "#49375d" },
  { name: "Future Generali", domain: "generalicentralinsurance.com", fallback: "FUTURE\nGENERALI", color: "#672c91" },
];

function InsurerCard({ name, domain, logoSrc, fallback, color }: (typeof insurers)[number]) {
  return (
    <li className="flex h-[76px] w-[238px] shrink-0 items-center gap-3 rounded-xl border border-line bg-paper px-3 shadow-sm">
      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-1.5" aria-hidden="true">
        <img
          src={logoSrc ?? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
          alt=""
          width="40"
          height="40"
          loading="eager"
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            const fallbackMark = event.currentTarget.nextElementSibling;
            if (fallbackMark instanceof HTMLElement) fallbackMark.style.display = "grid";
          }}
        />
        <span className="hidden h-full w-full whitespace-pre-line place-items-center text-center font-display text-[9px] font-black leading-tight tracking-tight" style={{ color }}>{fallback}</span>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-ink">{name}</span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-deep">Insurance</span>
      </span>
    </li>
  );
}

export function InsuranceLogosTicker() {
  return (
    <section aria-label="Insurance company logos" className="overflow-hidden border-y border-rose-700/15 bg-white py-4">
      <div className="flex w-max animate-drift hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-3 pr-3">
            {insurers.map((insurer) => <InsurerCard key={`${copy}-${insurer.name}`} {...insurer} />)}
          </ul>
        ))}
      </div>
    </section>
  );
}
