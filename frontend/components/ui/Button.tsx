import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "ghost" | "light";
const styles: Record<Variant, string> = {
  primary: "bg-amber text-white hover:bg-amber-deep",
  dark: "bg-ink text-paper hover:bg-graphite",
  ghost: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  light: "border border-white/30 text-white hover:bg-white hover:text-ink",
};

export function Button({
  href, children, variant = "primary", className, onClick, type, ...rest
}: {
  href?: string; children: React.ReactNode; variant?: Variant; className?: string;
  onClick?: () => void; type?: "button" | "submit"; "aria-label"?: string; disabled?: boolean;
}) {
  const cls = cn(
    "group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[.98] disabled:opacity-50",
    styles[variant], className
  );
  if (href) return <Link href={href} className={cls} onClick={onClick} aria-label={rest["aria-label"]}>{children}</Link>;
  return <button type={type ?? "button"} className={cls} onClick={onClick} disabled={rest.disabled} aria-label={rest["aria-label"]}>{children}</button>;
}
