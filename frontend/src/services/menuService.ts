import { api } from "@/services/api";
import type {
  DailyMenu,
  WeeklyMenuResponse,
  CurrentMealResponse,
  RestaurantStatus,
} from "@/types/menu";

export interface ItemStats {
  item_key: string;
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
   * Obtém as estatísticas de avaliação de todos os pratos de uma refeição
   */
  getItemStats: async (
    date: string,
    mealType: string,
  ): Promise<ItemStats[]> => {
    const { data } = await api.get<ItemStats[]>(
      `/reviews/items/stats/${date}/${mealType}`,
    );
    return data;
  },

  /**
   * Envia a avaliação de um prato específico
   */
  voteItem: async ({
    dateStr,
    mealType,
    itemKey,
    voteType,
  }: {
    dateStr: string;
    mealType: "desjejum" | "almoco" | "jantar";
    itemKey: string;
    voteType: "like" | "dislike";
  }): Promise<ItemStats> => {
    const { data } = await api.post<ItemStats>("/reviews/items/evaluate", {
      date: dateStr,
      meal_type: mealType,
      item_key: itemKey,
      vote: voteType,
    });
    return data;
  },
};
