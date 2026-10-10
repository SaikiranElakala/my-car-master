"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";

export function PrivacyPolicyDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline font-semibold text-amber underline">Privacy Policy</button>
      {open && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="privacy-policy-title" className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-t-4 border-amber bg-white text-ink shadow-2xl">
            <header className="flex items-center justify-between gap-4 border-b border-line p-5 md:p-7">
              <div><p className="eyebrow text-amber">My Car Master</p><h2 id="privacy-policy-title" className="display mt-1 text-3xl md:text-4xl">Privacy Policy</h2></div>
              <button type="button" autoFocus onClick={() => setOpen(false)} aria-label="Close Privacy Policy" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-steel transition hover:bg-bone hover:text-ink"><X className="h-6 w-6" /></button>
            </header>
            <div className="overflow-y-auto p-5 md:p-7"><PrivacyPolicyContent /></div>
          </section>
        </div>
      )}
    </>
  );
}
