import { api } from "@/services/api";
import type {
  DailyMenu,
  WeeklyMenuResponse,
  CurrentMealResponse,
  RestaurantStatus,
} from "@/types/menu";

export interface EvaluationStats {
  likes: number;
  dislikes: number;
  percentage_likes: number;
}
export const menuService = {

  /**
   * Obtém o status atual de funcionamento do restaurante
   */
  getRestaurantStatus: async (): Promise<RestaurantStatus> => {
    const { data } = await api.get<RestaurantStatus>("/menu/status");
    return data;
  },

  /**
   * Obtém o cardápio da semana inteira
   */
  getWeeklyMenu: async (): Promise<WeeklyMenuResponse> => {
    const { data } = await api.get<WeeklyMenuResponse>("/menu/week");
    return data;
  },

  /**
   * Obtém o cardápio do dia atual
   */
  getTodayMenu: async (): Promise<DailyMenu> => {
    const { data } = await api.get<DailyMenu>("/menu/today");
    return data;
  },

  /**
   * Obtém a refeição que está acontecendo agora (ex: Almoço atual)
   */
  getCurrentMeal: async (): Promise<CurrentMealResponse> => {
    const { data } = await api.get<CurrentMealResponse>("/menu/now");
    return data;
  },

  /**
   * Obtém o cardápio de uma data específica (Formato: DD-MM-YYYY)
   */
  getMenuByDate: async (date: string): Promise<DailyMenu> => {
    const { data } = await api.get<DailyMenu>(`/menu/${date}`);
    return data;
  },

  /**
   * Obtém as estatísticas de votação de uma refeição específica
   */
  getMealStats: async (
    date: string,
    mealType: string,
  ): Promise<EvaluationStats> => {
    const { data } = await api.get<EvaluationStats>(
      `/reviews/stats/${date}/${mealType}`,
    );
    return data;
  },

  /**
   * Envia a avaliação da refeição para o servidor
   */
  voteMeal: async ({
    dateStr,
    mealType,
    voteType,
  }: {
    dateStr: string;
    mealType: "desjejum" | "almoco" | "jantar";
    voteType: "like" | "dislike";
  }): Promise<void> => {
    await api.post("/reviews/evaluate", {
      date: dateStr,
      meal_type: mealType,
      vote: voteType,
    });
  },
};
