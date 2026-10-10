import type { ServiceInfo } from "@/types";

/** Service/pricing repository. Add prices only after the client confirms them. */

const services: ServiceInfo[] = [
  { slug: "used-car-evaluation", name: "Used Car Evaluation", startingPricePaise: null, bookable: true },
  { slug: "new-car-pdi", name: "New Car PDI", startingPricePaise: null, bookable: true },
  { slug: "roadside-assistance", name: "Roadside Assistance", startingPricePaise: null, bookable: false },
  { slug: "used-car-finance", name: "Used Car Finance", startingPricePaise: null, bookable: false },
  { slug: "car-insurance", name: "Car Insurance", startingPricePaise: null, bookable: false },
];

export function getServices(): ServiceInfo[] {
  return services;
}
export function getService(slug: string): ServiceInfo {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service ${slug}`);
  return s;
}
export function formatPrice(paise: number | null): string {
  if (paise === null) return "On enquiry";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
