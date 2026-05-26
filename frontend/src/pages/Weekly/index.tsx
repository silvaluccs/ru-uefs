import { useWeeklyMenu } from "@/features/menu/hooks/useMenu";
import { MealCard } from "@/features/menu/components/MealCard";
import { MealSkeleton } from "@/features/menu/components/MealSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { WakingUpState } from "@/components/feedback/WakingUpState";
import { CalendarDays } from "lucide-react";

interface MealSection {
  title: string;
  items: string[];
}

function adaptMealData(
  mealData: any,
  type: "desjejum" | "almoco" | "jantar",
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

export function WeeklyPage() {
  const { data: weeklyData, isLoading, isError, refetch } = useWeeklyMenu();

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

  const dayList = weeklyData?.cardapio;

  if (!dayList || !Array.isArray(dayList) || dayList.length === 0) {
    return (
      <EmptyState
        title="Nenhum cardápio cadastrado"
        message="O cardápio para esta semana ainda não foi publicado pela administração do restaurante."
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-0.5">
            Cronograma Semanal
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
            Cardápio da Semana
          </h1>
        </div>
        {weeklyData.data_inicio && weeklyData.data_fim && (
          <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900 px-3 py-1.5 rounded-md border border-gray-100 dark:border-zinc-800 self-start md:self-auto transition-colors duration-200">
            Vigência: {weeklyData.data_inicio} até {weeklyData.data_fim}
          </span>
        )}
      </div>

      <div className="space-y-12">
        {dayList.map((day: any, dayIndex: number) => {
          const dayMealData = day.refeicoes?.[0];

          return (
            <div
              key={dayIndex}
              className="space-y-4 border-b border-gray-100 dark:border-zinc-800 pb-10 last:border-0 last:pb-0"
            >
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                  {day.dia}
                </h2>
                <span className="text-xs font-medium text-gray-400 dark:text-zinc-400">
                  • {day.data}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MealCard
                  title="Café da Manhã"
                  sections={adaptMealData(dayMealData, "desjejum")}
                />
                <MealCard
                  title="Almoço"
                  sections={adaptMealData(dayMealData, "almoco")}
                />
                <MealCard
                  title="Jantar"
                  sections={adaptMealData(dayMealData, "jantar")}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
