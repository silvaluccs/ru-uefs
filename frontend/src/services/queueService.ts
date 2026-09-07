import { api } from "@/services/api";
import type {
  PeakHourSlot,
  PeakHoursMeal,
  QueueLevel,
  QueueStatusResponse,
  TrendResponse,
} from "@/types/queue";

export const queueService = {
  getStatus: async (): Promise<QueueStatusResponse> => {
    const { data } = await api.get<QueueStatusResponse>("/queue/status");
    return data;
  },

  vote: async (level: QueueLevel): Promise<QueueStatusResponse> => {
    const { data } = await api.post<QueueStatusResponse>("/queue/vote", { level });
    return data;
  },

  getPeakHours: async (meal: PeakHoursMeal): Promise<PeakHourSlot[]> => {
    const { data } = await api.get<PeakHourSlot[]>("/queue/peak-hours", {
      params: { meal },
    });
    return data;
  },

  getTrend: async (): Promise<TrendResponse> => {
    const { data } = await api.get<TrendResponse>("/queue/trend");
    return data;
  },
};
