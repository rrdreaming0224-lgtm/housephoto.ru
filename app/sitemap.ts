import type { MetadataRoute } from "next";
import { services } from "./_data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://housephoto.ru";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/proekty/prime-park`, changeFrequency: "monthly", priority: 0.8 },
    ...services.map((service) => ({ url: `${base}/uslugi/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.75 })),
  ];
}
