import { useEffect, useState } from "react";
import { WifiOff, Timer, Clock } from "lucide-react";
import { useNetworkCheck, useRestaurantStatus } from "@/features/menu/hooks/useMenu";
import { useVoteQueue } from "@/features/queue/hooks/useQueue";
import type { QueueLevel } from "@/types/queue";

const COOLDOWN_KEY = "ru-queue-vote:cooldown-until";
const MY_VOTE_KEY = "ru-queue-vote:level";
const COOLDOWN_SECONDS = 3 * 60;

const OPTIONS: { key: QueueLevel; label: string; dot: string; tint: string; border: string; text: string }[] = [
  { key: "leve", label: "Leve", dot: "bg-emerald-500", tint: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  { key: "moderada", label: "Moderada", dot: "bg-amber-500", tint: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-500", text: "text-amber-600 dark:text-amber-400" },
  { key: "intensa", label: "Intensa", dot: "bg-red-500", tint: "bg-red-50 dark:bg-red-950/30", border: "border-red-500", text: "text-red-600 dark:text-red-400" },
];

export function QueueVoteButtons() {
  const { data: networkData, isLoading: isLoadingNetwork } = useNetworkCheck();
  const { data: restaurantStatus, isLoading: isLoadingStatus } = useRestaurantStatus();
  const { mutate: vote } = useVoteQueue();

  const [myVote, setMyVote] = useState<QueueLevel | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const isUefsNetwork = networkData?.is_uefs_network ?? false;
  const isOpen = restaurantStatus?.isOpen ?? false;

  useEffect(() => {
    const savedVote = localStorage.getItem(MY_VOTE_KEY) as QueueLevel | null;
    if (savedVote) setMyVote(savedVote);

    const cooldownUntil = localStorage.getItem(COOLDOWN_KEY);
    if (cooldownUntil) {
      const timeLeft = Math.ceil((parseInt(cooldownUntil, 10) - Date.now()) / 1000);
      if (timeLeft > 0) setCooldown(timeLeft);
      else localStorage.removeItem(COOLDOWN_KEY);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const canVote = isUefsNetwork && isOpen && cooldown <= 0;

  const handleVote = (level: QueueLevel) => {
    if (!canVote) return;
    setMyVote(level);
    localStorage.setItem(MY_VOTE_KEY, level);

    const until = Date.now() + COOLDOWN_SECONDS * 1000;
    localStorage.setItem(COOLDOWN_KEY, until.toString());
    setCooldown(COOLDOWN_SECONDS);

    vote(level);
  };

  if (isLoadingNetwork || isLoadingStatus) return null;

  if (!isUefsNetwork) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-50/40 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40">
        <WifiOff className="w-3.5 h-3.5 shrink-0" />
        <span>Conecte-se à rede da UEFS para votar na fila.</span>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800">
        <Clock className="w-3.5 h-3.5 shrink-0" />
        <span>O RU está fechado agora. A votação da fila abre junto com o restaurante.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {OPTIONS.map((opt) => {
          const selected = myVote === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => handleVote(opt.key)}
              disabled={!canVote}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all disabled:opacity-50 ${
                selected ? `${opt.border} ${opt.tint}` : "border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              }`}
            >
              <span className={`w-5 h-5 rounded-full ${opt.dot}`} />
              <span className={`text-xs font-bold ${selected ? opt.text : "text-gray-700 dark:text-zinc-300"}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
      {cooldown > 0 && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-zinc-500 justify-center">
          <Timer className="w-3.5 h-3.5" />
          <span>Você já votou. Aguarde {Math.ceil(cooldown / 60)} min para votar de novo.</span>
        </div>
      )}
    </div>
  );
}
