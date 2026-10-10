"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, ClipboardCheck, LifeBuoy } from "lucide-react";
import { client, phoneHref, whatsappHref } from "@/config/client";
import { track } from "@/lib/analytics";

/** Sticky mobile action bar. Roadside page gets CALL | WHATSAPP | REQUEST. */
export function MobileActionBar() {
  const path = usePathname();
  if (path.startsWith("/booking") || path.startsWith("/legal")) return null;
  const roadside = path.startsWith("/roadside-assistance");
  const base = "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold uppercase tracking-wider";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] text-white backdrop-blur md:hidden">
      <div className="flex">
        {client.phone && <a href={phoneHref()} onClick={() => track("call_click")} className={base}><Phone className="h-5 w-5" />Call</a>}
        {client.whatsappNumber && <a href={whatsappHref()} onClick={() => track("whatsapp_click")} className={base}><MessageCircle className="h-5 w-5" />WhatsApp</a>}
        {roadside ? (
          <Link href="#request" className={`${base} bg-amber text-white`}><LifeBuoy className="h-5 w-5" />Request</Link>
        ) : (
          <Link href="/booking" onClick={() => track("book_now_click")} className={`${base} bg-amber text-white`}><ClipboardCheck className="h-5 w-5" />Request</Link>
        )}
      </div>
    </div>
  );
}
