import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeeklyMenu } from "@/features/menu/hooks/useMenu";
import { MealCard } from "@/features/menu/components/MealCard";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { WakingUpState } from "@/components/feedback/WakingUpState";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  Calendar,
  HeartHandshake,
  HelpCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

import bandejaImg from "@/assets/bandeja.png";
import saladaImg from "@/assets/salada.png";
import { adaptMealData } from "@/features/menu/utils/adaptMealData";
import type { RefeicaoDia } from "@/types/menu";

export function WeeklyPage() {
  const { data: weeklyData, isLoading, isError, refetch } = useWeeklyMenu();

  const getInitialDayIndex = () => {
    const bahiaTime = new Date(Date.now() - 3 * 3600 * 1000);
    return (bahiaTime.getUTCDay() + 6) % 7;
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(getInitialDayIndex);

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

  const dayList = weeklyData?.cardapio || (weeklyData as any)?.days;

  if (!dayList || !Array.isArray(dayList) || dayList.length === 0) {
    return (
      <EmptyState
        title="Nenhum cardápio cadastrado"
        message="O cardápio para esta semana ainda não foi publicado pela administração do restaurante."
      />
    );
  }

  const getMealLastUpdate = () => {
    if (!weeklyData?.created_at) return "--:--";
    return weeklyData.created_at.slice(0, 5);
  };

  const currentActiveDay = dayList[selectedDayIndex] || dayList[0];
  const activeDayMealData: RefeicaoDia = currentActiveDay?.refeicoes?.[0];

  return (
    <div className="space-y-10 pb-12 overflow-x-hidden">
      <section className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white dark:border-zinc-800/80 p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
          <div className="space-y-6 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/70 dark:bg-blue-950/40 backdrop-blur-md border border-blue-200/60 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Cardápio Semanal • UEFS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50 leading-[1.1]">
              Planeje sua semana, <br />
              coma bem,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                viva melhor.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-zinc-400 font-normal leading-relaxed">
              Confira o cardápio completo da semana e escolha suas melhores opções.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {weeklyData?.data_inicio && weeklyData?.data_fim && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-xl text-sm font-semibold text-gray-700 dark:text-zinc-300 border border-gray-200/60 dark:border-zinc-700/60 shadow-sm">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>
                    Vigência: {weeklyData.data_inicio} a {weeklyData.data_fim}
                  </span>
                </div>
              )}

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium bg-emerald-50/80 dark:bg-emerald-950/30 backdrop-blur-md border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sujeito a alterações</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 border border-gray-200/60 dark:border-zinc-700/60 shadow-sm">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Atualizado às {getMealLastUpdate()}</span>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-64 sm:h-72 lg:h-80 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-emerald-400/20 dark:from-blue-600/20 dark:to-emerald-600/20 rounded-full blur-2xl transform scale-75 pointer-events-none" />

            <motion.img
              src={bandejaImg}
              alt="Bandeja RU"
              className="relative z-10 w-64 sm:w-80 lg:w-96 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)]"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
            Selecione o dia da semana
          </h2>
          <span className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
            {dayList.length} dias cadastrados
          </span>
        </div>

        <div
          className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none snap-x"
          role="tablist"
        >
          {dayList.map((day: any, idx: number) => {
            const isSelected = selectedDayIndex === idx;

            return (
              <button
                key={idx}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedDayIndex(idx)}
                className={`relative flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 snap-start cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isSelected
                    ? "text-blue-600 dark:text-blue-400 border-blue-500/30 dark:border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm"
                    : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 border-gray-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeWeeklyPill"
                    className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl border border-blue-500/40"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 font-bold text-base capitalize">
                  {day.dia}
                </span>
                <span className="relative z-10 text-xs opacity-80 mt-0.5">
                  {day.data}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDayIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between border-b border-gray-200/60 dark:border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-zinc-100 capitalize">
                  Cardápio de {currentActiveDay?.dia}
                </h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Data: {currentActiveDay?.data}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDayIndex((prev) => Math.max(0, prev - 1))}
                disabled={selectedDayIndex === 0}
                aria-label="Dia anterior"
                className="p-2.5 rounded-xl border border-gray-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setSelectedDayIndex((prev) => Math.min(dayList.length - 1, prev + 1))
                }
                disabled={selectedDayIndex === dayList.length - 1}
                aria-label="Próximo dia"
                className="p-2.5 rounded-xl border border-gray-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MealCard
              title="Café da Manhã"
              sections={adaptMealData(activeDayMealData, "desjejum")}
              dateStr={currentActiveDay?.data?.replace(/\//g, "-")}
              hideRatingButtons={true}
            />
            <MealCard
              title="Almoço"
              sections={adaptMealData(activeDayMealData, "almoco")}
              dateStr={currentActiveDay?.data?.replace(/\//g, "-")}
              hideRatingButtons={true}
            />
            <MealCard
              title="Jantar"
              sections={adaptMealData(activeDayMealData, "jantar")}
              dateStr={currentActiveDay?.data?.replace(/\//g, "-")}
              hideRatingButtons={true}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <section className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-zinc-900/80 dark:to-zinc-900/50 border border-emerald-100/80 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider mb-3">
              <HeartHandshake className="w-5 h-5" />
              <span>Dica Saudável</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">
              Alimentação Balanceada
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              Inclua frutas e verduras nas suas refeições diárias para uma vida mais saudável!
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <img
              src={saladaImg}
              alt="Salada"
              className="w-24 h-24 object-contain drop-shadow-md hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200/60 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">
              Tem alergias?
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              Consulte a equipe de nutrição no salão do RU para obter informações detalhadas sobre os ingredientes de cada receita.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/60">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Nutrição & Saúde
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200/60 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">
              Fique por dentro
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              O cardápio pode sofrer alterações sem aviso prévio pela instituição. Acompanhe as atualizações diariamente.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/60">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Atualizações Diárias
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
