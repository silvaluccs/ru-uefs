import { api } from "@/services/api";
import type {
  DailyMenu,
  WeeklyMenuResponse,
  CurrentMealResponse,
} from "@/types/menu";

export const menuService = {
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
};
