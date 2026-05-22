import { useWeeklyMenu } from "@/features/menu/hooks/useMenu";
import { MealCard } from "@/features/menu/components/MealCard";
import { MealSkeleton } from "@/features/menu/components/MealSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CalendarDays } from "lucide-react";

interface SecaoRefeicao {
  titulo: string;
  itens: string[];
}

// HELPER: Converte os nós da API da UEFS nas seções flexíveis que o novo MealCard espera
function adaptarRefeicaoDinamica(
  dadosRefeicao: any,
  tipo: "desjejum" | "almoco" | "jantar",
): SecaoRefeicao[] {
  if (!dadosRefeicao) return [];

  const limparLista = (itens: any): string[] => {
    if (!itens) return [];
    if (Array.isArray(itens)) return itens.filter(Boolean);
    return [itens].filter(Boolean);
  };

  if (tipo === "desjejum" && dadosRefeicao.desjejum) {
    const d = dadosRefeicao.desjejum;
    return [
      { titulo: "Pães / Carboidratos", itens: limparLista(d.pao) },
      { titulo: "Raiz ou Farináceo", itens: limparLista(d.raiz_ou_farinaceio) },
      {
        titulo: "Opção Ovolactovegetariana",
        itens: limparLista(d.ovolactovegetariano),
      },
      { titulo: "Fruta", itens: limparLista(d.fruta) },
      { titulo: "Bebidas", itens: d.bebida || [] },
    ].filter((secao) => secao.itens.length > 0);
  }

  if (tipo === "almoco" && dadosRefeicao.almoco) {
    const a = dadosRefeicao.almoco;
    return [
      {
        titulo: "Prato Principal",
        itens: limparLista([a.proteina, a.opcao_proteina]),
      },
      {
        titulo: "Acompanhamentos",
        itens: limparLista([a.acompanhamento_I, a.acompanhamento_II]),
      },
      { titulo: "Guarnição", itens: limparLista(a.guarnicao) },
      {
        titulo: "Saladas",
        itens: limparLista([a.salada_crua, a.salada_cozida]),
      },
      {
        titulo: "Opção Ovolactovegetariana",
        itens: a.ovolactovegetariano || [],
      },
      { titulo: "Sobremesa", itens: limparLista(a.fruta) },
      { titulo: "Suco", itens: limparLista(a.suco) },
    ].filter((secao) => secao.itens.length > 0);
  }

  if (tipo === "jantar" && dadosRefeicao.jantar) {
    const j = dadosRefeicao.jantar;
    return [
      { titulo: "Prato Principal / Proteína", itens: limparLista(j.proteina) },
      { titulo: "Sopa", itens: limparLista(j.sopa) },
      { titulo: "Raiz ou Farináceo", itens: limparLista(j.raiz_ou_farinaceio) },
      { titulo: "Acompanhamentos", itens: limparLista(j.pao) },
      {
        titulo: "Opção Ovolactovegetariana",
        itens: j.ovolactovegetariano || [],
      },
      { titulo: "Bebidas", itens: j.bebida || [] },
    ].filter((secao) => secao.itens.length > 0);
  }

  return [];
}

export function WeeklyPage() {
  const { data: weeklyData, isLoading, isError, refetch } = useWeeklyMenu();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pt-4">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MealSkeleton />
          <MealSkeleton />
          <MealSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Não foi possível carregar o cardápio da semana. Tente novamente mais tarde."
        onRetry={refetch}
      />
    );
  }

  const listaDias = weeklyData?.cardapio;

  if (!listaDias || !Array.isArray(listaDias) || listaDias.length === 0) {
    return (
      <EmptyState
        title="Nenhum cardápio cadastrado"
        message="O cardápio para esta semana ainda não foi publicado pela administração do restaurante."
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Topo da página */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-0.5">
            Cronograma Semanal
          </span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-gray-400" />
            Cardápio da Semana
          </h1>
        </div>
        {weeklyData.data_inicio && weeklyData.data_fim && (
          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 self-start md:self-auto">
            Vigência: {weeklyData.data_inicio} até {weeklyData.data_fim}
          </span>
        )}
      </div>

      {/* Listagem dos Dias */}
      <div className="space-y-12">
        {listaDias.map((day: any, dayIndex: number) => {
          const refeicaoDoDia = day.refeicoes?.[0];

          return (
            <div
              key={dayIndex}
              className="space-y-4 border-b border-gray-100 pb-10 last:border-0 last:pb-0"
            >
              {/* Título do Dia da Semana */}
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg font-bold text-gray-800">{day.dia}</h2>
                <span className="text-xs font-medium text-gray-400">
                  • {day.data}
                </span>
              </div>

              {/* Cards de Refeição Dinâmicos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MealCard
                  title="Café da Manhã"
                  secoes={adaptarRefeicaoDinamica(refeicaoDoDia, "desjejum")}
                />
                <MealCard
                  title="Almoço"
                  secoes={adaptarRefeicaoDinamica(refeicaoDoDia, "almoco")}
                />
                <MealCard
                  title="Jantar"
                  secoes={adaptarRefeicaoDinamica(refeicaoDoDia, "jantar")}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
