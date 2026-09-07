import type { QueueStatusResponse } from "@/types/queue";

const ROWS: { key: "leve" | "moderada" | "intensa"; label: string; color: string }[] = [
  { key: "leve", label: "Leve", color: "bg-emerald-500" },
  { key: "moderada", label: "Moderada", color: "bg-amber-500" },
  { key: "intensa", label: "Intensa", color: "bg-red-500" },
];

export function WeightedDistribution({ status }: { status?: QueueStatusResponse }) {
  const percents = status?.weightedPercents;

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 mb-3">
        Distribuição ponderada
      </p>
      <div className="space-y-3">
        {ROWS.map((row) => {
          const pct = Math.round(percents?.[row.key] ?? 0);
          return (
            <div key={row.key}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${row.color}`} />
                <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex-1">{row.label}</span>
                <span className="text-xs font-extrabold text-gray-900 dark:text-zinc-50">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${row.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-3">
        Votos mais recentes têm peso maior (decaimento linear em 30 min).
      </p>
    </div>
  );
}
