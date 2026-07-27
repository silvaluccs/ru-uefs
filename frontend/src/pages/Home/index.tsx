import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTodayMenu, useCurrentMeal, useRestaurantStatus } from "@/features/menu/hooks/useMenu";
import { MealTabs } from "@/features/menu/components/MealTabs";
import { MealCard } from "@/features/menu/components/MealCard";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { WakingUpState } from "@/components/feedback/WakingUpState";
import { Calendar, Sparkles, HeartHandshake } from "lucide-react";
import type { MealType, RestaurantStatus } from "@/types/menu";

import saladaImg from "@/assets/salada.png";
import { Footer } from "@/components/layout/Footer";

interface MealSection {
  title: string;
  items: string[];
}

function adaptMealData(
  mealData: any,
  type: "desjejum" | "almoco" | "jantar"
): MealSection[] {
  if (!mealData) return [];

  const cleanList = (items: any): string[] => {
    if (!items) return [];
    if (Array.isArray(items)) return items.filter(Boolean);
    return [items].filter(Boolean);
  };

  if (type === "desjejum" && mealData.desjejum) {
    const d = mealData.desjejum;
    return [
      { title: "Pães / Carboidratos", items: cleanList(d.pao) },
      { title: "Proteína", items: cleanList(d.proteina) },
      { title: "Raiz ou Farináceo", items: cleanList(d.raiz_ou_farinaceio) },
      {
        title: "Opção Ovolactovegetariana",
        items: cleanList(d.ovolactovegetariano),
      },
      { title: "Fruta", items: cleanList(d.fruta) },
      { title: "Bebidas", items: d.bebida || [] },
    ].filter((section) => section.items.length > 0);
  }

  if (type === "almoco" && mealData.almoco) {
    const a = mealData.almoco;
    return [
      {
        title: "Prato Principal",
        items: cleanList([a.proteina, a.opcao_proteina]),
      },
      {
        title: "Acompanhamentos",
        items: cleanList([a.acompanhamento_I, a.acompanhamento_II]),
      },
      { title: "Guarnição", items: cleanList(a.guarnicao) },
      { title: "Saladas", items: cleanList([a.salada_crua, a.salada_cozida]) },
      {
        title: "Opção Ovolactovegetariana",
        items: a.ovolactovegetariano || [],
      },
      { title: "Sobremesa", items: cleanList(a.fruta) },
      { title: "Suco", items: cleanList(a.suco) },
    ].filter((section) => section.items.length > 0);
  }

  if (type === "jantar" && mealData.jantar) {
    const j = mealData.jantar;
    return [
      { title: "Prato Principal / Proteína", items: cleanList(j.proteina) },
      { title: "Sopa", items: cleanList(j.sopa) },
      { title: "Raiz ou Farináceo", items: cleanList(j.raiz_ou_farinaceio) },
      { title: "Acompanhamentos", items: cleanList(j.pao) },
      {
        title: "Opção Ovolactovegetariana",
        items: j.ovolactovegetariano || [],
      },
      { title: "Bebidas", items: j.bebida || [] },
    ].filter((section) => section.items.length > 0);
  }

  return [];
}

export function HomePage() {
  const {
    data: todayMenu,
    isLoading: isLoadingMenu,
    isError: isErrorMenu,
    refetch: refetchMenu,
  } = useTodayMenu();
  const { data: currentMeal } = useCurrentMeal();
  const { data: fetchedRestaurantStatus } = useRestaurantStatus();

  const [selectedTab, setSelectedTab] = useState<MealType | null>(null);

  // Fallback seguro enquanto o status carrega do backend
  const restaurantStatus: RestaurantStatus = fetchedRestaurantStatus ?? {
    isOpen: false,
    isLastServed: false,
    defaultMeal: "breakfast",
    badgeText: "Verificando status...",
  };

  const activeTab: MealType =
    selectedTab ??
    (currentMeal?.isActive
      ? currentMeal.mealType
      : restaurantStatus.defaultMeal);

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

  const tabTitles: Record<MealType, string> = {
    breakfast: "Café da Manhã",
    lunch: "Almoço Completo",
    dinner: "Jantar Completo",
  };

  const apiType =
    activeTab === "breakfast"
      ? "desjejum"
      : activeTab === "lunch"
      ? "almoco"
      : "jantar";

  return (
    <div className="space-y-8 pb-10 overflow-x-hidden">
      {/* HERO SECTION - Estilo SaaS com Efeito Glass */}
      <section className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white dark:border-zinc-800/80 p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Glows de Fundo */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/10 dark:bg-zinc-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400/10 dark:bg-zinc-700/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
          <div className="space-y-5 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 dark:bg-zinc-800/60 backdrop-blur-md border border-blue-200/50 dark:border-zinc-700 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cardápio Diário • UEFS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50 leading-tight">
              Menos Complicação,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Mais Informação.
              </span>
            </h1>

            {/* Badges de Data e Status */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-xl text-xs font-medium text-gray-700 dark:text-zinc-300 border border-gray-200/50 dark:border-zinc-700/50 shadow-sm">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{todayMenu.dia}, {todayMenu.data}</span>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all duration-300 shadow-sm ${
                  restaurantStatus.isOpen
                    ? "bg-emerald-50/60 dark:bg-zinc-800/80 border-emerald-200/50 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-50/60 dark:bg-zinc-800/80 border-amber-200/50 dark:border-zinc-700 text-red-700 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    restaurantStatus.isOpen ? "bg-emerald-500" : "bg-red-500"
                  } animate-pulse`}
                />
                <span>
                  {restaurantStatus.isOpen ? "Aberto agora: " : "Fechado: "}
                  {restaurantStatus.badgeText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Principal */}
        <main className="lg:col-span-8 space-y-6">
          <MealTabs activeTab={activeTab} onChangeTab={setSelectedTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MealCard
                title={tabTitles[activeTab]}
                sections={adaptMealData(dayData, apiType)}
                isCurrent={
                  currentMeal?.isActive
                    ? currentMeal.mealType === activeTab
                    : restaurantStatus.defaultMeal === activeTab
                }
                isOpen={restaurantStatus.isOpen}
                isLastServed={restaurantStatus.isLastServed}
              />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Sidebar Lateral */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-zinc-900/70 border border-gray-100 dark:border-zinc-900/70 p-6 shadow-2xs flex flex-col">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase mb-3">
              <HeartHandshake className="w-4 h-4" />
              <span>Dica Saudável</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">
              Equilíbrio no seu prato
            </h3>

            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed mb-6">
              Inclua frutas e verduras nas suas refeições diárias para uma vida universitária mais saudável e disposta!
            </p>

            <div className="h-44 w-full flex items-center justify-center bg-emerald-50/60 dark:bg-zinc-900/70 rounded-2xl border border-emerald-100/80 dark:border-zinc-900/70 relative overflow-hidden mt-auto">
              <img
                src={saladaImg}
                alt="Salada Saudável"
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-xl absolute bottom-0 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
