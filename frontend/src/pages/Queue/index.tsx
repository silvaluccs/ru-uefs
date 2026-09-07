import { useQueueStatus } from "@/features/queue/hooks/useQueue";
import { NetworkStatusCard } from "@/features/queue/components/NetworkStatusCard";
import { QueueStatusHero } from "@/features/queue/components/QueueStatusHero";
import { QueueVoteButtons } from "@/features/queue/components/QueueVoteButtons";
import { WeightedDistribution } from "@/features/queue/components/WeightedDistribution";
import { PeakHoursChart } from "@/features/queue/components/PeakHoursChart";
import { TrendSparkline } from "@/features/queue/components/TrendSparkline";

export function QueuePage() {
  const { data: status } = useQueueStatus();

  return (
    <div className="h-full overflow-y-auto scrollbar-none px-4 lg:px-8 pt-20 lg:pt-8 pb-8">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        Tempo real
      </p>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50 mt-0.5 mb-5 lg:mb-6">
        Fila do RU
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
        <div className="space-y-4">
          <NetworkStatusCard />
          <QueueStatusHero status={status} />
          <QueueVoteButtons />
        </div>
        <div className="space-y-4">
          <WeightedDistribution status={status} />
          <PeakHoursChart />
          <TrendSparkline />
        </div>
      </div>
    </div>
  );
}
