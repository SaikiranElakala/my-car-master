import type { MetadataRoute } from "next";
import { client } from "@/config/client";

const routes = [
  "", "/used-car-evaluation", "/new-car-pdi", "/roadside-assistance", "/used-car-finance", "/car-insurance", "/vehicle-diagnostics", "/rto-services",
  "/inspection-type", "/about", "/contact", "/locations", "/sample-report",
  "/legal/privacy-policy", "/legal/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: `${client.siteUrl}${r}`, lastModified: new Date() }));
}
