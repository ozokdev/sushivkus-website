import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryList, getCategoryBySlug } from "@/data/categories";
import { menuItems } from "@/data/menu";
import CategoryPageClient from "./CategoryPageClient";

// Генерируем статические пути для всех категорий
export function generateStaticParams() {
  return categoryList.map((cat) => ({ slug: cat.slug }));
}

// Динамические мета-теги для SEO
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
    title: `${category.nameFull} — заказать с доставкой | KELECHEK SUSHI`,
    description: category.description,
    keywords: `${category.nameFull.toLowerCase()}, доставка, Люберцы, суши, KELECHEK`,
    openGraph: {
      title: `${category.nameFull} от ${minPrice} ₽ | KELECHEK SUSHI`,
      description: category.description,
      type: "website",
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

  return <CategoryPageClient category={category} items={items} />;
}
