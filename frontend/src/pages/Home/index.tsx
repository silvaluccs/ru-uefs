import { useEffect, useRef, useState } from "react";
import {
  useTodayMenu,
  useCurrentMeal,
  useRestaurantStatus,
} from "@/features/menu/hooks/useMenu";
import { MealFeedSection } from "@/features/menu/components/MealFeedSection";
import { MealCard } from "@/features/menu/components/MealCard";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { WakingUpState } from "@/components/feedback/WakingUpState";
import { adaptMealData } from "@/features/menu/utils/adaptMealData";
import { Calendar } from "lucide-react";
import type { MealType, RestaurantStatus } from "@/types/menu";

const MEALS: {
  key: MealType;
  apiType: "desjejum" | "almoco" | "jantar";
  title: string;
  timeLabel: string;
  accent: { text: string; dot: string; glow: string };
}[] = [
  {
    key: "breakfast",
    apiType: "desjejum",
    title: "Café da manhã",
    timeLabel: "O começo do dia no campus.",
    accent: { text: "text-amber-500", dot: "bg-amber-500", glow: "rgba(245,158,11,.22)" },
  },
  {
    key: "lunch",
    apiType: "almoco",
    title: "Almoço",
    timeLabel: "O pico do dia — quando o RU lota.",
    accent: { text: "text-blue-600", dot: "bg-blue-600", glow: "rgba(37,99,235,.20)" },
  },
  {
    key: "dinner",
    apiType: "jantar",
    title: "Jantar",
    timeLabel: "Para fechar a noite com calma.",
    accent: { text: "text-indigo-500", dot: "bg-indigo-500", glow: "rgba(99,102,241,.20)" },
  },
];

export function HomePage() {
  const {
    data: todayMenu,
    isLoading: isLoadingMenu,
    isError: isErrorMenu,
    refetch: refetchMenu,
  } = useTodayMenu();
  const { data: currentMeal } = useCurrentMeal();
  const { data: fetchedRestaurantStatus } = useRestaurantStatus();

  const feedRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrolledToCurrent = useRef(false);

  const restaurantStatus: RestaurantStatus = fetchedRestaurantStatus ?? {
    isOpen: false,
    isLastServed: false,
    defaultMeal: "breakfast",
    badgeText: "Verificando status...",
  };

  const activeMealKey: MealType | null = currentMeal?.isActive
    ? currentMeal.mealType
    : null;

  // A rota /menu/now nem sempre retorna { mealType, isActive } (às vezes vem
  // { refeicao, dados } ou { message }), então usamos o defaultMeal do status
  // do restaurante como resultado confiável para saber a refeição "atual".
  const effectiveMealKey: MealType | string = activeMealKey ?? restaurantStatus.defaultMeal;
  const currentIndex = MEALS.findIndex((m) => m.key === effectiveMealKey);

  useEffect(() => {
    if (scrolledToCurrent.current) return;
    if (!fetchedRestaurantStatus) return;
    if (currentIndex < 1) {
      scrolledToCurrent.current = true;
      return;
    }
    const el = feedRef.current;
    if (!el) return;
    const target = el.children[currentIndex] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    setActiveIndex(currentIndex);
    scrolledToCurrent.current = true;
  }, [currentIndex, fetchedRestaurantStatus]);

  const onFeedScroll = () => {
    const el = feedRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    if (idx !== activeIndex && idx >= 0 && idx < MEALS.length) setActiveIndex(idx);
  };

  if (isLoadingMenu) {
    return <WakingUpState />;
  }

  if (isErrorMenu) {
    return (
      <ErrorState
        message="Erro ao conectar com o servidor do RU."
        onRetry={refetchMenu}
      />
    );
  }

  if (!todayMenu || !todayMenu.refeicoes || todayMenu.refeicoes.length === 0) {
    return (
      <EmptyState
        title="Nenhum cardápio para hoje"
        message="Os dados não foram lançados para hoje."
      />
    );
  }

  const dayData = todayMenu.refeicoes[0];
  const dateStr = todayMenu.data?.replace(/\//g, "-") ?? "";

  const mealsWithState = MEALS.map((meal) => {
    const isCurrent = effectiveMealKey === meal.key;
    return {
      ...meal,
      isCurrent,
      isOpen: isCurrent && restaurantStatus.isOpen,
      isLastServed: isCurrent && restaurantStatus.isLastServed,
      sections: adaptMealData(dayData, meal.apiType),
    };
  });

  return (
    <div className="h-full">
      {/* Mobile: feed vertical estilo TikTok */}
      <div className="relative h-full lg:hidden">
        <div
          ref={feedRef}
          onScroll={onFeedScroll}
          className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
        >
          {mealsWithState.map((meal) => (
            <MealFeedSection
              key={meal.key}
              title={meal.title}
              timeLabel={meal.timeLabel}
              sections={meal.sections}
              isCurrent={meal.isCurrent}
              isOpen={meal.isOpen}
              isLastServed={meal.isLastServed}
              dateStr={dateStr}
              mealType={meal.apiType}
              accent={meal.accent}
            />
          ))}
        </div>

        {/* dots de progresso do feed (café/almoço/jantar) */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-30">
          {MEALS.map((_, idx) => (
            <span
              key={idx}
              className={`w-1 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "h-5 bg-blue-600 dark:bg-blue-400"
                  : "h-2 bg-gray-300 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: as 3 refeições lado a lado */}
      <div className="hidden lg:block h-full overflow-y-auto scrollbar-none px-8 py-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 leading-none capitalize">
              {todayMenu.dia}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{todayMenu.data}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {mealsWithState.map((meal) => (
            <MealCard
              key={meal.key}
              title={meal.title}
              sections={meal.sections}
              isCurrent={meal.isCurrent}
              isOpen={meal.isOpen}
              isLastServed={meal.isLastServed}
              dateStr={dateStr}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
