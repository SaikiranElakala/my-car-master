"use client";

import { useState } from "react";

const bankLogo = (slug: string) => `https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks@main/assets/logos/${slug}/symbol.svg`;

type LenderPartner = { name: string; mark: string; type: string; logoUrl?: string; domain?: string; logoStyle?: "sbi" | "union" | "au" | "chola" | "hfl" };

const lenderPartners: LenderPartner[] = [
  { name: "State Bank of India", mark: "SBI", type: "Bank", logoStyle: "sbi", logoUrl: bankLogo("sbin") },
  { name: "Union Bank of India", mark: "UBI", type: "Bank", logoStyle: "union", logoUrl: bankLogo("ubin") },
  { name: "HDFC Bank", mark: "HDFC", type: "Bank", logoUrl: bankLogo("hdfc") },
  { name: "ICICI Bank", mark: "ICICI", type: "Bank", logoUrl: bankLogo("icic") },
  { name: "Axis Bank", mark: "AXIS", type: "Bank", logoUrl: bankLogo("utib") },
  { name: "IndusInd Bank", mark: "INDUS", type: "Bank", logoUrl: bankLogo("indb") },
  { name: "AU Small Finance Bank", mark: "AU", type: "Bank", logoStyle: "au", logoUrl: bankLogo("aubl") },
  { name: "IDFC FIRST Bank", mark: "IDFC", type: "Bank", logoUrl: bankLogo("idfb") },
  { name: "Sundaram Finance", mark: "SFL", type: "NBFC", domain: "sundaramfinance.in" },
  { name: "Cholamandalam Finance", mark: "CHOLA", type: "NBFC", logoStyle: "chola", logoUrl: "https://companieslogo.com/img/orig/CHOLAFIN.NS-ba13591e.png?download=true&t=1611166331" },
  { name: "Shriram Finance", mark: "SHRIRAM", type: "NBFC", domain: "shriramfinance.in" },
  { name: "TVS Credit", mark: "TVS", type: "NBFC", domain: "tvscredit.com" },
  { name: "L&T Finance", mark: "L&T", type: "NBFC", domain: "ltfs.com" },
  { name: "HFL", mark: "HFL", type: "Finance", logoStyle: "hfl", logoUrl: "https://www.hedgefinance.com/files/403%20-23-09-21-14-03.png" },
];

function FallbackLogo({ mark, style }: { mark: string; style?: LenderPartner["logoStyle"] }) {
  if (style === "sbi") return <svg aria-hidden="true" viewBox="0 0 48 48" className="h-full w-full"><circle cx="24" cy="24" r="22" fill="#2875b9"/><circle cx="24" cy="24" r="7" fill="white"/><rect x="21" y="25" width="6" height="13" fill="white"/><rect x="18" y="37" width="12" height="3" rx="1.5" fill="white"/><rect x="3" y="22.5" width="10" height="3" rx="1.5" fill="#fff"/><rect x="35" y="22.5" width="10" height="3" rx="1.5" fill="#fff"/></svg>;
  if (style === "union") return <svg aria-hidden="true" viewBox="0 0 48 48" className="h-full w-full"><circle cx="17" cy="24" r="14" fill="none" stroke="#e21d3b" strokeWidth="7"/><circle cx="31" cy="24" r="14" fill="none" stroke="#174b9b" strokeWidth="7"/></svg>;
  if (style === "au") return <svg aria-hidden="true" viewBox="0 0 48 48" className="h-full w-full"><circle cx="24" cy="24" r="22" fill="#f58220"/><text x="24" y="31" textAnchor="middle" fontSize="20" fontWeight="800" fill="white" fontFamily="Arial,sans-serif">AU</text></svg>;
  if (style === "chola") return <span aria-hidden="true" className="flex h-full w-full flex-col items-center justify-center leading-none text-[#0d6848]"><span className="text-[8px] font-black tracking-[.18em]">MURUGAPPA</span><span className="mt-1 text-[9px] font-black tracking-tight">CHOLA</span></span>;
  if (style === "hfl") return <span aria-hidden="true" className="grid h-full w-full place-items-center rounded-full bg-[#174d83] text-[11px] font-black tracking-tight text-white">HFL</span>;
  return <span aria-hidden="true" className="font-display text-center text-[10px] font-black leading-none tracking-tight text-rose-700">{mark}</span>;
}

function LenderCard({ name, mark, type, logoUrl, domain, logoStyle }: LenderPartner) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <li className="flex h-[76px] w-[190px] shrink-0 items-center gap-3 rounded-xl border border-line bg-paper px-3 shadow-sm">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white p-1.5">
        {logoUrl && !logoFailed ? (
          <img
            src={logoUrl}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={() => setLogoFailed(true)}
            className="h-full w-full object-contain"
          />
        ) : domain && !logoFailed ? (
          <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} alt="" aria-hidden="true" loading="lazy" onError={() => setLogoFailed(true)} className="h-full w-full object-contain" />
        ) : (
          <FallbackLogo mark={mark} style={logoStyle} />
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-ink">{name}</span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-deep">{type}</span>
      </span>
    </li>
  );
}

export function FinancePartnersTicker() {
  return (
    <section aria-labelledby="lender-network-title" className="overflow-hidden bg-bone py-12 md:py-16">
      <div className="container-x mb-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-amber">Bank and NBFC network</p>
          <h2 id="lender-network-title" className="display mt-2 text-3xl md:text-4xl">Finance partners</h2>
        </div>
        <p className="max-w-lg text-sm text-steel">Lender availability, eligibility, rates and approval are determined by each lender and may vary.</p>
      </div>
      <div className="overflow-hidden border-y border-rose-700/15 bg-white py-4">
        <div className="flex w-max animate-drift hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-3 pr-3">
              {lenderPartners.map((partner) => <LenderCard key={`${copy}-${partner.mark}`} {...partner} />)}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
