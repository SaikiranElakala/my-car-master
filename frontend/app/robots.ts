import type { MetadataRoute } from "next";
import { client } from "@/config/client";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/inspector", "/api"] }],
    sitemap: `${client.siteUrl}/sitemap.xml`,
  };
}
