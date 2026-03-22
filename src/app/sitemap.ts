import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/sanity/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bolo-bolo.pt";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const productUrls = products.map((p: { slug: string }) => ({
    url: `${siteUrl}/produtos/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/produtos`, changeFrequency: "weekly", priority: 0.9 },
    ...productUrls,
    { url: `${siteUrl}/sobre`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/galeria`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/entrega`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contacto`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
