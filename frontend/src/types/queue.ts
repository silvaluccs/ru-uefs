export type QueueLevel = "leve" | "moderada" | "intensa";

export interface WeightedPercents {
  leve: number;
  moderada: number;
  intensa: number;
}

export interface QueueStatusResponse {
  status: QueueLevel | null;
  hasEnoughData: boolean;
  totalVotes: number;
  votesNeeded: number;
  weightedPercents: WeightedPercents;
}

export interface PeakHourSlot {
  slot: string;
  avgIntensity: number | null;
  sampleCount: number;
  noData: boolean;
}

export interface TrendResponse {
  points: number[];
  trendUp: boolean;
}

export type PeakHoursMeal = "lunch" | "dinner";
