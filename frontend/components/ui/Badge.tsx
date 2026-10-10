import { cn } from "@/lib/cn";

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "accent" | "dark"; className?: string }) {
  const tones = {
    neutral: "border border-line bg-white/60 text-steel",
    accent: "bg-amber-soft text-amber-deep border border-amber/30",
    dark: "bg-white/10 text-white/80 border border-white/15",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
