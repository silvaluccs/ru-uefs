import { useState } from "react";
import { usePeakHours } from "@/features/queue/hooks/useQueue";
import type { PeakHoursMeal } from "@/types/queue";

function colorOf(avg: number | null) {
  if (avg == null) return "bg-gray-200 dark:bg-zinc-700";
  if (avg < 1.6) return "bg-emerald-500";
  if (avg < 2.4) return "bg-amber-500";
  return "bg-red-500";
}

export function PeakHoursChart() {
  const [meal, setMeal] = useState<PeakHoursMeal>("lunch");
  const { data: slots } = usePeakHours(meal);

  const valid = (slots ?? []).filter((s) => !s.noData);
  const best = valid.reduce<typeof valid[number] | null>(
    (a, b) => (!a || (a.avgIntensity ?? Infinity) <= (b.avgIntensity ?? Infinity) ? a : b),
    null,
  );

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold text-gray-900 dark:text-zinc-50">Horários de pico</p>
        <div className="flex gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
          {(["lunch", "dinner"] as PeakHoursMeal[]).map((m) => (
            <button
              key={m}
              onClick={() => setMeal(m)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                meal === m
                  ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-50"
                  : "text-gray-400 dark:text-zinc-500"
              }`}
            >
              {m === "lunch" ? "Almoço" : "Jantar"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-1.5 h-28 mt-4">
        {(slots ?? []).map((slot) => (
          <div key={slot.slot} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500">
              {slot.noData ? "—" : slot.avgIntensity?.toFixed(1)}
            </span>
            <div
              className={`w-full rounded-t-md ${colorOf(slot.avgIntensity)}`}
              style={{ height: slot.noData ? "6%" : `${Math.round(((slot.avgIntensity ?? 0) / 3) * 100)}%` }}
            />
            <span className="text-[9px] font-semibold text-gray-400 dark:text-zinc-500 whitespace-nowrap">
              {slot.slot}
            </span>
          </div>
        ))}
      </div>

      {best && (
        <div className="flex items-center gap-3 mt-4 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Melhor hora pra ir
            </p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-zinc-50">{best.slot}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-3">
        <Legend color="bg-emerald-500" label="Leve" />
        <Legend color="bg-amber-500" label="Moderada" />
        <Legend color="bg-red-500" label="Intensa" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 dark:text-zinc-500">
      <span className={`w-2 h-2 rounded-sm ${color}`} />
      {label}
    </div>
  );
}
