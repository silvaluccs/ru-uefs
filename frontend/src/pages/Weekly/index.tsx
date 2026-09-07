import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CalendarDays } from "lucide-react";
import { useWeeklyMenu } from "@/features/menu/hooks/useMenu";
import { MealCard } from "@/features/menu/components/MealCard";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { WakingUpState } from "@/components/feedback/WakingUpState";
import { adaptMealData } from "@/features/menu/utils/adaptMealData";
import { Footer } from "@/components/layout/Footer";
import type { DailyMenu } from "@/types/menu";

function getInitialDayIndex() {
  const bahiaTime = new Date(Date.now() - 3 * 3600 * 1000);
  return (bahiaTime.getUTCDay() + 6) % 7;
}

export function WeeklyPage() {
  const { data: weeklyData, isLoading, isError, refetch } = useWeeklyMenu();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  if (isLoading) {
    return <WakingUpState />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Não foi possível carregar o cardápio da semana. Tente novamente mais tarde."
        onRetry={refetch}
      />
    );
  }

  const dayList: DailyMenu[] = weeklyData?.cardapio ?? [];

  if (dayList.length === 0) {
    return (
      <EmptyState
        title="Nenhum cardápio cadastrado"
        message="O cardápio para esta semana ainda não foi publicado pela administração do restaurante."
      />
    );
  }

  const todayIndex = getInitialDayIndex();
  const desktopIndex = selectedDayIndex ?? todayIndex;
  const desktopDay = dayList[desktopIndex];
  const desktopRefeicoes = desktopDay?.refeicoes?.[0];
  const desktopDateStr = desktopDay?.data?.replace(/\//g, "-") ?? "";

  return (
    <div className="h-full">
    <div className="h-full overflow-y-auto scrollbar-none lg:hidden">
      <AnimatePresence mode="wait">
        {selectedDayIndex == null ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pt-20 pb-8"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Cardápio
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50 mt-0.5 mb-5">
              Semana
            </h1>

            <div className="space-y-3">
              {dayList.map((day, idx) => {
                const refeicoes = day.refeicoes?.[0];
                const isToday = idx === todayIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`w-full text-left p-4 rounded-3xl bg-white dark:bg-zinc-900 border transition-colors ${
                      isToday
                        ? "border-blue-500/50 dark:border-blue-400/40"
                        : "border-gray-100 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-lg font-extrabold capitalize text-gray-900 dark:text-zinc-50">
                        {day.dia}
                      </span>
                      <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                        {day.data}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-600 text-white">
                          Hoje
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 ml-auto text-gray-300 dark:text-zinc-600" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <MealRow color="bg-amber-400" label="Café" value={refeicoes?.desjejum?.proteina} />
                      <MealRow color="bg-blue-600" label="Almoço" value={refeicoes?.almoco?.proteina} />
                      <MealRow color="bg-indigo-500" label="Jantar" value={refeicoes?.jantar?.proteina} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <Footer />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="px-4 pt-16 pb-10"
          >
            <button
              onClick={() => setSelectedDayIndex(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Semana
            </button>

            {(() => {
              const day = dayList[selectedDayIndex];
              const refeicoes = day?.refeicoes?.[0];
              const dateStr = day?.data?.replace(/\//g, "-") ?? "";
              return (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold capitalize text-gray-900 dark:text-zinc-50 leading-none">
                        {day?.dia}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{day?.data}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <MealCard
                      title="Café da Manhã"
                      sections={adaptMealData(refeicoes, "desjejum")}
                      dateStr={dateStr}
                      hideRatingButtons
                    />
                    <MealCard
                      title="Almoço"
                      sections={adaptMealData(refeicoes, "almoco")}
                      dateStr={dateStr}
                      hideRatingButtons
                    />
                    <MealCard
                      title="Jantar"
                      sections={adaptMealData(refeicoes, "jantar")}
                      dateStr={dateStr}
                      hideRatingButtons
                    />
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Desktop: lista de dias + detalhe lado a lado */}
    <div className="hidden lg:flex h-full">
      <div className="w-64 shrink-0 h-full overflow-y-auto scrollbar-none border-r border-gray-100 dark:border-zinc-800 px-4 py-8">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Cardápio
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50 mt-0.5 mb-5">
          Semana
        </h1>
        <div className="space-y-2.5">
          {dayList.map((day, idx) => {
            const refeicoes = day.refeicoes?.[0];
            const isToday = idx === todayIndex;
            const isSelected = idx === desktopIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500/50 dark:border-blue-400/40"
                    : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-extrabold capitalize text-gray-900 dark:text-zinc-50">
                    {day.dia}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                    {day.data}
                  </span>
                  {isToday && (
                    <span className="ml-auto text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
                      Hoje
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                  {refeicoes?.almoco?.proteina || "Não informado"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-auto scrollbar-none px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold capitalize text-gray-900 dark:text-zinc-50 leading-none">
              {desktopDay?.dia}
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{desktopDay?.data}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 items-start">
          <MealCard
            title="Café da Manhã"
            sections={adaptMealData(desktopRefeicoes, "desjejum")}
            dateStr={desktopDateStr}
            hideRatingButtons
          />
          <MealCard
            title="Almoço"
            sections={adaptMealData(desktopRefeicoes, "almoco")}
            dateStr={desktopDateStr}
            hideRatingButtons
          />
          <MealCard
            title="Jantar"
            sections={adaptMealData(desktopRefeicoes, "jantar")}
            dateStr={desktopDateStr}
            hideRatingButtons
          />
        </div>
      </div>
    </div>
    </div>
  );
}

function MealRow({ color, label, value }: { color: string; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
      <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 w-14 shrink-0">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800 dark:text-zinc-100 truncate">
        {value || "Não informado"}
      </span>
    </div>
  );
}
