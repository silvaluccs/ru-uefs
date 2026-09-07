import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queueService } from "@/services/queueService";
import type { PeakHoursMeal, QueueLevel } from "@/types/queue";

export const queueKeys = {
  all: ["queue"] as const,
  status: () => [...queueKeys.all, "status"] as const,
  peakHours: (meal: PeakHoursMeal) => [...queueKeys.all, "peak-hours", meal] as const,
  trend: () => [...queueKeys.all, "trend"] as const,
};

export function useQueueStatus() {
  return useQuery({
    queryKey: queueKeys.status(),
    queryFn: queueService.getStatus,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
    retry: 2,
  });
}

export function useVoteQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: queueService.vote,
    onSuccess: (data) => {
      queryClient.setQueryData(queueKeys.status(), data);
    },
  });
}

export function usePeakHours(meal: PeakHoursMeal) {
  return useQuery({
    queryKey: queueKeys.peakHours(meal),
    queryFn: () => queueService.getPeakHours(meal),
    staleTime: 1000 * 60 * 5,
  });
}

export function useQueueTrend() {
  return useQuery({
    queryKey: queueKeys.trend(),
    queryFn: queueService.getTrend,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}

export type { QueueLevel };
