import { MetadataRoute } from "next";
import { categoryList } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sushivkus.ru"; // ← сайтыңдын домени

  // Категория беттери
  const categoryPages = categoryList.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const seoPages = [
    "dostavka-sushi-lyubertsy",
    "rolly-lyubertsy",
    "sety-lyubertsy",
    "yaponskaya-kuhnya-lyubertsy",
    "dostavka-lyubertsy",
    "dostavka-nekrasovka",
    "dostavka-zhulebino",
    "akcii",
  ].map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryPages,
    ...seoPages,
  ];
}
