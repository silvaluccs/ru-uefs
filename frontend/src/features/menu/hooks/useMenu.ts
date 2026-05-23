import { useQuery } from "@tanstack/react-query";
import { menuService } from "@/services/menuService";

export const menuKeys = {
  all: ["menu"] as const,
  weekly: () => [...menuKeys.all, "weekly"] as const,
  today: () => [...menuKeys.all, "today"] as const,
  now: () => [...menuKeys.all, "now"] as const,
  date: (date: string) => [...menuKeys.all, "date", date] as const,
};

export function useWeeklyMenu() {
  return useQuery({
    queryKey: menuKeys.weekly(),
    queryFn: menuService.getWeeklyMenu,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

export function useTodayMenu() {
  return useQuery({
    queryKey: menuKeys.today(),
    queryFn: menuService.getTodayMenu,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCurrentMeal() {
  return useQuery({
    queryKey: menuKeys.now(),
    queryFn: menuService.getCurrentMeal,
    staleTime: 1000 * 60 * 2,
  });
}
