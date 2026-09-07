import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { WifiOff, Vegan, ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { useItemStats, useVoteItem, useNetworkCheck } from "@/features/menu/hooks/useMenu";
import type { FlatMealItem } from "@/features/menu/utils/flattenMealItems";

type Vote = "like" | "dislike";
type ItemStatsEntry = { likes: number; dislikes: number; percentage_likes: number };

interface ItemSwipeDeckProps {
  items: FlatMealItem[];
  dateStr: string;
  mealType: "desjejum" | "almoco" | "jantar";
  canVote: boolean;
  accentDot: string;
}

const EXIT_ADVANCE_DELAY = 170; // avança o card antes da mola terminar de assentar, pra não parecer travado

function voteKey(dateStr: string, mealType: string, itemKey: string) {
  return `ru-item-vote:${dateStr}-${mealType}-${itemKey}`;
}

function readVote(dateStr: string, mealType: string, itemKey: string): Vote | null {
  const v = localStorage.getItem(voteKey(dateStr, mealType, itemKey));
  return v === "like" || v === "dislike" ? v : null;
}

interface SwipeCardHandle {
  fling: (direction: 1 | -1, velocity?: number) => void;
  navigate: (dir: 1 | -1) => void;
}

const SwipeCard = forwardRef<
  SwipeCardHandle,
  {
    item: FlatMealItem;
    stats?: ItemStatsEntry;
    canVote: boolean;
    onVoteCommitted: (vote: Vote) => void;
    onNavigateCommitted: (dir: 1 | -1) => void;
    accentDot: string;
  }
>(({ item, stats, canVote, onVoteCommitted, onNavigateCommitted, accentDot }, ref) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const likeOpacity = useTransform(x, [30, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -30], [1, 0]);
  const likeScale = useMotionValue(1);
  const nopeScale = useMotionValue(1);

  const fling = (direction: 1 | -1, velocity = 900) => {
    animate(x, direction * 560, {
      type: "spring",
      stiffness: 300,
      damping: 28,
      velocity: direction * Math.max(400, Math.abs(velocity)),
    });
    // "carimbo" no selo Legal/Passo bem na hora que o voto é confirmado,
    // pra ficar óbvio que foi ESSE prato que recebeu o voto (não o de depois)
    if (canVote) {
      animate(direction === 1 ? likeScale : nopeScale, [1, 1.45, 1.1], {
        duration: 0.45,
        ease: "easeOut",
      });
    }
    setTimeout(() => {
      if (canVote) onVoteCommitted(direction === 1 ? "like" : "dislike");
      else onNavigateCommitted(direction === 1 ? -1 : 1);
    }, EXIT_ADVANCE_DELAY);
  };

  const navigate = (dir: 1 | -1) => {
    // dir: 1 = próximo (card sai pela esquerda), -1 = anterior (sai pela direita)
    animate(x, dir === 1 ? -560 : 560, { type: "spring", stiffness: 320, damping: 30 });
    setTimeout(() => onNavigateCommitted(dir), EXIT_ADVANCE_DELAY);
  };

  useImperativeHandle(ref, () => ({ fling, navigate }));

  const hasVotes = stats && stats.likes + stats.dislikes > 0;

  return (
    <motion.div
      style={{ x, rotate }}
      initial={{ opacity: 0, scale: 0.92, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={(_, info) => {
        if (info.offset.x > 110 || info.velocity.x > 600) fling(1, info.velocity.x);
        else if (info.offset.x < -110 || info.velocity.x < -600) fling(-1, info.velocity.x);
      }}
      className="absolute inset-0 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)] p-6 flex flex-col cursor-grab active:cursor-grabbing touch-none"
    >
      {canVote && (
        <>
          <motion.div
            style={{ opacity: likeOpacity, scale: likeScale }}
            className="absolute top-6 left-6 px-3 py-1 rounded-lg border-4 border-emerald-500 text-emerald-500 font-extrabold text-lg -rotate-12 uppercase tracking-wider"
          >
            Legal
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity, scale: nopeScale }}
            className="absolute top-6 right-6 px-3 py-1 rounded-lg border-4 border-red-500 text-red-500 font-extrabold text-lg rotate-12 uppercase tracking-wider"
          >
            Passo
          </motion.div>
        </>
      )}

      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${accentDot}`} />
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          {item.category}
        </span>
        {item.isVeg && (
          <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <Vegan className="w-3.5 h-3.5" />
            Veg
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center">
        <p className="text-3xl font-extrabold leading-tight text-gray-900 dark:text-zinc-50">
          {item.name}
        </p>
      </div>

      {hasVotes ? (
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 dark:text-zinc-500 mb-1.5">
            <span>
              <span className="text-emerald-500">{stats!.likes} 👍</span>
              {"  ·  "}
              <span className="text-red-500">{stats!.dislikes} 👎</span>
            </span>
            <span
              className={
                stats!.percentage_likes >= 70 ? "text-emerald-500" : "text-amber-500"
              }
            >
              {stats!.percentage_likes}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${stats!.percentage_likes}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">
          Seja o primeiro a avaliar este prato.
        </p>
      )}
    </motion.div>
  );
});

export function ItemSwipeDeck({ items, dateStr, mealType, canVote, accentDot }: ItemSwipeDeckProps) {
  const { data: itemStats } = useItemStats(dateStr, mealType);
  const { data: networkData, isLoading: isLoadingNetwork } = useNetworkCheck();
  const { mutate: sendVote } = useVoteItem();

  const statsByKey = useMemo(() => {
    const map: Record<string, ItemStatsEntry> = {};
    itemStats?.forEach((s) => {
      map[s.item_key] = s;
    });
    return map;
  }, [itemStats]);

  const [index, setIndex] = useState(() => {
    const firstUnvoted = items.findIndex((it) => !readVote(dateStr, mealType, it.key));
    return firstUnvoted === -1 ? 0 : firstUnvoted;
  });
  const [transitionNonce, setTransitionNonce] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const cardRef = useRef<SwipeCardHandle>(null);

  const isUefsNetwork = networkData?.is_uefs_network ?? false;
  const canInteract = canVote && isUefsNetwork && !isLoadingNetwork;

  const current = items[index];
  const count = items.length;

  const goNext = () => cardRef.current?.navigate(1);
  const goPrev = () => cardRef.current?.navigate(-1);

  const handleVoteCommitted = (vote: Vote) => {
    if (!current) return;
    localStorage.setItem(voteKey(dateStr, mealType, current.key), vote);
    sendVote({ dateStr, mealType, itemKey: current.key, voteType: vote });
    setVotedCount((c) => c + 1);
    setTransitionNonce((n) => n + 1);
    setIndex((i) => (i + 1) % count);
  };

  const handleNavigateCommitted = (dir: 1 | -1) => {
    setTransitionNonce((n) => n + 1);
    setIndex((i) => (i + dir + count) % count);
  };

  if (items.length === 0) {
    return (
      <div className="mx-5 mb-4 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-8 text-center text-sm text-gray-400 dark:text-zinc-500">
        Nenhum item disponível.
      </div>
    );
  }

  return (
    <div className="px-5">
      {canVote && !isUefsNetwork && !isLoadingNetwork && (
        <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-500 bg-amber-50/60 dark:bg-amber-950/20 px-3 py-2 rounded-xl border border-amber-100 dark:border-amber-900/40">
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          Conecte-se à rede da UEFS para avaliar os pratos.
        </div>
      )}

      <div className="relative h-56">
        {/* peek do próximo card */}
        {count > 1 && (
          <div className="absolute inset-0 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 scale-[0.94] translate-y-2 opacity-60" />
        )}

        {current && (
          <SwipeCard
            key={`${current.key}-${transitionNonce}`}
            ref={cardRef}
            item={current}
            stats={statsByKey[current.key]}
            canVote={canInteract}
            onVoteCommitted={handleVoteCommitted}
            onNavigateCommitted={handleNavigateCommitted}
            accentDot={accentDot}
          />
        )}

        {/* setas de navegação — sempre disponíveis, com ou sem avaliação (dá a volta no fim) */}
        {count > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Prato anterior"
              className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-gray-500 dark:text-zinc-400 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              aria-label="Próximo prato"
              className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-gray-500 dark:text-zinc-400 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {canVote ? (
        <div className="flex flex-col items-center gap-1.5 mt-4">
          <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 tabular-nums">
            {index + 1}/{count}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-zinc-500">
            <MoveHorizontal className="w-3.5 h-3.5" />
            arraste para avaliar
          </div>
        </div>
      ) : (
        <p className="text-center text-xs font-semibold text-gray-400 dark:text-zinc-500 mt-4">
          {index + 1}/{count} · avaliação liberada só na hora dessa refeição
        </p>
      )}

      {votedCount > 0 && (
        <p className="text-center text-[11px] font-semibold text-gray-400 dark:text-zinc-500 mt-2">
          {votedCount} {votedCount === 1 ? "prato avaliado" : "pratos avaliados"} nesta refeição
        </p>
      )}
    </div>
  );
}
