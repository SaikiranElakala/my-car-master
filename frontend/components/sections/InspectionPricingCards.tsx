import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";

type PriceCard = { segment: string; price: number };

const cardStyle = {
  border: "border-rose-600/70",
  badge: "bg-rose-700/25 text-rose-200",
  price: "text-rose-300",
  button: "bg-rose-700 text-white hover:bg-rose-600",
};

export function InspectionPricingCards({
  title,
  description,
  prices,
  bookingHref,
  showBackButton = false,
  backHref,
}: {
  title: string;
  description: string;
  prices: PriceCard[];
  bookingHref: string;
  showBackButton?: boolean;
  backHref?: string;
}) {
  return (
    <section id="pricing" className="scroll-mt-28 py-20 md:py-28">
      <div className="container-x">
        <div className="rounded-[32px] bg-ink p-8 text-white md:p-14">
          {showBackButton && <BackButton href={backHref} className="text-white/60 hover:text-white" />}
          <h2 className="display text-4xl md:text-6xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-white/65">Choose your vehicle segment to see the price and service details.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prices.map(({ segment, price }) => (
              <article key={segment} className={`flex min-h-[340px] flex-col items-start rounded-2xl border ${cardStyle.border} bg-[#2d2d2d] p-6 transition-colors hover:bg-[#323232] md:p-8`}>
                <span className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${cardStyle.badge}`}>{segment}</span>
                <p className={`display mt-6 text-5xl md:text-6xl ${cardStyle.price}`}>₹{price.toLocaleString("en-IN")}/-</p>
                <p className="mt-5 text-sm leading-6 text-white/75">{description}</p>
                <Link href={bookingHref} className={`mt-auto inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-bold transition ${cardStyle.button}`}>Book request</Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
