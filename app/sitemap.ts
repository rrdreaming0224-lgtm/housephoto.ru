import type { MetadataRoute } from "next";
import { services } from "./_data/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://housephoto.ru";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...services.map((service) => ({ url: `${base}/uslugi/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.75 })),
  ];
}
