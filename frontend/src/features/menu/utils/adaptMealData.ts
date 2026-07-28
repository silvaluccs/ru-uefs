import type { RefeicaoDia } from "@/types/menu";

export interface MealSection {
  title: string;
  items: string[];
}

export function adaptMealData(
  mealData: RefeicaoDia,
  type: "desjejum" | "almoco" | "jantar"
): MealSection[] {

  if (!mealData) return [];

  const cleanList = (items: any): string[] => {
    if (!items) return [];
    if (Array.isArray(items)) return items.filter(Boolean);
    return [items].filter(Boolean);
  };

  if (type === "desjejum" && mealData.desjejum) {
    const d = mealData.desjejum;
    return [
      { title: "Pães / Carboidratos", items: cleanList(d.pao) },
      { title: "Proteína", items: cleanList(d.proteina) },
      { title: "Raiz ou Farináceo", items: cleanList(d.raiz_ou_farinaceio) },
      {
        title: "Opção Ovolactovegetariana",
        items: cleanList(d.ovolactovegetariano),
      },
      { title: "Fruta", items: cleanList(d.fruta) },
      { title: "Bebidas", items: d.bebida || [] },
    ].filter((section) => section.items.length > 0);
  }

  if (type === "almoco" && mealData.almoco) {
    const a = mealData.almoco;
    return [
      {
        title: "Prato Principal",
        items: cleanList([a.proteina, a.opcao_proteina]),
      },
      {
        title: "Acompanhamentos",
        items: cleanList([a.acompanhamento_I, a.acompanhamento_II]),
      },
      { title: "Guarnição", items: cleanList(a.guarnicao) },
      { title: "Saladas", items: cleanList([a.salada_crua, a.salada_cozida]) },
      {
        title: "Opção Ovolactovegetariana",
        items: a.ovolactovegetariano || [],
      },
      { title: "Sobremesa", items: cleanList(a.fruta) },
      { title: "Suco", items: cleanList(a.suco) },
    ].filter((section) => section.items.length > 0);
  }

  if (type === "jantar" && mealData.jantar) {
    const j = mealData.jantar;
    return [
      { title: "Prato Principal / Proteína", items: cleanList(j.proteina) },
      { title: "Sopa", items: cleanList(j.sopa) },
      { title: "Raiz ou Farináceo", items: cleanList(j.raiz_ou_farinaceio) },
      { title: "Acompanhamentos", items: cleanList(j.pao) },
      {
        title: "Opção Ovolactovegetariana",
        items: j.ovolactovegetariano || [],
      },
      { title: "Bebidas", items: j.bebida || [] },
    ].filter((section) => section.items.length > 0);
  }

  return [];
}
