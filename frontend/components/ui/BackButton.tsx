"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackButton({ className, href }: { className?: string; href?: string }) {
  const router = useRouter();
  const classes = `mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium transition ${className ?? "text-steel hover:text-ink"}`;
  const content = <><ArrowLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" /> Back</>;
  return href ? (
    <Link href={href} className={classes}>{content}</Link>
  ) : (
    <button type="button" onClick={() => { if (window.history.length > 1) router.back(); else router.push("/"); }} className={classes}>
      {content}
    </button>
  );
}
