import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/app", "/checkout", "/order/"],
    },
    sitemap: "https://sushivkus.ru/sitemap.xml",
  };
}
