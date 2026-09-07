import { useQueueTrend } from "@/features/queue/hooks/useQueue";

export function TrendSparkline() {
  const { data } = useQueueTrend();
  const points = data?.points ?? [];

  if (points.length < 2) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((val, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 28 - ((val - min) / range) * 24;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const trendColor = data?.trendUp ? "stroke-red-500" : "stroke-emerald-500";
  const textColor = data?.trendUp ? "text-red-500" : "text-emerald-500";
  const [lastX, lastY] = coords[coords.length - 1].split(",");

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center gap-4">
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900 dark:text-zinc-50">Tendência · 2h</p>
        <p className={`text-xs font-bold mt-0.5 ${textColor}`}>
          {data?.trendUp ? "↗ Fila em alta agora" : "↘ Fila diminuindo"}
        </p>
      </div>
      <svg width="110" height="32" viewBox="0 0 100 30" preserveAspectRatio="none" className="overflow-visible">
        <polyline
          points={coords.join(" ")}
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={trendColor}
        />
        <circle cx={lastX} cy={lastY} r="3" className={trendColor.replace("stroke-", "fill-")} />
      </svg>
    </div>
  );
}
