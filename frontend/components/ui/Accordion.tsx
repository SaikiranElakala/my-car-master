"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/types";

export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left text-lg font-medium"
              >
                {it.q}
                <Plus className={cn("h-5 w-5 shrink-0 text-amber transition-transform duration-300", isOpen && "rotate-45")} />
              </button>
            </h3>
            <div id={`faq-${i}`} role="region" className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]")}>
              <p className="overflow-hidden text-steel leading-relaxed">{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
