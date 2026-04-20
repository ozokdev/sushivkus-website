import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api", "/api/*", "/checkout", "/order/*"],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api", "/api/*", "/checkout", "/order/*"],
        crawlDelay: 0.5,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api", "/api/*", "/checkout", "/order/*"],
      },
    ],
    sitemap: "https://sushivkus.ru/sitemap.xml",
    host: "https://sushivkus.ru",
  };
}
