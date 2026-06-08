import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuService } from "@/services/menuService";
import { api } from "@/services/api";

export const menuKeys = {
  all: ["menu"] as const,
  weekly: () => [...menuKeys.all, "weekly"] as const,
  today: () => [...menuKeys.all, "today"] as const,
  now: () => [...menuKeys.all, "now"] as const,
  date: (date: string) => [...menuKeys.all, "date", date] as const,
  network: () => [...menuKeys.all, "network-status"] as const,
  stats: (date: string, mealType: string) =>
    [...menuKeys.all, "stats", date, mealType] as const,
};

export function useWeeklyMenu() {
  return useQuery({
    queryKey: menuKeys.weekly(),
    queryFn: menuService.getWeeklyMenu,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 5,
    retryDelay: 2000,
  });
}

export function useTodayMenu() {
  return useQuery({
    queryKey: menuKeys.today(),
    queryFn: menuService.getTodayMenu,
    staleTime: 1000 * 60 * 5,
    retry: 5,
    retryDelay: 2000,
  });
}

export function useCurrentMeal() {
  return useQuery({
    queryKey: menuKeys.now(),
    queryFn: menuService.getCurrentMeal,
    staleTime: 1000 * 60 * 2,
    retry: 5,
    retryDelay: 2000,
  });
}

export function useMealStats(
  date: string,
  mealType: "desjejum" | "almoco" | "jantar",
) {
  return useQuery({
    queryKey: menuKeys.stats(date, mealType),
    queryFn: () => menuService.getMealStats(date, mealType),
    staleTime: 1000 * 60 * 2,
  });
}

export function useNetworkCheck() {
  return useQuery({
    queryKey: menuKeys.network(),
    queryFn: async () => {
      const response = await api.get<{ is_uefs_network: boolean }>(
        "/reviews/network-check",
      );
      return response.data;
    },
    retry: 2,
  });
}

export function useVoteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.voteMeal,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: menuKeys.stats(variables.dateStr, variables.mealType),
      });
    },
  });
}
