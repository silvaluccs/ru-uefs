import { useState, useEffect } from "react";
import { useTodayMenu, useCurrentMeal } from "@/features/menu/hooks/useMenu";
import { MealTabs } from "@/features/menu/components/MealTabs";
import { MealCard } from "@/features/menu/components/MealCard";
import { MealSkeleton } from "@/features/menu/components/MealSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Calendar, Clock, Info } from "lucide-react";
import type { MealType } from "@/types/menu";

interface SecaoRefeicao {
  titulo: string;
  itens: string[];
}

interface StatusRestaurante {
  estaAberto: boolean;
  refeicaoPredefinida: MealType;
  badgeTexto: string;
}

function obterStatusErefeicaoAtual(): StatusRestaurante {
  const agora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const horas = agora.getHours();
  const minutos = agora.getMinutes();
  const tempoEmMinutos = horas * 60 + minutos;

  const inicioCafé = 6 * 60 + 30;
  const fimCafé = 9 * 60;

  const inicioAlmoco = 11 * 60;
  const fimAlmoco = 14 * 60 + 30;

  const inicioJantar = 17 * 60 + 30;
  const fimJantar = 19 * 60 + 30;

  if (tempoEmMinutos >= 0 && tempoEmMinutos < fimCafé) {
    if (tempoEmMinutos >= inicioCafé) {
      return {
        estaAberto: true,
        refeicaoPredefinida: "breakfast",
        badgeTexto: "Café da manhã até 09:00",
      };
    }
    return {
      estaAberto: false,
      refeicaoPredefinida: "breakfast",
      badgeTexto: "Abre às 06:30 (Café da Manhã)",
    };
  }

  if (tempoEmMinutos >= fimCafé && tempoEmMinutos < fimAlmoco) {
    if (tempoEmMinutos >= inicioAlmoco) {
      return {
        estaAberto: true,
        refeicaoPredefinida: "lunch",
        badgeTexto: "Almoço até 14:30",
      };
    }
    return {
      estaAberto: false,
      refeicaoPredefinida: "lunch",
      badgeTexto: "Abre às 11:00 (Almoço)",
    };
  }

  if (tempoEmMinutos >= fimAlmoco && tempoEmMinutos < fimJantar) {
    if (tempoEmMinutos >= inicioJantar) {
      return {
        estaAberto: true,
        refeicaoPredefinida: "dinner",
        badgeTexto: "Jantar até 19:30",
      };
    }
    return {
      estaAberto: false,
      refeicaoPredefinida: "dinner",
      badgeTexto: "Abre às 17:30 (Jantar)",
    };
  }

  return {
    estaAberto: false,
    refeicaoPredefinida: "breakfast",
    badgeTexto: "Abre amanhã às 06:30",
  };
}

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

export function HomePage() {
  const {
    data: todayMenu,
    isLoading: isLoadingMenu,
    isError: isErrorMenu,
    refetch: refetchMenu,
  } = useTodayMenu();
  const { data: currentMeal } = useCurrentMeal();

  const [selectedTab, setSelectedTab] = useState<MealType | null>(null);
  const [statusRu, setStatusRu] = useState<StatusRestaurante>(
    obterStatusErefeicaoAtual(),
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setStatusRu(obterStatusErefeicaoAtual());
    }, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const activeTab: MealType =
    selectedTab ??
    (currentMeal?.isActive
      ? currentMeal.mealType
      : statusRu.refeicaoPredefinida);

  if (isLoadingMenu) {
    return (
      <div className="space-y-6 max-w-md mx-auto pt-4">
        <MealSkeleton />
      </div>
    );
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

  const dadosTermo = todayMenu.refeicoes[0];

  const tabTitles: Record<MealType, string> = {
    breakfast: "Café da Manhã",
    lunch: "Almoço Completo",
    dinner: "Jantar Completo",
  };

  const tipoApi =
    activeTab === "breakfast"
      ? "desjejum"
      : activeTab === "lunch"
        ? "almoco"
        : "jantar";

  return (
    <div className="max-w-md mx-auto space-y-5 flex flex-col min-h-[calc(100vh-80px)] animate-fade-in">
      {/* Conteúdo Principal */}
      <div className="flex-1 space-y-5">
        {/* Cabeçalho da Página */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-0.5">
              Cardápio Diário
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {todayMenu.dia}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium border border-gray-100">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayMenu.data}</span>
          </div>
        </div>

        {/* Badge de Status */}
        <div className="flex justify-center pt-1">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-xs border transition-all duration-300 ${statusRu.estaAberto
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-amber-50 border-amber-100 text-red-700"
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${statusRu.estaAberto ? "bg-emerald-500" : "bg-red-500"} animate-pulse`}
              style={{ animationDuration: "2s" }}
            />
            <span>
              {statusRu.estaAberto ? "Aberto agora: " : "Fechado: "}{" "}
              {statusRu.badgeTexto}
            </span>
          </div>
        </div>

        {/* Abas */}
        <MealTabs activeTab={activeTab} onChangeTab={setSelectedTab} />

        {/* Card Principal */}
        <MealCard
          title={tabTitles[activeTab]}
          secoes={adaptarRefeicaoDinamica(dadosTermo, tipoApi)}
          isCurrent={
            currentMeal?.isActive
              ? currentMeal.mealType === activeTab
              : statusRu.refeicaoPredefinida === activeTab
          }
          isOpen={statusRu.estaAberto}
        />
      </div>

      {/* Rodapé Independente Informativo e de Portfólio */}
      <footer className="pt-6 pb-2 border-t border-gray-100 text-center space-y-3 mt-auto">
        <div className="flex items-start gap-2 bg-slate-50 text-slate-600 text-left p-3 rounded-lg border border-slate-100/80">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Aviso:</strong> Este é um projeto totalmente{" "}
            <strong>independente</strong> e não possui vínculo oficial com a
            administração da UEFS. O cardápio exibido está sujeito a alterações
            ou atualizações pela instituição sem aviso prévio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs text-gray-400 font-medium">
          <span>Desenvolvido por Lucas Silva</span>
          <div className="flex items-center gap-4">
            {/* Link do LinkedIn com SVG Nativo */}
            <a
              href="https://linkedin.com/in/silvaluccs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>@silvaluccs</span>
            </a>

            {/* Link do GitHub com SVG Nativo */}
            <a
              href="https://github.com/silvaluccs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>silvaluccs</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
