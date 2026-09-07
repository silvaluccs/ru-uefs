import type { MealSection } from "./adaptMealData";

export interface FlatMealItem {
  key: string;
  category: string;
  name: string;
  isVeg: boolean;
}

function slug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function flattenMealItems(sections: MealSection[]): FlatMealItem[] {
  return sections.flatMap((section) =>
    section.items.map((name, itemIdx) => ({
      key: `${slug(section.title)}-${itemIdx}`,
      category: section.title,
      name,
      isVeg: section.title.toLowerCase().includes("vegetariana"),
    })),
  );
}
