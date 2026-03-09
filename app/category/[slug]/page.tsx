import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryList, getCategoryBySlug } from "@/data/categories";
import { menuItems } from "@/data/menu";
import CategoryPageClient from "./CategoryPageClient";

export function generateStaticParams() {
  return categoryList.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { title: "Категория не найдена" };

  const items = menuItems.filter((i) => i.category === category.id);
  const minPrice = items.length > 0 ? Math.min(...items.map((i) => i.price)) : 0;

  return {
    title: `${category.nameFull} — заказать с доставкой в Люберцах | Суши Вкус`,
    description: `${category.description} Доставка по Люберцам от ${minPrice} ₽. Заказать онлайн на sushivkus.ru`,
    keywords: `${category.nameFull.toLowerCase()}, доставка ${category.nameFull.toLowerCase()} Люберцы, суши, Суши Вкус, заказать ${category.nameFull.toLowerCase()}`,
    alternates: {
      canonical: `/category/${params.slug}`,
    },
    openGraph: {
      title: `${category.nameFull} от ${minPrice} ₽ | Суши Вкус`,
      description: `${category.description} Доставка по Люберцам.`,
      type: "website",
      url: `https://sushivkus.ru/category/${params.slug}`,
      images: [category.image],
      siteName: "Суши Вкус",
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.nameFull} от ${minPrice} ₽ | Суши Вкус`,
      description: category.description,
      images: [category.image],
    },
  };
}

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const items = menuItems.filter((i) => i.category === category.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.nameFull,
    description: category.description,
    url: `https://sushivkus.ru/category/${params.slug}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: item.name,
        description: item.description,
        image: `https://sushivkus.ru${item.image}`,
        url: `https://sushivkus.ru/category/${params.slug}`,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "RUB",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Суши Вкус",
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryPageClient category={category} items={items} />
    </>
  );
}
