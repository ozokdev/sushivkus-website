import { MetadataRoute } from "next";
import { categoryList } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sushivkus.ru";
  const lastModified = new Date();

  const categoryPages = categoryList.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const seoPages = [
    { slug: "dostavka-sushi-lyubertsy", priority: 0.95 },
    { slug: "rolly-lyubertsy", priority: 0.9 },
    { slug: "sety-lyubertsy", priority: 0.85 },
    { slug: "yaponskaya-kuhnya-lyubertsy", priority: 0.85 },
    { slug: "dostavka-lyubertsy", priority: 0.85 },
    { slug: "dostavka-nekrasovka", priority: 0.8 },
    { slug: "dostavka-zhulebino", priority: 0.8 },
    { slug: "akcii", priority: 0.7 },
  ].map(({ slug, priority }) => ({
    url: `${baseUrl}/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...seoPages,
    ...categoryPages,
  ];
}
