import { Users, Clock } from "lucide-react";
import type { QueueStatusResponse } from "@/types/queue";

const LEVEL_META: Record<
  "leve" | "moderada" | "intensa",
  { label: string; ring: string; bg: string; text: string }
> = {
  leve: { label: "Leve", ring: "border-emerald-500", bg: "bg-emerald-500", text: "text-emerald-500" },
  moderada: { label: "Moderada", ring: "border-amber-500", bg: "bg-amber-500", text: "text-amber-500" },
  intensa: { label: "Intensa", ring: "border-red-500", bg: "bg-red-500", text: "text-red-500" },
};

export function QueueStatusHero({ status }: { status?: QueueStatusResponse }) {
  if (!status || !status.hasEnoughData) {
    const total = status?.totalVotes ?? 0;
    const needed = status?.votesNeeded ?? 15;
    const progress = Math.min(100, (total / (total + needed || 1)) * 100);

    return (
      <div className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full border-4 border-dashed border-gray-200 dark:border-zinc-700 flex items-center justify-center">
          <Clock className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
        </div>
        <p className="mt-4 text-xl font-extrabold text-gray-900 dark:text-zinc-50">
          Coletando dados...
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
          Faltam <span className="font-bold text-blue-600 dark:text-blue-400">{needed}</span> votos
          para exibir o status
        </p>
        <div className="mt-4 h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden max-w-52 mx-auto">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  const meta = LEVEL_META[status.status ?? "leve"];

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center">
      <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 tracking-wide">
        A fila agora está
      </p>
      <div className="relative w-28 h-28 mx-auto my-4 flex items-center justify-center">
        <span className={`absolute inset-0 rounded-full border-2 ${meta.ring} opacity-40 animate-pulse`} />
        <span className={`relative w-20 h-20 rounded-full ${meta.bg} flex items-center justify-center shadow-lg`}>
          <Users className="w-9 h-9 text-white" />
        </span>
      </div>
      <p className={`text-3xl font-extrabold ${meta.text}`}>{meta.label}</p>
      <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-zinc-400">
        <span className="text-gray-800 dark:text-zinc-200">{status.totalVotes}</span> votos ·
        janela de 30 min
      </p>
    </div>
  );
}
