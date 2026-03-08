import type { Category } from "./menu";

export interface CategoryInfo {
  id: Category;
  slug: string;
  name: string;
  nameFull: string;
  image: string;
  description: string;
}

export const categoryList: CategoryInfo[] = [
  {
    id: "rolls",
    slug: "rolls",
    name: "РОЛЛЫ",
    nameFull: "Роллы",
    image: "/photo/california_tempura.jpg",
    description:
      "Свежие роллы с доставкой в Люберцах. Филадельфия, Калифорния, запечённые и классические роллы от Суши Вкус.",
  },
  {
    id: "sets",
    slug: "sets",
    name: "СЕТЫ",
    nameFull: "Сеты",
    image: "/photo/set_all_inclusive.jpg",
    description:
      "Выгодные сеты роллов с доставкой. От 16 до 64 штук — для двоих, компании или корпоратива.",
  },
  {
    id: "pizza",
    slug: "pizza",
    name: "ПИЦЦА",
    nameFull: "Пицца",
    image: "/photo/pepperoni.jpg",
    description:
      "Горячая пицца с доставкой в Люберцах. Пепперони, Маргарита, Четыре сыра и другие вкусы.",
  },
  {
    id: "poke",
    slug: "poke",
    name: "ПОКЕ",
    nameFull: "Поке",
    image: "/photo/poke_salmon.jpg",
    description:
      "Свежие поке-боулы с лососем, тунцом, креветками и угрём. Здоровая еда с доставкой.",
  },
  {
    id: "soups",
    slug: "soups",
    name: "СУПЫ",
    nameFull: "Супы",
    image: "/photo/tom_yam_shrimp.jpg",
    description:
      "Том Ям и Мисо супы с доставкой. Горячие супы азиатской кухни от Суши Вкус.",
  },
  {
    id: "snacks",
    slug: "snacks",
    name: "ЗАКУСКИ",
    nameFull: "Закуски",
    image: "/photo/krevetki_tempura.jpg",
    description:
      "Закуски к суши: темпура, наггетсы, картошка фри, сырные палочки с доставкой.",
  },
  {
    id: "salads",
    slug: "salads",
    name: "САЛАТЫ",
    nameFull: "Салаты",
    image: "/photo/salat_caesar.jpg",
    description:
      "Свежие салаты: Цезарь и Чука с доставкой в Люберцах от Суши Вкус.",
  },
  {
    id: "sauces",
    slug: "sauces",
    name: "СОУСЫ",
    nameFull: "Соусы",
    image: "/photo/orehovyy_sous.jpg",
    description:
      "Соусы к суши и роллам: соевый, ореховый, спайси, кисло-сладкий, васаби.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categoryList.find((c) => c.slug === slug);
}
