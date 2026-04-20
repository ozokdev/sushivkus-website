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
    image: "/photo/cat_rolls.jpg",
    description:
      "Свежие роллы с доставкой в Люберцах. Филадельфия, Калифорния, запечённые и классические роллы от Аригато Суши.",
  },
  {
    id: "sets",
    slug: "sets",
    name: "СЕТЫ",
    nameFull: "Сеты",
    image: "/photo/cat_sets.jpg",
    description:
      "Выгодные сеты роллов с доставкой. От 16 до 64 штук — для двоих, компании или корпоратива.",
  },
  {
    id: "pizza",
    slug: "pizza",
    name: "ПИЦЦА",
    nameFull: "Пицца",
    image: "/photo/cat_pizza.jpg",
    description:
      "Горячая пицца с доставкой в Люберцах. Пепперони, Маргарита, Четыре сыра и другие вкусы.",
  },
  {
    id: "poke",
    slug: "poke",
    name: "ПОКЕ",
    nameFull: "Поке",
    image: "/photo/cat_poke.jpg",
    description:
      "Свежие поке-боулы с лососем, тунцом, креветками и угрём. Здоровая еда с доставкой.",
  },
  {
    id: "soups",
    slug: "soups",
    name: "СУПЫ",
    nameFull: "Супы",
    image: "/photo/cat_soups.jpg",
    description:
      "Том Ям и Мисо супы с доставкой. Горячие супы азиатской кухни от Аригато Суши.",
  },
  {
    id: "snacks",
    slug: "snacks",
    name: "ЗАКУСКИ",
    nameFull: "Закуски",
    image: "/photo/cat_snacks.jpg",
    description:
      "Закуски к суши: темпура, наггетсы, картошка фри, сырные палочки с доставкой.",
  },
  {
    id: "salads",
    slug: "salads",
    name: "САЛАТЫ",
    nameFull: "Салаты",
    image: "/photo/cat_salads.jpg",
    description:
      "Свежие салаты: Цезарь и Чука с доставкой в Люберцах от Аригато Суши.",
  },
  {
    id: "sauces",
    slug: "sauces",
    name: "СОУСЫ",
    nameFull: "Соусы и добавки",
    image: "/photo/cat_sauces.jpg",
    description:
      "Соусы к суши и роллам: соевый, ореховый, спайси, кисло-сладкий, васаби.",
  },
  {
    id: "wok",
    slug: "wok",
    name: "ВОК",
    nameFull: "Вок",
    image: "/photo/cat_wok.jpg",
    description:
      "Вок с лапшой и рисом. Курица, говядина, морепродукты — горячий вок с доставкой.",
  },
  {
    id: "napitki",
    slug: "napitki",
    name: "НАПИТКИ",
    nameFull: "Напитки",
    image: "/photo/cat_napitki.jpg",
    description:
      "Освежающие напитки к вашему заказу: лимонады, соки, вода, чай.",
  },
  {
    id: "novinki",
    slug: "novinki",
    name: "НОВИНКИ",
    nameFull: "Новинки",
    image: "/photo/cat_novinki.jpg",
    description:
      "Новые позиции каждые 3 месяца. Попробуйте наши новинки!",
  },
  {
    id: "desert",
    slug: "desert",
    name: "ДЕСЕРТЫ",
    nameFull: "Десерты",
    image: "/photo/cat_desert.jpg",
    description:
      "Сладкие десерты: чизкейки, моти, японские сладости с доставкой.",
  },
  {
    id: "sashami",
    slug: "sashami",
    name: "САШИМИ",
    nameFull: "Сашими",
    image: "/photo/cat_sashami.jpg",
    description:
      "Свежие сашими из лосося, тунца и других морепродуктов.",
  },
  {
    id: "zapecheni_midii",
    slug: "zapecheni-midii",
    name: "МИДИИ",
    nameFull: "Запеченные мидии",
    image: "/photo/cat_midii.jpg",
    description:
      "Запечённые мидии под сырным и спайси соусом с доставкой.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categoryList.find((c) => c.slug === slug);
}
