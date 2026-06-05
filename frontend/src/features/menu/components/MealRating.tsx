import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Timer, WifiOff } from "lucide-react";
import { useMealStats, useVoteMeal, useNetworkCheck } from "../hooks/useMenu";

interface MealRatingProps {
  localStorageKey: string;
  dateStr: string;
  mealType: "desjejum" | "almoco" | "jantar";
  isVoteAllowed?: boolean;
  hideButtons?: boolean;
}

export function MealRating({
  localStorageKey,
  dateStr,
  mealType,
  isVoteAllowed = true,
  hideButtons = false,
}: MealRatingProps) {
  const cooldownKey = `${localStorageKey}:cooldown-until`;
  const attemptsKey = `${localStorageKey}:attempts`;

  const { data: serverStats, isLoading: isLoadingStats } = useMealStats(
    dateStr,
    mealType,
  );
  const { data: networkData, isLoading: isLoadingNetwork } = useNetworkCheck();
  const { mutate: sendVoteToServer } = useVoteMeal();

  const [stats, setStats] = useState({
    likes: 0,
    dislikes: 0,
    percentage_likes: 0,
  });
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [animateLike, setAnimateLike] = useState(false);
  const [animateDislike, setAnimateDislike] = useState(false);

  const [voteAttempts, setVoteAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const isUefsNetwork = networkData?.is_uefs_network ?? false;

  const checkIfToday = (): boolean => {
    try {
      const todayString = new Date().toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });
      return dateStr === todayString.replace(/\//g, "-");
    } catch {
      return true;
    }
  };

  const isToday = checkIfToday();

  const isMealTimeActive = isToday ? isVoteAllowed : false;

  const canUserVote = isMealTimeActive && isUefsNetwork;

  useEffect(() => {
    if (serverStats) {
      setStats(serverStats);
    }
  }, [serverStats]);

  useEffect(() => {
    const savedVote = localStorage.getItem(localStorageKey);
    if (savedVote === "like" || savedVote === "dislike") {
      setUserVote(savedVote);
    }

    const savedAttempts = localStorage.getItem(attemptsKey);
    if (savedAttempts) {
      setVoteAttempts(parseInt(savedAttempts, 10));
    }

    const cooldownUntil = localStorage.getItem(cooldownKey);
    if (cooldownUntil) {
      const timeLeft = Math.ceil(
        (parseInt(cooldownUntil, 10) - Date.now()) / 1000,
      );
      if (timeLeft > 0) {
        setCooldown(timeLeft);
      } else {
        localStorage.removeItem(cooldownKey);
      }
    }
  }, [localStorageKey, cooldownKey, attemptsKey]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(cooldownKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown, cooldownKey]);

  const handleVote = (type: "like" | "dislike") => {
    if (!canUserVote || cooldown > 0 || userVote === type || isLoadingStats)
      return;

    if (type === "like") {
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 450);
    } else {
      setAnimateDislike(true);
      setTimeout(() => setAnimateDislike(false), 450);
    }

    const previousVote = userVote;
    setUserVote(type);
    localStorage.setItem(localStorageKey, type);

    const nextAttempts = voteAttempts + 1;
    setVoteAttempts(nextAttempts);
    localStorage.setItem(attemptsKey, nextAttempts.toString());

    const durationSeconds = Math.pow(5, nextAttempts);
    const cooldownTargetTimestamp = Date.now() + durationSeconds * 1000;

    setCooldown(durationSeconds);
    localStorage.setItem(cooldownKey, cooldownTargetTimestamp.toString());

    sendVoteToServer({ dateStr, mealType, voteType: type });

    setStats((prev) => {
      let newLikes = prev.likes;
      let newDislikes = prev.dislikes;

      if (type === "like") {
        newLikes += 1;
        if (previousVote === "dislike") newDislikes -= 1;
      } else {
        newDislikes += 1;
        if (previousVote === "like") newLikes -= 1;
      }

      const total = newLikes + newDislikes;
      return {
        likes: newLikes,
        dislikes: newDislikes,
        percentage_likes:
          total > 0 ? Math.round((newLikes / total) * 100 * 10) / 10 : 0,
      };
    });
  };

  if (isLoadingStats || isLoadingNetwork) {
    return (
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/60 text-center text-xs text-gray-400 animate-pulse">
        Carregando avaliações...
      </div>
    );
  }

  const hasVotes = stats.likes + stats.dislikes > 0;

  return (
    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/60 flex flex-col gap-2.5">
      <style>{`
          @keyframes customLikePop {
            0% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.3) rotate(-12deg); }
            70% { transform: scale(0.9) rotate(8deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          @keyframes customDislikePop {
            0% { transform: scale(1) translateY(0); }
            30% { transform: scale(1.3) translateY(2px) rotate(8deg); }
            70% { transform: scale(0.9) translateY(-1px); }
            100% { transform: scale(1) translateY(0); }
          }
          .animate-svg-like { animation: customLikePop 450ms ease-in-out; }
          .animate-svg-dislike { animation: customDislikePop 450ms ease-in-out; }
        `}</style>

      {hasVotes ? (
        <>
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 dark:text-zinc-500">
            <span>Aprovação da refeição</span>
            <span
              className={
                stats.percentage_likes >= 70
                  ? "text-emerald-500"
                  : "text-amber-500"
              }
            >
              {stats.percentage_likes}% aprovado
            </span>
          </div>

          <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${stats.percentage_likes}%` }}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-1 text-xs font-medium text-gray-400 dark:text-zinc-500 bg-gray-50/50 dark:bg-zinc-800/30 rounded-md border border-dashed border-gray-200/60 dark:border-zinc-800">
          Nenhuma avaliação encontrada para esta refeição.
        </div>
      )}

      {!hideButtons && isMealTimeActive && (
        <>
          {isUefsNetwork ? (
            <>
              {cooldown > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-500 animate-pulse transition-all">
                  <Timer className="w-3.5 h-3.5" />
                  <span>
                    Aguarde {cooldown}s para alterar seu voto novamente
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-1">
                <button
                  disabled={cooldown > 0 || userVote === "like"}
                  onClick={() => handleVote("like")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 select-none bg-gray-50 dark:bg-zinc-800/50 border ${
                    userVote === "like"
                      ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-gray-700 dark:text-zinc-300"
                  } ${cooldown > 0 && userVote !== "like" ? "opacity-40 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800/50" : "hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 transition-transform duration-200 ${
                      userVote === "like"
                        ? "fill-emerald-500/10 text-emerald-500"
                        : ""
                    } ${animateLike ? "animate-svg-like" : ""}`}
                  />
                  <span>{userVote === "like" ? "Votado" : "Legal"}</span>
                </button>

                <button
                  disabled={cooldown > 0 || userVote === "dislike"}
                  onClick={() => handleVote("dislike")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 select-none bg-gray-50 dark:bg-zinc-800/50 border ${
                    userVote === "dislike"
                      ? "border-red-500/50 text-red-600 dark:text-red-400"
                      : "border-transparent text-gray-700 dark:text-zinc-300"
                  } ${cooldown > 0 && userVote !== "dislike" ? "opacity-40 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800/50" : "hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
                >
                  <ThumbsDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      userVote === "dislike"
                        ? "fill-red-500/10 text-red-500"
                        : ""
                    } ${animateDislike ? "animate-svg-dislike" : ""}`}
                  />
                  <span>{userVote === "dislike" ? "Votado" : "Não Legal"}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-500 bg-amber-50/40 dark:bg-amber-950/20 p-2 rounded-md border border-amber-100 dark:border-amber-900/40 mt-1">
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
              <span>Para avaliar o cardápio, conecte-se à rede da UEFS.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
