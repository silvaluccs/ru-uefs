export interface RefeicaoDia {
  desjejum: {
    bebida: string[];
    pao: string;
    proteina: string;
    raiz_ou_farinaceio: string;
    fruta: string;
    ovolactovegetariano: string;
  };
  almoco: {
    acompanhamento_I: string;
    acompanhamento_II: string;
    guarnicao: string;
    salada_cozida: string;
    salada_crua: string;
    proteina: string;
    opcao_proteina: string;
    fruta: string;
    ovolactovegetariano: string[];
    suco: string;
  };
  jantar: {
    bebida: string[];
    pao: string;
    proteina: string;
    raiz_ou_farinaceio: string;
    sopa: string;
    ovolactovegetariano: string[];
  };
}

export interface DailyMenu {
  dia: string; // Substitui 'dayOfWeek'
  data: string; // Substitui 'date'
  refeicoes: RefeicaoDia[];
  created_at?: string;
}

export interface WeeklyMenuResponse {
  data_inicio: string;
  data_fim: string;
  cardapio: DailyMenu[];
  created_at?: string;
}

export type MealType = "breakfast" | "lunch" | "dinner";

export interface CurrentMealResponse {
  mealType: MealType;
  isActive: boolean;
}

export interface RestaurantStatus {
  isOpen: boolean;
  isLastServed: boolean;
  defaultMeal: MealType | string;
  badgeText: string;
}
